import { useContext } from "react";
import { useWindowDimensions } from "react-native";
import { normaliseSelector } from "./shared/selector";
import { match as matchMediaQuery } from "css-mediaquery";

import {
  TailwindColorSchemeContext,
  TailwindMediaContext,
  TailwindPlatformContext,
  TailwindStyleContext,
} from "./context";
import {
  // useAccessibilityInfo,
  useDeviceOrientation,
} from "@react-native-community/hooks";

export function useTailwind(className = "") {
  const platform = useContext(TailwindPlatformContext);

  if (!platform) {
    throw new Error(
      "No platform details found. Make sure all components are within a TailwindProvider with the platform attribute set."
    );
  }

  if (platform === "web") {
    return { $$css: true, tailwindClassName: className };
  }

  const styles = useContext(TailwindStyleContext);
  const mediaRules = useContext(TailwindMediaContext);
  const colorScheme = useContext(TailwindColorSchemeContext);
  const { width, height } = useWindowDimensions();
  // const { reduceMotionEnabled: reduceMotion } = useAccessibilityInfo()
  const orientation = useDeviceOrientation().portrait
    ? "portrait"
    : "landscape";

  const tailwindStyleIds = className.split(" ").flatMap((className) => {
    const selector = normaliseSelector(className);
    const styleIds: unknown[] = [];

    if (styles[selector]) {
      styleIds.push(styles[selector]);
    }

    for (const { media, suffix } of mediaRules[selector] ?? []) {
      if (!media) {
        styleIds.push(styles[`${className}_${suffix}`]);
        continue;
      }

      const query = media.join(" and ");

      const isMatch = matchMediaQuery(query, {
        width,
        height,
        orientation,
        "prefers-color-scheme": colorScheme,
      });

      if (isMatch) {
        styleIds.push(styles[`${selector}${suffix}`]);
      }
    }
    return styleIds;
  });

  return tailwindStyleIds;
}
