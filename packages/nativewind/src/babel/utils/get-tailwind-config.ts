import { existsSync } from "node:fs";
import { Config } from "tailwindcss";
import resolveTailwindConfig from "tailwindcss/resolveConfig";

import { nativePlugin, NativePluginOptions } from "../../tailwind/native";

export interface GetTailwindConfigOptions extends NativePluginOptions {
  tailwindConfigPath?: string;
}

export function getTailwindConfig(
  fullConfigPath: string,
  options: GetTailwindConfigOptions
): Config {
  const { tailwindConfigPath } = options;

  let userConfig: Partial<Config> = {};
  if (existsSync(fullConfigPath)) {
    // eslint-disable-next-line unicorn/prefer-module
    userConfig = require(fullConfigPath);
  } else if (tailwindConfigPath) {
    throw new Error(`Unable to find config ${fullConfigPath}`);
  }

  const mergedConfig = {
    ...userConfig,
    plugins: [nativePlugin(options), ...(userConfig.plugins ?? [])],
  } as Config;

  return resolveTailwindConfig(mergedConfig);
}
