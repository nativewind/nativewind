import { existsSync } from "node:fs";

import resolveTailwindConfig from "tailwindcss/resolveConfig";
import { TailwindConfig } from "tailwindcss/tailwind-config";

import { nativePlugin, NativePluginOptions } from "../../tailwind/native";

export interface GetTailwindConfigOptions extends NativePluginOptions {
  tailwindConfigPath?: string;
}

export function getTailwindConfig(
  fullConfigPath: string,
  options: GetTailwindConfigOptions
): TailwindConfig {
  const { tailwindConfigPath } = options;

  let userConfig: Partial<TailwindConfig> = {};
  if (existsSync(fullConfigPath)) {
    // eslint-disable-next-line unicorn/prefer-module
    userConfig = require(fullConfigPath);
  } else if (tailwindConfigPath) {
    throw new Error(`Unable to find config ${fullConfigPath}`);
  } else {
    userConfig = {};
  }

  const mergedConfig = {
    ...userConfig,
    plugins: [nativePlugin(options), ...(userConfig.plugins ?? [])],
  };

  return resolveTailwindConfig(mergedConfig as TailwindConfig);
}
