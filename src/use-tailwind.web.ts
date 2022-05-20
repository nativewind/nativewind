import { ImageStyle, TextStyle, ViewStyle } from "react-native";
import { useTailwindContext } from "./context";
import {
  RWNCssStyle,
  UseTailwindCallback,
  UseTailwindCallbackFlattern,
  UseTailwindOptions,
} from "./use-tailwind";

import { useTailwind as useNativeTailwind } from "./use-tailwind.native";

/*
 * Flatten: true
 */
export function useTailwind<
  P extends ViewStyle | TextStyle | ImageStyle | RWNCssStyle
>(
  options: UseTailwindOptions & { flatten: true }
): UseTailwindCallbackFlattern<P>;
/*
 * Normal usage
 */
export function useTailwind<
  P extends ViewStyle | TextStyle | ImageStyle | RWNCssStyle
>(options?: UseTailwindOptions): UseTailwindCallback<P>;
/**
 * Actual implementation
 */
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
