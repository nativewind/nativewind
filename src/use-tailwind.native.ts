import { useContext, useState } from "react";
import {
  TextStyle,
  ViewStyle,
  StyleSheet,
  ImageStyle,
  Platform,
} from "react-native";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { match } from "css-mediaquery";
import { normaliseSelector } from "./shared/selector";
import { ComponentContext, TailwindContext } from "./context";
import {
  RWNCssStyle,
  UseTailwindCallback,
  UseTailwindOptions,
} from "./use-tailwind";

import { ChildClassNameSymbol } from "./utils/child-styles";
import { StyleArray } from "./types/common";

type WithChildClassNameSymbol<T> = T & {
  [ChildClassNameSymbol]?: string;
};

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
/*
 * White space for visual clarity :)
 */
export function useTailwind<P>({
  hover,
  focus,
  active,
  [ChildClassNameSymbol]: inheritedClassNames = "",
  nthChild: initialNthChild = 0,
}: UseTailwindOptions = {}) {
  const { platform, styles, media, width, height, orientation, colorScheme } =
    useContext(TailwindContext);

  const componentInteraction = useContext(ComponentContext);

  // useState ensure this 'resets' every render
  let [nthChild] = useState(initialNthChild);

  assertPlatform(platform);

  return (className = "") => {
    const tailwindStyles = {} as WithChildClassNameSymbol<P>;
    const transforms: ViewStyle["transform"] = [];
    const childClassNameSet = new Set<string>();
    nthChild++;

    for (const name of `${className} ${inheritedClassNames}`
      .trim()
      .split(/\s+/)) {
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

          const { atRules, ...rest } = styleRecord;

          const atRulesResult = atRules.every(([rule, params]) => {
            if (rule === "selector" && params === "(> * + *)") {
              isForChildren = !name.startsWith(">");
              return nthChild > 1;
            } else if (rule === "pseudo-class" && params === "hover") {
              return hover;
            } else if (rule === "pseudo-class" && params === "focus") {
              return focus;
            } else if (rule === "pseudo-class" && params === "active") {
              return active;
            } else if (rule === "component" && params === "hover") {
              return componentInteraction.hover;
            } else if (rule === "component" && params === "focus") {
              return componentInteraction.focus;
            } else if (rule === "component" && params === "active") {
              return componentInteraction.active;
            } else if (rule === "media") {
              return match(params, {
                "aspect-ratio": width / height,
                "device-aspect-ratio": width / height,
                type: platform,
                width,
                height,
                "device-width": width,
                "device-height": width,
                orientation,
                "prefers-color-scheme": colorScheme,
              });
            }

            return false;
          });

          if (!atRulesResult) {
            // If one of the atRules don't match, skip this className
            continue;
          }

          if (isForChildren) {
            // atRules can force the selector to be applied to the children
            // So add it to childClassName and skip this className
            childClassNameSet.add(`>${name}`);
            continue;
          } else {
            styleRecord = rest;
          }
        }

        const { transform, ...rest } = styleRecord;

        if (styles) {
          Object.assign(tailwindStyles, rest);
        }

        if (transform) {
          transforms.push(...transform);
        }
      }
    }

    if (transforms.length > 0) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (tailwindStyles as any).transform = transforms;
    }

    if (childClassNameSet.size > 0) {
      tailwindStyles[ChildClassNameSymbol] = [...childClassNameSet].join(" ");
    }

    return Platform.OS === "web"
      ? StyleSheet.flatten(tailwindStyles) // RNW <=0.17 still uses ReactNativePropRegistry
      : tailwindStyles;
  };
}

function assertPlatform(platform: string): asserts platform is string {
  if (!platform) {
    throw new Error(
      "No platform details found. Make sure all components are within a TailwindProvider with the platform attribute set."
    );
  }
}
