import { ImageStyle, TextStyle, ViewStyle } from "react-native";
import { useTailwindContext } from "./context";
import {
  RWNCssStyle,
  UseTailwindCallback,
  UseTailwindOptions,
} from "./use-tailwind";

import { useTailwind as useNativeTailwind } from "./use-tailwind.native";

export function useTailwind<
  P extends ViewStyle | TextStyle | ImageStyle | RWNCssStyle
>(options?: UseTailwindOptions): UseTailwindCallback<P> {
  const { platform, preview } = useTailwindContext();

  if (platform === "web" && preview) {
    return (className = "") => {
      return {
        $$css: true,
        tailwindClassName: className,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any;
    };
  }

  return useNativeTailwind<P>(options);
}
