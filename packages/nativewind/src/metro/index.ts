import { writeFileSync } from "node:fs";
import { join } from "node:path";

import findCacheDir from "find-cache-dir";
import { spawn } from "node:child_process";

export interface WithNativeWindOptions {
  inputPath?: string;
  postcssPath?: string;
}

// We actually don't do anything to the Metro config,
// this is simply here to future proof incase we need to
export default function withNativeWind(
  config: unknown,
  { inputPath: input, postcssPath }: WithNativeWindOptions
) {
  const cacheDirectory = findCacheDir({ name: "nativewind", create: true });
  if (!cacheDirectory) throw new Error("Unable to secure cache directory");

  if (!input) {
    input = join(cacheDirectory, "input.css");
    writeFileSync(input, "@tailwind components;@tailwind utilities;");
  }

  const spawnCommands = ["tailwind", "-i", input];

  if (postcssPath) {
    spawnCommands.push("--postcss", postcssPath);
  }

  if (process.env.NODE_ENV !== "production") {
    spawnCommands.push("--watch");
  }

  const cli = spawn("npx", spawnCommands);
  cli.stdout.on("data", (data) => {
    console.log(`stdout: ${data}`);
  });

  cli.stderr.on("data", (data) => {
    console.error(`stderr: ${data}`);
  });

  cli.on("close", (code) => {
    console.log(`child process exited with code ${code}`);
  });

  return config;
}
