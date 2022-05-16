import { useContext } from "react";
import {
  TextStyle,
  ViewStyle,
  StyleSheet,
  ImageStyle,
  StyleProp,
} from "react-native";
import { ComponentContext, TailwindContext } from "./context";
import {
  RWNCssStyle,
  UseTailwindCallback,
  UseTailwindOptions,
} from "./use-tailwind";

import { ChildClassNameSymbol } from "./utils/child-styles";
import { getRuntimeStyles } from "./runtime-styles";
import { AtRuleRecord } from "./types/common";

type WithChildClassNameSymbol<T> = T & {
  [ChildClassNameSymbol]?: AtRuleRecord[];
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
  hover = false,
  focus = false,
  active = false,
  flatten = true,
}: UseTailwindOptions = {}) {
  const tailwindContext = useContext(TailwindContext);
  const componentInteraction = useContext(ComponentContext);

  assertInContext(tailwindContext.platform);

  return (className = "") => {
    const [styles, childStyles] = getRuntimeStyles<P>({
      className,
      hover,
      focus,
      active,
      tailwindContext,
      componentInteraction,
    });

    const result = (
      flatten ? StyleSheet.flatten<P>(styles) : styles
    ) as WithChildClassNameSymbol<StyleProp<P>>;

    if (childStyles.length > 0) {
      result[ChildClassNameSymbol] = childStyles;
    }

    return result;
  };
}

function assertInContext(platform: string): asserts platform is string {
  if (!platform) {
    throw new Error(
      "No platform details found. Make sure all components are within a TailwindProvider with the platform attribute set."
    );
  }
}
