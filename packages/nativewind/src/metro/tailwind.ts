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

  const createOptions = JSON.stringify(
    getCreateOptions(stdout.toString().trim())
  );
  writeFileSync(
    output,
    `const {create}=require("nativewind/dist/runtime/native/stylesheet/runtime");create(${createOptions});`
  );

  const isDevelopment = process.env.NODE_ENV !== "production";

  if (isDevelopment) {
    let doneFirstOutput = false;
    let doneFirstLogging = false;

    spawnCommands.push("--watch", "--poll");

    const cli = spawn("npx", spawnCommands, {
      shell: true,
    });

    cli.stdout.on("data", (data) => {
      if (!doneFirstOutput) {
        doneFirstOutput = true;
        return;
      }
      const createOptions = JSON.stringify(
        getCreateOptions(data.toString().trim())
      );
      writeFileSync(
        output,
        `const {create}=require("nativewind/dist/runtime/native/stylesheet/runtime");create(${createOptions});`
      );
    });

    cli.stderr.on("data", (data: Buffer) => {
      const output = data.toString().trim();
      if (!doneFirstLogging) {
        doneFirstLogging = data.includes("Done");
        return;
      }

      // Ignore this, RN projects won't have Browserslist setup anyway.
      if (output.startsWith("[Browserslist] Could not parse")) {
        return;
      }

      if (output) console.error(`NativeWind: ${output}`);
    });
  }
}
