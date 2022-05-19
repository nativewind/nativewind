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
  UseTailwindCallbackFlattern,
  UseTailwindOptions,
} from "./use-tailwind";

import { getRuntimeStyles } from "./runtime-styles";
import { AtRuleRecord } from "./types/common";
import { ChildClassNameSymbol } from "./use-styled-props";

type WithChildClassNameSymbol<T> = T & {
  [ChildClassNameSymbol]?: AtRuleRecord[];
};

export function useTailwind<
  P extends ViewStyle | TextStyle | ImageStyle | RWNCssStyle
>(
  options: UseTailwindOptions & { flatten: true }
): UseTailwindCallbackFlattern<P>;
export function useTailwind<
  P extends ViewStyle | TextStyle | ImageStyle | RWNCssStyle
>(options?: UseTailwindOptions): UseTailwindCallback<P>;
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
