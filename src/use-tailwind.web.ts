import { ImageStyle, TextStyle, ViewStyle } from "react-native";
import { classNameToInline } from "./classname-to-inline";
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
        ? classNameToInline(className)
        : { $$css: true, tailwindClassName: className };
    }) as UseTailwindCallback<P>;
  }

  return useNativeTailwind<P>(options);
}
