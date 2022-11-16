import { getConfig } from "@expo/config";

export default function isExpo(main: string) {
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
