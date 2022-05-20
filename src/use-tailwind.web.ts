import { ImageStyle, TextStyle, ViewStyle } from "react-native";
import { useTailwindContext } from "./context";
import {
  RWNCssStyle,
  UseTailwindCallback,
  UseTailwindCallbackFlattern,
  UseTailwindOptions,
} from "./use-tailwind";

import { useTailwind as useNativeTailwind } from "./use-tailwind.native";

export function useTailwind<
  P extends ViewStyle | TextStyle | ImageStyle | RWNCssStyle
>(
  options: UseTailwindOptions & { flatten: true }
): UseTailwindCallbackFlattern<P>;
export function useTailwind<
  P extends ViewStyle | TextStyle | ImageStyle | RWNCssStyle
>(options?: UseTailwindOptions): UseTailwindCallback<P>;
export function useTailwind<P>(options?: UseTailwindOptions) {
  const { platform, preview } = useTailwindContext();

  if (platform === "web" && preview) {
    return (className = "") => {
      return {
        $$css: true,
        tailwindClassName: className,
      };
    };
  }

  return useNativeTailwind<P>(options);
}
