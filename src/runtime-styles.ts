import { ColorSchemeName, ViewStyle, StyleSheet } from "react-native";
import { ComponentContext } from "./context/component";
import { DeviceMediaContext } from "./context/device-media";
import { StyleSheetContext } from "./context/style-sheet";
import { matchAtRule } from "./match-at-rule";
import { normalizeSelector } from "./shared/selector";
import { AtRuleRecord } from "./types/common";

import vh from "./units/vh";
import vw from "./units/vw";

export interface GetStylesOptions {
  className: string;
  hover: boolean;
  focus: boolean;
  active: boolean;
  stylesheetContext: StyleSheetContext;
  platform: string;
  colorScheme: ColorSchemeName;
  componentInteraction: ComponentContext;
  deviceMediaContext: DeviceMediaContext;
}

const cache: Record<string, [unknown[], AtRuleRecord[]]> = {};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const dynamicStyles: Record<string, (value: string) => any> = {
  vw,
  vh,
};

export function getRuntimeStyles<T>({
  className,
  hover,
  focus,
  active,
  stylesheetContext,
  platform,
  colorScheme,
  componentInteraction,
  deviceMediaContext,
}: GetStylesOptions): [T[], AtRuleRecord[]] {
  if (cache[className]) return cache[className] as [T[], AtRuleRecord[]];

  const { styles, media } = stylesheetContext;
  const tailwindStyles: T[] = [];
  const childStyles: AtRuleRecord[] = [];
  const transforms: ViewStyle["transform"] = [];

  let canCache = false;

  for (const name of className.split(/\s+/)) {
    if (!name) continue; // Happens if there are leading or trailing whitespace

    const selector = normalizeSelector(name);

    /**
     * If we have static styles, add them
     */
    if (styles[selector]) {
      const { transform, ...style } = flattenIfRWN(styles[selector]);

      tailwindStyles.push(style as T);

      if (transform) {
        transforms.push(...transform);
      }
    }

    /**
     * Media styles contain atRules and need to be validated
     */
    if (media[selector]) {
      canCache = true;

      for (const [index, atRules] of media[selector].entries()) {
        let isForChildren = false;
        let dynamicStyleKey: string | undefined;

        const atRulesResult = atRules.every(([rule, params]) => {
          /**
           * This is a magic string, but it makes sense
           * Child selectors look like this and will always start with (>
           *
           * @selector (> *:not(:first-child))
           * @selector (> *)
           */
          if (rule === "selector" && params && params.startsWith("(>")) {
            isForChildren = true;
            return true;
          }

          if (rule === "dynamicStyle") {
            dynamicStyleKey = params;
            return true;
          }

          return matchAtRule({
            rule,
            params,
            hover,
            active,
            focus,
            platform,
            colorScheme,
            componentInteraction,
            deviceMediaContext,
          });
        });

        const { transform, ...style } = flattenIfRWN(
          styles[`${selector}.${index}`]
        );

        if (dynamicStyleKey) {
          for (const [key, value] of Object.entries(style)) {
            style[key as keyof typeof style] =
              dynamicStyles[dynamicStyleKey](value);
          }
        }

        if (isForChildren) {
          transform
            ? childStyles.push({ transform, ...style, atRules })
            : childStyles.push({ ...style, atRules });
        } else if (atRulesResult) {
          tailwindStyles.push(style as T);

          if (transform) {
            transforms.push(...transform);
          }
        }
      }
    }
  }

  if (transforms.length > 0) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    tailwindStyles.push({ transform: transforms } as any);
  }

  // If these styles are 100% static, then we can cache them
  if (!canCache) {
    cache[className] = [tailwindStyles, childStyles];
  }

  if (childStyles.length > 0) {
    return [tailwindStyles, childStyles];
  }

  return [tailwindStyles, []];
}

function flattenIfRWN<T>(value: number | T): T {
  // For RWN <=0.17 we need to convert the styleID into an object to handle
  // merging transform.
  //
  // This is a performance issue, but hopefully move people will move onto
  // RWN 0.18 and use CSS

  return typeof value === "number" ? (StyleSheet.flatten(value) as T) : value;
}
