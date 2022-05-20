import { useContext } from "react";
import {
  TextStyle,
  ViewStyle,
  StyleSheet,
  ImageStyle,
  StyleProp,
} from "react-native";
import {
  RWNCssStyle,
  UseTailwindCallback,
  UseTailwindCallbackFlattern,
  UseTailwindOptions,
} from "./use-tailwind";

import { ComponentContext, useTailwindContext } from "./context";
import { getRuntimeStyles } from "./runtime-styles";
import { AtRuleRecord } from "./types/common";
import { ChildClassNameSymbol } from "./with-styled-props";

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
  const tailwindContext = useTailwindContext();
  const componentInteraction = useContext(ComponentContext);

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
