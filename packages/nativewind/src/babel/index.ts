import { resolve } from "node:path";

import type { ConfigAPI } from "@babel/core";
import type { Config } from "tailwindcss";
import resolveConfig from "tailwindcss/resolveConfig";
import resolveConfigPath from "tailwindcss/lib/util/resolveConfigPath";
import { validateConfig } from "tailwindcss/lib/util/validateConfig";

// import { getImportBlockedComponents } from "./get-import-blocked-components";
import { plugin } from "./plugin";
import { normalizePath } from "./normalize-path";

export interface TailwindcssReactNativeBabelOptions {
  isInContent?: boolean;
  didTransform?: boolean;
  allowModuleTransform?: "*" | string[];
  blockModuleTransform?: string[];
  mode?: "compileAndTransform" | "compileOnly" | "transformOnly";
  tailwindConfigPath?: string;
  tailwindConfig?: Config | undefined;
}

export default function (
  api: ConfigAPI,
  options: TailwindcssReactNativeBabelOptions,
  cwd: string
) {
  const tailwindConfig = resolveTailwindConfig(api, options);

  const content = Array.isArray(tailwindConfig.content)
    ? tailwindConfig.content.filter(
        (filePath): filePath is string => typeof filePath === "string"
      )
    : tailwindConfig.content.files.filter(
        (filePath): filePath is string => typeof filePath === "string"
      );

  const contentFilePaths = content.map((contentFilePath) =>
    normalizePath(resolve(cwd, contentFilePath))
  );

  // const allowModuleTransform = Array.isArray(options.allowModuleTransform)
  //   ? ["react-native", "react-native-web", ...options.allowModuleTransform]
  //   : "*";

  return {
    plugins: [
      [
        plugin,
        {
          contentFilePaths,
        },
      ],
    ],
  };
}

function resolveTailwindConfig(
  _: ConfigAPI,
  options: TailwindcssReactNativeBabelOptions
): Config {
  let tailwindConfig: Config;

  const userConfigPath = resolveConfigPath(
    options.tailwindConfig || options.tailwindConfigPath
  );

  if (userConfigPath === null) {
    tailwindConfig = resolveConfig(options.tailwindConfig);
  } else {
    delete require.cache[require.resolve(userConfigPath)];
    const newConfig = resolveConfig(require(userConfigPath));
    tailwindConfig = validateConfig(newConfig);
  }

  const hasPreset = tailwindConfig.presets?.some((preset) => {
    return (
      typeof preset === "object" &&
      ("nativewind" in preset ||
        ("default" in preset && "nativewind" in preset["default"]))
    );
  });

  if (!hasPreset) {
    throw new Error("NativeWind preset was not included");
  }

  return tailwindConfig;
}
