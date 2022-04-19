import { join } from "node:path";
import { existsSync } from "node:fs";

import resolveTailwindConfig from "tailwindcss/resolveConfig";
import { TailwindConfig } from "tailwindcss/tailwind-config";

import { getNativeTailwindConfig } from "./native-config";
import { TailwindReactNativeOptions } from "../types";

export function getTailwindConfig(
  cwd: string,
  options: TailwindReactNativeOptions
): TailwindConfig {
  const { tailwindConfigPath } = options;

  let userConfig;
  const fullConfigPath = join(
    cwd,
    tailwindConfigPath || "./tailwind.config.js"
  );

  // Throw an error if configPath was set but we were unable to find it
  if (existsSync(fullConfigPath)) {
    // eslint-disable-next-line unicorn/prefer-module
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
    plugins: [...(nativeConfig.plugins ?? []), ...(userConfig.plugins ?? [])],
  };

  return resolveTailwindConfig(mergedConfig);
}
