import { useContext } from "react";
import { normaliseSelector } from "./shared/selector";
import {
  MediaRules,
  StyleRecord,
  TailwindColorSchemeContext,
  TailwindStyleContext,
} from "./context";
import { match as matchMediaQuery } from "css-mediaquery";
import {
  // useAccessibilityInfo,
  useDeviceOrientation,
} from "@react-native-community/hooks";
import { useWindowDimensions } from "react-native";

export interface UseParseTailwindOptions {
  styles?: StyleRecord;
  media?: MediaRules;
}

export function useTailwind(
  classNames: string,
  {
    styles: additionalStyles = {},
    media: additionalMediaRules = {},
  }: UseParseTailwindOptions = {}
) {
  const { styles, media: mediaRules } = useContext(TailwindStyleContext);
  const colorScheme = useContext(TailwindColorSchemeContext);

  const { width, height } = useWindowDimensions();
  // const { reduceMotionEnabled: reduceMotion } = useAccessibilityInfo()
  const orientation = useDeviceOrientation().portrait
    ? "portrait"
    : "landscape";

  const allStyles = {
    ...styles,
    ...additionalStyles,
  };

  return (classNames ?? "").split(" ").flatMap((className) => {
    const selector = normaliseSelector(className);
    const styleIds: unknown[] = [];

    if (allStyles[selector]) {
      styleIds.push(allStyles[selector]);
    }

    const rules = [
      ...(mediaRules[selector] ?? []),
      ...(additionalMediaRules[selector] ?? []),
    ];

    for (const { media, suffix } of rules) {
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
        styleIds.push(allStyles[`${selector}${suffix}`]);
      }
    }

    return styleIds;
  });
}
