import { useContext } from "react";
import {
  useWindowDimensions,
  StyleProp,
  ViewStyle,
  TextStyle,
  ImageStyle,
} from "react-native";
import { normaliseSelector } from "./shared/selector";
import { match as matchMediaQuery } from "css-mediaquery";

import {
  TailwindColorSchemeContext,
  TailwindMediaContext,
  TailwindPlatformContext,
  TailwindStyleContext,
} from "./context";
import { useDeviceOrientation } from "@react-native-community/hooks";

export function useTailwind<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  P extends ViewStyle | TextStyle | ImageStyle = any
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

    for (const [media, suffix] of mediaRules[selector] ?? []) {
      const isMatch = matchMediaQuery(media, {
        width,
        "device-width": width,
        "device-height": width,
        height,
        orientation,

        "prefers-color-scheme": colorScheme,
      });

      if (isMatch) {
        tailwindStyleIds.push(styles[`${selector}_${suffix}`] as P);
      }
    }
  }

  return tailwindStyleIds;
}
