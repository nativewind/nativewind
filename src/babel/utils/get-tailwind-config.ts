import { join } from "path";
import { existsSync } from "fs";
import plugin from "tailwindcss/plugin";
import resolveTailwindConfig from "tailwindcss/resolveConfig";
import { TailwindReactNativeOptions } from "../types";

export function getTailwindConfig(
  cwd: string,
  { tailwindConfigPath }: TailwindReactNativeOptions
): import("tailwindcss/tailwind-config").TailwindConfig {
  const fullConfigPath = join(
    cwd,
    tailwindConfigPath || "./tailwind.config.js"
  );

  // Get the config. Throw an error if configPath was set but we were unable to find it
  let projectTailwindConfig;
  if (existsSync(fullConfigPath)) {
    projectTailwindConfig = require(fullConfigPath);
  } else if (tailwindConfigPath) {
    throw new Error(`Unable to find config ${fullConfigPath}`);
  } else {
    projectTailwindConfig = {};
  }

  return resolveTailwindConfig({
    ...projectTailwindConfig,
    plugins: [
      ...(projectTailwindConfig.plugins || []),
      plugin(function ({ addVariant }) {
        addVariant("native", "@media native");
        addVariant("ios", "");
        addVariant("android", "");
      }),
    ],
  });
}
