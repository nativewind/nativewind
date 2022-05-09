import { useContext } from "react";
import { ImageStyle, TextStyle, ViewStyle } from "react-native";
import { TailwindPlatformContext, TailwindPreviewContext } from "./context";
import {
  RWNCssStyle,
  UseTailwindCallback,
  UseTailwindOptions,
} from "./use-tailwind";

import { useTailwind as useNativeTailwind } from "./use-tailwind.native";

let element: HTMLElement;

export function useTailwind<P extends ViewStyle>(
  options?: UseTailwindOptions
): UseTailwindCallback<P>;
export function useTailwind<P extends TextStyle>(
  options?: UseTailwindOptions
): UseTailwindCallback<P>;
export function useTailwind<P extends ImageStyle>(
  options?: UseTailwindOptions
): UseTailwindCallback<P>;
export function useTailwind<P extends RWNCssStyle>(
  options?: UseTailwindOptions
): UseTailwindCallback<P>;
export function useTailwind<P>(options?: UseTailwindOptions) {
  const platform = useContext(TailwindPlatformContext);
  const preview = useContext(TailwindPreviewContext);

  if (!platform) {
    throw new Error(
      "No platform details found. Make sure all components are within a TailwindProvider with the platform attribute set."
    );
  }

  if (platform === "web" && preview) {
    return (className = "") => {
      const style: RWNCssStyle = {
        $$css: true,
        tailwindClassName: className,
      };

      let computedStyles: CSSStyleDeclaration;

      return new Proxy(style, {
        get(_, property: string | number | symbol) {
          if (property in style) {
            return style[property as keyof RWNCssStyle];
          }

          computedStyles ??= getComputedStyle(className);

          return computedStyles[property as keyof CSSStyleDeclaration];
        },
      });
    };
  }

  return useNativeTailwind<P>(options);
}

function getComputedStyle(className = ""): CSSStyleDeclaration {
  if (typeof window !== "undefined") {
    if (!element) {
      element = document.createElement("tailwindcss-react-native"); // Use custom element to avoid styles
      element.setAttribute("aria-hidden", "true");
      element.style.position = "absolute";
      element.style.width = "1px";
      element.style.height = "1px";
      element.style.padding = "0";
      element.style.margin = "-1px";
      element.style.overflow = "hidden";
      element.style.whiteSpace = "nowrap";
      element.style.borderWidth = "0";
      document.body.append(element);
    }

    const newElement = document.createElement("tailwindcss-react-native"); // Use custom element to avoid styles
    newElement.setAttribute("class", className);
    element.append(newElement);
    return { ...window.getComputedStyle(newElement) };
  } else {
    return {} as CSSStyleDeclaration;
  }
}
