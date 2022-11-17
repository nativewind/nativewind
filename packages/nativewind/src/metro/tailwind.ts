import { spawnSync, spawn } from "node:child_process";
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { cwd } from "node:process";
import type { GetTransformOptionsOptions } from ".";
import { getCreateOptions } from "../transform-css";
import isExpo from "./expo/is-metro";

export interface WithTailwindOptions extends GetTransformOptionsOptions {
  cacheDirectory: string;
  output: string;
}

export default function runTailwindCli(
  main: string,
  { platform, cacheDirectory, output }: WithTailwindOptions
) {
  process.env.NATIVEWIND_NATIVE = platform !== "web" ? "true" : undefined;

  let createOptions: Record<string, unknown> = {};

  let inputPath: string | undefined;
  try {
    if (isExpo(main)) {
      const file = readdirSync(cwd()).find((file) =>
        file.match(/app.(ts|tsx|cjs|mjs|js)/gi)
      );

      if (file) {
        main = join(cwd(), file);
      }
    }

    if (main) {
      const cssImport = readFileSync(main, "utf8").match(/["'](.+\.css)["']/);

      if (cssImport && typeof cssImport[1] === "string") {
        inputPath = cssImport[1];
      }
    }
  } finally {
    if (!inputPath) {
      inputPath = join(cacheDirectory, "input.css");
      writeFileSync(inputPath, "@tailwind components;@tailwind utilities;");
    }
  }

  // eslint-disable-next-line unicorn/prefer-module
  const postcssConfig = join(__dirname, "../postcss/index.js");
  const spawnCommands = [
    "tailwind",
    "-i",
    inputPath,
    "--postcss",
    postcssConfig,
  ];

  process.stdout.clearLine(0); // clear current text
  process.stdout.cursorTo(0); // move cursor to beginning of line

  console.log("NativeWind: Rebuilding...");
  const { stdout, stderr } = spawnSync("npx", spawnCommands, { shell: true });
  console.log(
    `NativeWind: ${stderr.toString().replace("\nRebuilding...\n\n", "").trim()}`
  );

  createOptions = {
    ...createOptions,
    ...getCreateOptions(stdout.toString().trim()),
  };

  writeFileSync(
    output,
    `const {create}=require("nativewind/dist/runtime/native/stylesheet/runtime");create(${JSON.stringify(
      createOptions
    )}); //${Date.now()}`
  );

  const isDevelopment = process.env.NODE_ENV !== "production";

  if (isDevelopment) {
    let doneFirst = false;

    spawnCommands.push("--watch", "--poll");

    const cli = spawn("npx", spawnCommands, {
      shell: true,
    });

    let chunks: string[] = [];

    cli.stdout.on("data", (data) => {
      chunks.push(Buffer.from(data, "utf8").toString().trim());
    });

    cli.stderr.on("data", (data: Buffer) => {
      const output = data.toString().trim();
      const isDone = data.includes("Done");

      if (!doneFirst && isDone) {
        doneFirst = true;
        return;
      }

      // Ignore this, RN projects won't have Browserslist setup anyway.
      if (output.startsWith("[Browserslist] Could not parse")) {
        return;
      }

      const css = chunks.join("\n");
      chunks = [];

      createOptions = {
        ...createOptions,
        ...getCreateOptions(css),
      };

      chunks = [];

      writeFileSync(
        output,
        `const {create}=require("nativewind/dist/runtime/native/stylesheet/runtime");create(${JSON.stringify(
          createOptions
        )}); //${Date.now()}`
      );

      if (output) console.error(`NativeWind: ${output}`);
    });
  }
}
