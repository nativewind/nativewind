import { useContext } from "react";
import { useWindowDimensions, StyleProp } from "react-native";
import { useDeviceOrientation } from "@react-native-community/hooks";
import { match } from "css-mediaquery";
import { normaliseSelector } from "./shared/selector";
import { Style } from "./types/common";

import {
  TailwindColorSchemeContext,
  TailwindMediaContext,
  TailwindPlatformContext,
  TailwindStyleContext,
} from "./context";

export function useTailwind<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  P extends Style = any
>(className = ""): StyleProp<P> {
  const platform = useContext(TailwindPlatformContext);

  if (!platform) {
    throw new Error(
      "No platform details found. Make sure all components are within a TailwindProvider with the platform attribute set."
    );
  }

  if (platform === "web") {
    return {
      $$css: true,
      tailwindClassName: className,
    } as unknown as StyleProp<P>;
  }

  const styles = useContext(TailwindStyleContext);
  const mediaRules = useContext(TailwindMediaContext);
  const colorScheme = useContext(TailwindColorSchemeContext);
  const { width, height } = useWindowDimensions();
  // const { reduceMotionEnabled: reduceMotion } = useAccessibilityInfo() // We should support this
  const orientation = useDeviceOrientation().portrait
    ? "portrait"
    : "landscape";

  const tailwindStyleIds: StyleProp<P> = [];

  for (const name of className.split(" ")) {
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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any);

      if (isMatch) {
        tailwindStyleIds.push(styles[`${selector}_${index}`] as P);
      }
    }
  }

  return tailwindStyleIds;
}
