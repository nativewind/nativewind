/* eslint-disable unicorn/prefer-module, @typescript-eslint/no-var-requires */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { spawn, spawnSync } from "node:child_process";

import { resolveEntryPoint } from "@expo/config/paths";
import findCacheDir from "find-cache-dir";

import { getCreateOptions } from "../postcss/extract";

export interface WithNativeWindOptions {
  inputPath?: string;
  postcssPath?: string;
}

// We actually don't do anything to the Metro config,
// this is simply here to future proof incase we need to
export default function withNativeWind(
  config: unknown,
  { inputPath, postcssPath }: WithNativeWindOptions = {}
) {
  const cacheDirectory = findCacheDir({ name: "nativewind", create: true });
  if (!cacheDirectory) throw new Error("Unable to secure cache directory");

  const outputFile = join(cacheDirectory, "output.js");
  process.env.NATIVEWIND_OUTPUT = outputFile;

  if (!inputPath) {
    try {
      let { main } = require("package.json");

      if (main && main === "node_modules/expo/AppEntry.js") {
        main = resolveEntryPoint(__dirname, { platform: "ios" });
      }

      if (main) {
        const cssImport = readFileSync(main, "utf8").match(/(\w+\.css)/);

        if (cssImport) {
          inputPath = cssImport[0];
        }
      }
    } finally {
      inputPath ??= join(cacheDirectory, "input.css");
      writeFileSync(inputPath, "@tailwind components;@tailwind utilities;");
    }
  }

  const spawnCommands = ["tailwind", "-i", inputPath];

  if (postcssPath) {
    spawnCommands.push("--postcss", postcssPath);
  }

  const isDevelopment = process.env.NODE_ENV !== "production";

  if (isDevelopment) {
    spawnCommands.push("--watch");

    const cli = spawn("npx", spawnCommands);

    cli.stdout.on("data", (data) => {
      const output = data.toString().trim();
      const createOptions = JSON.stringify(getCreateOptions(output));
      writeFileSync(
        outputFile,
        `const {NativeWindStyleSheet}=require("nativewind/dist/style-sheet");\nNativeWindStyleSheet.create(${createOptions});`
      );
    });

    cli.stderr.on("data", (data) => {
      const output = data.toString().trim();
      if (output) console.error(`NativeWind: ${output}`);
    });
  } else {
    spawnSync("npx", spawnCommands);
  }

  return config;
}
