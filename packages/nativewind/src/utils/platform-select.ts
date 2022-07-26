import { PlatformOSType } from "react-native";

export function platformSelect(
  value: Partial<Record<PlatformOSType | "default", unknown>>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): any {
  const isNative = process.env.NATIVEWIND_NATIVE_PLUGIN_ENABLED;

  if (isNative) {
    const platformParameter = Object.entries(value)
      .map((entries) => entries.join(":"))
      .join(" ");

    return `platform(${platformParameter})`;
  } else {
    return value.web ?? value.default;
  }
}
