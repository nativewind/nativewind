import type { ConfigAPI, TransformCaller } from "@babel/core";

import { Config } from "tailwindcss";
import resolveConfig from "tailwindcss/resolveConfig";
import resolveConfigPath from "tailwindcss/lib/util/resolveConfigPath";
import { validateConfig } from "tailwindcss/lib/util/validateConfig";

import {
  styledComponentTransform,
  StyledComponentTransformOptions,
} from "./plugins/styled-component-transform";

import { removeCSS } from "./plugins/remove-css";
import { styleImports } from "./plugins/style-imports";

export interface NativeWindPresetOptions
  extends Omit<StyledComponentTransformOptions, "tailwindConfig"> {
  tailwindConfigPath?: string;
  tailwindConfig?: Config | undefined;
}

export default function (
  api: ConfigAPI,
  options: NativeWindPresetOptions,
  cwd: string
) {
  const bundler = api.caller(getBundler);
  let platform = api.caller(getPlatform);
  if (!platform && bundler === "webpack") {
    platform = "web";
  }

  const tailwindConfig = resolveTailwindConfig(options);

  if (platform === "web") {
    return {
      plugins: [
        [styledComponentTransform, { ...options, cwd, tailwindConfig }],
      ],
    };
  }

  return {
    plugins: [
      [styledComponentTransform, { ...options, cwd, tailwindConfig }],
      removeCSS,
      styleImports,
    ],
  };
}

function getPlatform(caller?: TransformCaller & { platform?: string }) {
  return caller?.platform;
}

function getBundler(caller?: TransformCaller & { bundler?: string }) {
  if (!caller) return;
  return caller.name === "metro" ? "metro" : "webpack";
}

function resolveTailwindConfig(options: NativeWindPresetOptions): Config {
  const userConfigPath = resolveConfigPath(
    options.tailwindConfig || options.tailwindConfigPath
  );

  let tailwindConfig: Config;

  if (userConfigPath === null) {
    tailwindConfig = resolveConfig(options.tailwindConfig);
  } else {
    delete require.cache[require.resolve(userConfigPath)];
    const newConfig = resolveConfig(require(userConfigPath));
    tailwindConfig = validateConfig(newConfig);
  }

  const hasPreset = tailwindConfig.presets?.some((preset) => {
    return (
      (typeof preset === "object" || typeof preset === "function") &&
      ("nativewind" in preset ||
        ("default" in preset && "nativewind" in preset["default"]))
    );
  });

  if (!hasPreset) {
    throw new Error("NativeWind preset was not included");
  }

  return tailwindConfig;
}
