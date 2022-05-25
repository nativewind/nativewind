import { TextStyle, ViewStyle, StyleSheet, ImageStyle } from "react-native";
import {
  RWNCssStyle,
  UseTailwindCallback,
  UseTailwindCallbackOptions,
  UseTailwindCallbackResult,
  UseTailwindOptions,
} from "./use-tailwind";

import { getRuntimeStyles } from "./runtime-styles";
import { ChildClassNameSymbol } from "./with-styled-props";
import { usePlatform } from "./context/platform";
import { useStyleSheet } from "./context/style-sheet";
import { useDeviceMedia } from "./context/device-media";
import { useComponent } from "./context/component";
import { useColorScheme } from "./context/color-scheme";

export function useTailwind<
  P extends ViewStyle | TextStyle | ImageStyle | RWNCssStyle
>({
  hover = false,
  focus = false,
  active = false,
}: UseTailwindOptions = {}): UseTailwindCallback<P> {
  const { platform } = usePlatform();

  const { colorScheme } = useColorScheme();
  const stylesheetContext = useStyleSheet();
  const deviceMediaContext = useDeviceMedia();
  const componentInteraction = useComponent();

  function callback<F extends boolean | undefined = true>(
    className = "",
    { flatten = true }: UseTailwindCallbackOptions<F> = {}
  ) {
    const [styles, childStyles] = getRuntimeStyles<P>({
      className,
      hover,
      focus,
      active,
      stylesheetContext,
      platform,
      colorScheme,
      componentInteraction,
      deviceMediaContext,
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
