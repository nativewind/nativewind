import { ImageStyle, TextStyle, ViewStyle } from "react-native";
import { classNameToInlineStyle } from "./classname-to-inline-style";
import { usePlatform } from "./context/platform";
import {
  RWNCssStyle,
  UseTailwindCallback,
  UseTailwindCallbackOptions,
  UseTailwindOptions,
} from "./use-tailwind";

import { useTailwind as useNativeTailwind } from "./use-tailwind.native";

export function useTailwind<
  P extends ViewStyle | TextStyle | ImageStyle | RWNCssStyle
>(useTailwindOptions?: UseTailwindOptions): UseTailwindCallback<P> {
  const { platform, preview } = usePlatform();

  if (platform === "web" && preview) {
    return (<F extends boolean | undefined = true>(
      className = "",
      { flatten = true }: UseTailwindCallbackOptions<F> = {}
    ) => {
      return flatten
        ? classNameToInlineStyle(className, useTailwindOptions)
        : { $$css: true, [className]: className };
    }) as UseTailwindCallback<P>;
  }

  return useNativeTailwind<P>(useTailwindOptions);
}
