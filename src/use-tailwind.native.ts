import { useContext } from "react";
import {
  TextStyle,
  ViewStyle,
  StyleSheet,
  ImageStyle,
  Platform,
} from "react-native";

import { match } from "css-mediaquery";
import { normaliseSelector } from "./shared/selector";
import { TailwindContext } from "./context";
import {
  RWNCssStyle,
  UseTailwindCallback,
  UseTailwindOptions,
} from "./use-tailwind";

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
export function useTailwind<P>({ siblingClassName = "" } = {}) {
  const {
    platform,
    styles,
    media: mediaRules,
    width,
    height,
    orientation,
    colorScheme,
  } = useContext(TailwindContext);

  if (!platform) {
    throw new Error(
      "No platform details found. Make sure all components are within a TailwindProvider with the platform attribute set."
    );
  }

  return (className = "") => {
    let tailwindStyles = {} as P;
    const transforms: ViewStyle["transform"] = [];

    for (const name of `${siblingClassName} ${className}`.trim().split(" ")) {
      const selector = normaliseSelector(name);

      if (styles[selector]) {
        const { transform, ...rest } = styles[selector];
        tailwindStyles = {
          ...tailwindStyles,
          ...rest,
        };

        if (transform) {
          transforms.push(...transform);
        }
      }

      const rules = mediaRules[selector];

      if (!rules) {
        continue;
      }

      for (let index = 0, length = rules.length; index < length; index++) {
        const isMatch = match(rules[index], {
          "aspect-ratio": width / height,
          "device-aspect-ratio": width / height,
          type: platform,
          width,
          height,
          "device-width": width,
          "device-height": width,
          orientation,
          "prefers-color-scheme": colorScheme,
        });

        const { transform, ...rest } = styles[`${selector}.${index}`];

        if (isMatch) {
          tailwindStyles = {
            ...tailwindStyles,
            ...rest,
          };
        }

        if (transform) {
          transforms.push(...transform);
        }
      }
    }

    if (transforms.length > 0) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (tailwindStyles as any).transform = transforms;
    }

    return Platform.OS === "web"
      ? StyleSheet.flatten(tailwindStyles) // RNW <=0.17 still uses ReactNativePropRegistry
      : tailwindStyles;
  };
}
