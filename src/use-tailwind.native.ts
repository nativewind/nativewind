/* eslint-disable @typescript-eslint/no-explicit-any */
import { useWindowDimensions, StyleProp } from "react-native";
import { useContext } from "react";

import { useDeviceOrientation } from "@react-native-community/hooks";
import { match } from "css-mediaquery";
import { normaliseSelector } from "./shared/selector";

import {
  TailwindColorSchemeContext,
  TailwindMediaContext,
  TailwindPlatformContext,
  TailwindPreviewContext,
  TailwindStyleContext,
} from "./context";

export function useTailwind<P>({ siblingClassName = "" } = {}) {
  const platform = useContext(TailwindPlatformContext);
  const styles = useContext(TailwindStyleContext);
  const mediaRules = useContext(TailwindMediaContext);
  const colorScheme = useContext(TailwindColorSchemeContext);
  const preview = useContext(TailwindPreviewContext);
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
    if (platform === "web" && preview) {
      return {
        $$css: true,
        tailwindClassName: className,
      } as unknown as StyleProp<P>;
    }

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

    return tailwindStyleIds;
  };
}
