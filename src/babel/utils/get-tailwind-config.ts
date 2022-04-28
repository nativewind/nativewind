import { join } from "node:path";
import { existsSync } from "node:fs";

import resolveTailwindConfig from "tailwindcss/resolveConfig";
import { TailwindConfig } from "tailwindcss/tailwind-config";

import { nativePlugin } from "../../plugin/native";

export interface GetTailwindConfigOptions {
  rem?: number;
  tailwindConfigPath?: string;
}

export function getTailwindConfig(
  cwd: string,
  options: GetTailwindConfigOptions
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

  const mergedConfig = {
    ...userConfig,
    plugins: [nativePlugin(options), ...(userConfig.plugins ?? [])],
  };

  return resolveTailwindConfig(mergedConfig);
}
