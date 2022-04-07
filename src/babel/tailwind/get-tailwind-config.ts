import { join } from "path";
import { existsSync } from "fs";
import plugin from "tailwindcss/plugin";
import resolveTailwindConfig from "tailwindcss/resolveConfig";
import { TailwindReactNativeOptions } from "../types";
import { TailwindConfig } from "tailwindcss/tailwind-config";
import { getNativeTailwindConfig } from "./native-config";

export function getTailwindConfig(
  cwd: string,
  options: TailwindReactNativeOptions
): TailwindConfig {
  const { tailwindConfigPath } = options;

  const fullConfigPath = join(
    cwd,
    tailwindConfigPath || "./tailwind.config.js"
  );

  // Get the config.
  // Throw an error if configPath was set but we were unable to find it
  let userConfig;
  if (existsSync(fullConfigPath)) {
    userConfig = require(fullConfigPath);
  } else if (tailwindConfigPath) {
    throw new Error(`Unable to find config ${fullConfigPath}`);
  } else {
    userConfig = {};
  }

  const nativeConfig = getNativeTailwindConfig(options);

  const mergedConfig = {
    ...nativeConfig,
    ...userConfig,
    theme: {
      ...nativeConfig.theme,
      ...userConfig.theme,
    },
  };

  return resolveTailwindConfig({
    ...mergedConfig,
    plugins: [
      ...(userConfig.plugins || []),
      plugin(function ({ addVariant }) {
        addVariant("native", "@media native");
        addVariant("ios", "");
        addVariant("android", "");
      }),
    ],
  });
}
