import { readFileSync, writeFileSync, statSync } from "node:fs";
import { resolve, join } from "node:path";

import findCacheDir from "find-cache-dir";
import chokidar from "chokidar";

import type { ConfigAPI } from "@babel/core";

import type { Config } from "tailwindcss";
import resolveConfig from "tailwindcss/resolveConfig";
import resolveConfigPath from "tailwindcss/lib/util/resolveConfigPath";
import { validateConfig } from "tailwindcss/lib/util/validateConfig";

// import { getImportBlockedComponents } from "./get-import-blocked-components";
import { extractStyles } from "../postcss/extract";
import { createHash } from "node:crypto";
import { plugin } from "./plugin";
import { normalizePath } from "./normalize-path";

export interface TailwindcssReactNativeBabelOptions {
  isInContent?: boolean;
  didTransform?: boolean;
  allowModuleTransform?: "*" | string[];
  blockModuleTransform?: string[];
  mode?: "compileAndTransform" | "compileOnly" | "transformOnly";
  rem?: number;
  tailwindConfigPath?: string;
  tailwindConfig?: Config | undefined;
}

const cacheDirectory = findCacheDir({ name: "nativewind", create: true }) ?? "";
if (!cacheDirectory) throw new Error("Unable to secure cache directory");

const stylesFile = join(cacheDirectory, "styles.js");
const cssCacheFile = join(cacheDirectory, "styles.css");
const nativewindStylesFile = require.resolve("nativewind/dist/styles");

let initialized = true;

export default function (
  api: ConfigAPI,
  options: TailwindcssReactNativeBabelOptions,
  cwd: string
) {
  api.cache.never();

  const [newTailwindConfig, tailwindConfigPath] = resolveTailwindConfig(
    api,
    options
  );

  let tailwindConfig = newTailwindConfig;

  const platform = resolvePlatform(api);
  const isDevelopment = api.env("development");

  let canCompile = true;
  let canTransform = true;

  if (options.mode === "compileOnly") {
    canTransform = false;
  } else if (options.mode === "transformOnly") {
    canCompile = false;
  } else if (platform === "web") {
    canCompile = false;
  }

  const safelist =
    tailwindConfig.safelist && tailwindConfig.safelist.length > 0
      ? tailwindConfig.safelist
      : ["babel-empty"];

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

  let cssCache = `@tailwind components;@tailwind utilities;`;

  function hotReloadStyles(filename: string) {
    const styles = extractStyles(
      {
        ...tailwindConfig,
        content: [filename],
        safelist,
      },
      cssCache
    );

    const hash = createHash("sha1").update(filename).digest("hex");
    const cacheFilename = join(cacheDirectory, `${hash}.js`);
    writeFileSync(
      cacheFilename,
      `import { NativeWindStyleSheet } from "nativewind";\nNativeWindStyleSheet.create(${JSON.stringify(
        styles
      )}`
    );
    writeFileSync(stylesFile, `try { require("${cacheFilename}"); } catch {}`, {
      flag: "a",
    });
  }

  function fullCompile() {
    writeFileSync(
      stylesFile,
      `import { NativeWindStyleSheet } from "nativewind";\nNativeWindStyleSheet.create(${JSON.stringify(
        extractStyles(tailwindConfig, cssCache)
      )});`
    );
  }

  function handleCssImport(source: string) {
    const css = readFileSync(source, "utf8");

    if (css.includes("@tailwind")) {
      cssCache = css;
      writeFileSync(cssCacheFile, cssCache);
      fullCompile();
    }
  }

  if (!initialized && canCompile) {
    initialized = true;

    if (process.env.NODE_ENV === "development") {
      const watcher = chokidar.watch(cacheDirectory).on("change", (path) => {
        if (path.endsWith(".css")) {
          cssCache = readFileSync(path, "utf8");
        } else if (path === tailwindConfigPath) {
          // Reload the Tailwind Config
          tailwindConfig = resolveTailwindConfig(api, options)[0];
          fullCompile();
        }
      });

      if (tailwindConfigPath) {
        watcher.add(tailwindConfigPath);
      }
    }

    writeFileSync(
      nativewindStylesFile,
      `try { require("${stylesFile}") } catch {} // ${Date.now()}`
    );
    fullCompile();
  }

  // const allowModuleTransform = Array.isArray(options.allowModuleTransform)
  //   ? ["react-native", "react-native-web", ...options.allowModuleTransform]
  //   : "*";

  return {
    plugins: [
      [
        plugin,
        {
          canCompile,
          canTransform,
          contentFilePaths,
          fullCompile,
          handleCssImport,
          hotReloadStyles,
          isDevelopment,
        },
      ],
    ],
  };
}

function resolveTailwindConfig(
  api: ConfigAPI,
  options: TailwindcssReactNativeBabelOptions
): [Config, string | null] {
  let tailwindConfig: Config;

  const userConfigPath = resolveConfigPath(
    options.tailwindConfig || options.tailwindConfigPath
  );

  if (userConfigPath === null) {
    tailwindConfig = resolveConfig(options.tailwindConfig);
  } else {
    api.cache.using(() => statSync(userConfigPath).mtimeMs);
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

  return [tailwindConfig, userConfigPath];
}

function resolvePlatform(api: ConfigAPI) {
  const bundler = api.caller((caller) => {
    if (!caller) return;

    if ("bundler" in caller) {
      return caller["bundler"];
    }

    const { name } = caller;

    switch (name) {
      case "metro": {
        return "metro";
      }
      case "next-babel-turbo-loader": {
        return "webpack";
      }
      case "babel-loader": {
        return "webpack";
      }
    }
  });

  const platform = api.caller((caller) => {
    if (!caller) return "unknown";

    if ("platform" in caller) {
      return caller["platform"];
    } else if (bundler === "webpack") {
      return "web";
    } else {
      return "unknown";
    }
  });

  process.env.NATIVEWIND_PLATFORM = platform;

  return platform;
}
