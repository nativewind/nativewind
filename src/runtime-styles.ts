import { ViewStyle } from "react-native";
import { ComponentContext, TailwindContext } from "./context";
import { matchAtRule } from "./match-at-rule";
import { normaliseSelector } from "./shared/selector";
import { AtRuleRecord, StyleArray } from "./types/common";

export interface GetStylesOptions {
  className: string;
  hover: boolean;
  focus: boolean;
  active: boolean;
  tailwindContext: TailwindContext;
  componentInteraction: ComponentContext;
}

export function getRuntimeStyles<T>({
  className,
  hover,
  focus,
  active,
  componentInteraction,
  tailwindContext,
}: GetStylesOptions): [T[], AtRuleRecord[]] {
  const { styles, media } = tailwindContext;
  const tailwindStyles: T[] = [];
  const childStyles: AtRuleRecord[] = [];
  const transforms: ViewStyle["transform"] = [];

  for (const name of className.split(/\s+/)) {
    if (!name) continue; // Happens if there are leading or trailing whitespace

    const selector = normaliseSelector(name);

    const styleArray: StyleArray = [];

    if (styles[selector]) {
      styleArray.push(styles[selector]);
    }

    if (media[selector]) {
      styleArray.push(
        ...media[selector].map((atRules, index) => ({
          ...styles[`${selector}.${index}`],
          atRules,
        }))
      );
    }

    if (styleArray.length === 0) {
      continue;
    }

    for (let styleRecord of styleArray) {
      if ("atRules" in styleRecord) {
        let isForChildren = false;

        const { atRules, ...style } = styleRecord;

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

          return matchAtRule({
            rule,
            params,
            hover,
            active,
            focus,
            componentInteraction,
            tailwindContext,
          });
        });

        if (isForChildren) {
          childStyles.push(styleRecord);
          continue;
        } else if (atRulesResult) {
          styleRecord = style;
        } else {
          continue;
        }
      }

      const { transform, ...style } = styleRecord;

      tailwindStyles.push(style as T);

      if (transform) {
        transforms.push(...transform);
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
