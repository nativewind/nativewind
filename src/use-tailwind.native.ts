import { useContext } from "react";
import { TextStyle, ViewStyle, StyleSheet, ImageStyle } from "react-native";
import {
  RWNCssStyle,
  UseTailwindCallback,
  UseTailwindCallbackOptions,
  UseTailwindCallbackResult,
  UseTailwindOptions,
} from "./use-tailwind";

import { ComponentContext, useTailwindContext } from "./context";
import { getRuntimeStyles } from "./runtime-styles";
import { ChildClassNameSymbol } from "./with-styled-props";

export function useTailwind<
  P extends ViewStyle | TextStyle | ImageStyle | RWNCssStyle
>({
  hover = false,
  focus = false,
  active = false,
}: UseTailwindOptions = {}): UseTailwindCallback<P> {
  const tailwindContext = useTailwindContext();
  const componentInteraction = useContext(ComponentContext);

  function callback<F extends boolean | undefined = true>(
    className = "",
    { flatten = true }: UseTailwindCallbackOptions<F> = {}
  ) {
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
    ) as UseTailwindCallbackResult<P, F>;

    if (childStyles.length > 0) {
      result[ChildClassNameSymbol] = childStyles;
    }

    return result;
  }

  return callback;
}
