import { ColorSchemeName, ViewStyle, StyleSheet } from "react-native";
import { ComponentContext } from "./context/component";
import { DeviceMediaContext } from "./context/device-media";
import { StyleSheetContext } from "./context/style-sheet";
import { matchAtRule } from "./match-at-rule";
import { normalizeSelector } from "./shared/selector";
import { AtRuleRecord } from "./types/common";

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
  const { styles, media } = stylesheetContext;
  const tailwindStyles: T[] = [];
  const childStyles: AtRuleRecord[] = [];
  const transforms: ViewStyle["transform"] = [];

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
      const atRuleStyles: AtRuleRecord[] = media[selector].map(
        (atRules, index) => ({
          ...flattenIfRWN(styles[`${selector}.${index}`]),
          atRules,
        })
      );

      for (const styleRecord of atRuleStyles) {
        const { atRules, transform, ...style } = styleRecord;

        let isForChildren = false;
        let shouldInline = false;

        const atRulesResult = atRules.every(([rule, params]) => {
          /**
           * This is a match string, but it makes sense
           * Child selectors look like this and will always start with (>
           *
           * @selector (> *:not(:first-child))
           * @selector (> *)
           */
          if (rule === "selector" && params.startsWith("(>")) {
            isForChildren = true;
            return true;
          }

          shouldInline ||= rule === "dynamic-style";

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

        if (isForChildren) {
          childStyles.push(styleRecord);
        } else if (atRulesResult) {
          if (shouldInline) {
            tailwindStyles.push({ ...style } as T);
          } else {
            tailwindStyles.push(style as T);
          }

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
