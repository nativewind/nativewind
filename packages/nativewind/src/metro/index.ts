import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { cwd } from "node:process";
import { spawn, spawnSync } from "node:child_process";

import findCacheDir from "find-cache-dir";
import { getCreateOptions } from "../transform-css";

export interface WithNativeWindOptions {
  inputPath?: string;
  postcssPath?: string;
}

// We actually don't do anything to the Metro config,
export default function withNativeWind(
  config: unknown,
  { inputPath, postcssPath }: WithNativeWindOptions = {}
) {
  const cacheDirectory = findCacheDir({ name: "nativewind", create: true });
  if (!cacheDirectory) throw new Error("Unable to secure cache directory");

  const nativewindOutput = join(cacheDirectory, "output");
  process.env.NATIVEWIND_OUTPUT = nativewindOutput;
  process.env.NATIVEWIND_PLATFORM = "native";

  if (!inputPath) {
    try {
      // eslint-disable-next-line unicorn/prefer-module, @typescript-eslint/no-var-requires
      let { main } = require(`${cwd()}/package.json`);

      if (!main || main === "node_modules/expo/AppEntry.js") {
        const file = readdirSync(cwd()).find((file) =>
          file.match(/app.(ts|tsx|cjs|mjs|js)/gi)
        );

        if (file) {
          main = join(cwd(), file);
        }
      }

      if (main) {
        const cssImport = readFileSync(main, "utf8").match(/["'](.+\.css)["']/);

        if (cssImport && typeof cssImport[0] === "string") {
          inputPath = cssImport[0];
        }
      }
    } finally {
      if (!inputPath) {
        inputPath = join(cacheDirectory, "input.css");
        writeFileSync(inputPath, "@tailwind components;@tailwind utilities;");
      }
    }
  }

  const spawnCommands = ["tailwind", "-i", inputPath];

  if (postcssPath) {
    spawnCommands.push("--postcss", postcssPath);
  }

  const isDevelopment = process.env.NODE_ENV !== "production";

  if (isDevelopment) {
    spawnCommands.push("--watch", "--poll");

    const cli = spawn("npx", spawnCommands, {
      shell: true,
      cwd: cwd(),
    });

    cli.stdout.on("data", (data) => {
      const createOptions = JSON.stringify(
        getCreateOptions(data.toString().trim())
      );
      writeFileSync(
        nativewindOutput + ".js",
        `const {NativeWindStyleSheet}=require("nativewind/dist/style-sheet");\nNativeWindStyleSheet.create(${createOptions});`
      );
    });

    cli.stderr.on("data", (data) => {
      const output = data.toString().trim();
      if (output) console.error(`NativeWind: ${output}`);
    });
  } else {
    spawnSync("npx", spawnCommands, { shell: true });
  }

  return config;
}
