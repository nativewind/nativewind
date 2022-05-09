/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  useWindowDimensions,
  StyleProp,
  StyleSheet,
  TextStyle,
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

const computedStyles = new WeakMap();

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
    const tailwindStyleIds: StyleProp<P> = [];

    for (const name of `${siblingClassName} ${className}`.trim().split(" ")) {
      const selector = normaliseSelector(name);

      if (styles[selector]) {
        tailwindStyleIds.push(styles[selector] as P);
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
          tailwindStyleIds.push(styles[`${selector}.${index}`] as P);
        }
      }
    }

    const proxy = new Proxy(tailwindStyleIds, {
      get(target, property: string | number | symbol) {
        if (property in tailwindStyleIds) {
          return tailwindStyleIds[property as keyof typeof tailwindStyleIds];
        }

        if (!computedStyles.has(tailwindStyleIds)) {
          computedStyles.set(
            tailwindStyleIds,
            StyleSheet.flatten(tailwindStyleIds)
          );
        }

        return computedStyles.get(target)[property];
      },
    });

    return proxy as StyleProp<P> & TextStyle;
  };
}
