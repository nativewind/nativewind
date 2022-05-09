import {
  useWindowDimensions,
  TextStyle,
  ViewStyle,
  StyleSheet,
  ImageStyle,
  Platform,
} from "react-native";
import { useContext } from "react";

import { useDeviceOrientation } from "@react-native-community/hooks";
import { match } from "css-mediaquery";
import { normaliseSelector } from "./shared/selector";

import {
  TailwindColorSchemeContext,
  TailwindMediaContext,
  TailwindPlatformContext,
  TailwindStyleContext,
} from "./context";

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
  const platform = useContext(TailwindPlatformContext);
  const styles = useContext(TailwindStyleContext);
  const mediaRules = useContext(TailwindMediaContext);
  const colorScheme = useContext(TailwindColorSchemeContext);
  const { width, height } = useWindowDimensions();
  // const { reduceMotionEnabled: reduceMotion } = useAccessibilityInfo() // We should support this
  const orientation = useDeviceOrientation().portrait
    ? "portrait"
    : "landscape";

  if (!platform) {
    throw new Error(
      "No platform details found. Make sure all components are within a TailwindProvider with the platform attribute set."
    );
  }

  return (className = "") => {
    let tailwindStyles = {} as P;

    for (const name of `${siblingClassName} ${className}`.trim().split(" ")) {
      const selector = normaliseSelector(name);

      if (styles[selector]) {
        tailwindStyles = {
          ...tailwindStyles,
          ...styles[selector],
        };
      }

      const rules = mediaRules[selector];

      if (!rules) {
        continue;
      }

      for (let index = 0, length = rules.length; index < length; index++) {
        const isMatch = match(rules[index], {
          type: platform,
          width,
          height,
          "device-width": width,
          "device-height": width,
          orientation,
          "prefers-color-scheme": colorScheme,
        });

        if (isMatch) {
          tailwindStyles = {
            ...tailwindStyles,
            ...styles[`${selector}.${index}`],
          };
        }
      }
    }

    return Platform.OS === "web"
      ? StyleSheet.flatten(tailwindStyles) // RNW <=0.17 still uses ReactNativePropRegistry
      : tailwindStyles;
  };
}
