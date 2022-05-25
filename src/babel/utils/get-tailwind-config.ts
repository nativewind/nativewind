import { resolve } from "node:path";
import { existsSync } from "node:fs";

import resolveTailwindConfig from "tailwindcss/resolveConfig";
import { TailwindConfig } from "tailwindcss/tailwind-config";

import { nativePlugin, NativePluginOptions } from "../../tailwind/native";

export interface GetTailwindConfigOptions extends NativePluginOptions {
  tailwindConfigPath?: string;
}

export function getTailwindConfig(
  cwd: string,
  options: GetTailwindConfigOptions
): TailwindConfig {
  const { tailwindConfigPath } = options;

  const fullConfigPath = resolve(
    cwd,
    tailwindConfigPath || "./tailwind.config.js"
  );

  let userConfig: Partial<TailwindConfig> = {};
  if (existsSync(fullConfigPath)) {
    // eslint-disable-next-line unicorn/prefer-module
    userConfig = require(fullConfigPath);
  } else if (tailwindConfigPath) {
    // Throw an error if configPath was set but we were unable to find it
    throw new Error(`Unable to find config ${fullConfigPath}`);
  }

  const mergedConfig = {
    ...userConfig,
    plugins: [nativePlugin(options), ...(userConfig.plugins ?? [])],
  };

  return resolveTailwindConfig(mergedConfig as TailwindConfig);
}
