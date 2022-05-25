import { ImageStyle, TextStyle, ViewStyle } from "react-native";
import { classNameToInlineStyle } from "./classname-to-inline-style";
import { usePlatform } from "./context/platform";
import {
  RWNCssStyle,
  UseTailwindCallback,
  UseTailwindOptions,
} from "./use-tailwind";

import { useTailwind as useNativeTailwind } from "./use-tailwind.native";

export function useTailwind<
  P extends ViewStyle | TextStyle | ImageStyle | RWNCssStyle
>(options?: UseTailwindOptions): UseTailwindCallback<P> {
  const { platform, preview } = usePlatform();

  if (platform === "web" && preview) {
    return ((className = "") => {
      return options?.flatten
        ? classNameToInlineStyle(className)
        : { $$css: true, tailwindClassName: className };
    }) as UseTailwindCallback<P>;
  }

  return useNativeTailwind<P>(options);
}
