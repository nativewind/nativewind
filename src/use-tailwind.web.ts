import { useContext } from "react";
import { ImageStyle, StyleProp, TextStyle, ViewStyle } from "react-native";
import { TailwindPlatformContext, TailwindPreviewContext } from "./context";
import {
  RWNCssStyle,
  UseTailwindCallback,
  UseTailwindOptions,
} from "./use-tailwind";

import { useTailwind as useNativeTailwind } from "./use-tailwind.native";

export function useTailwind<P extends ViewStyle>(
  options?: UseTailwindOptions
): (className?: string) => P;
export function useTailwind<P extends TextStyle>(
  options?: UseTailwindOptions
): (className?: string) => P;
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
      return {
        $$css: true,
        tailwindClassName: className,
      } as unknown as StyleProp<P>;
    };
  }

  return useNativeTailwind<P>(options);
}
