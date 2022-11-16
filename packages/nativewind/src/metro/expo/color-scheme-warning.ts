import { getConfig } from "@expo/config";

import isExpo from "./is-metro";

export function expoColorSchemeWarning(main: string) {
  if (!isExpo(main)) {
    return;
  }

  const config = getConfig(process.cwd());

  if (config.exp.userInterfaceStyle === undefined) {
    console.warn(
      `NativeWind: Your Expo app does not have a 'userInterfaceStyle' setting. This can lead to confusing color scheme behavior. Please set a 'userInterfaceStyle' to remove this warning. https://docs.expo.dev/guides/color-schemes/`
    );
  }

  return config;
}
