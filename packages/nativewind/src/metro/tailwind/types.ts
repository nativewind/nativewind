import { GetCSSForPlatformOnChange } from "react-native-css-interop/metro";

export interface TailwindCliOptions {
  input: string;
  platform: string;
  browserslist?: string | null;
  browserslistEnv?: string | null;
  onChange?: GetCSSForPlatformOnChange;
}
