import { spawn } from "node:child_process";
import { mkdirSync, readFileSync } from "node:fs";
import { dirname } from "node:path";

import type { GetTransformOptionsOpts } from "metro-config";
import {
  ComposableIntermediateConfigT,
  sendUpdate,
} from "react-native-css-interop/metro";

import { getOutput } from "./common";

export interface TailwindCliOptions extends GetTransformOptionsOpts {
  output: string;
  cliCommand: string;
  browserslist: string | null;
  browserslistEnv: string | null;
}

export async function tailwindCli(
  input: string,
  metroConfig: ComposableIntermediateConfigT,
  options: TailwindCliOptions,
) {
  let done: (nativewindOptions?: Record<string, any>) => void;
  let reject: () => void = () => {};
  let nativewindOptions: Record<string, any> = {};
  const deferred = new Promise<Record<string, any> | undefined>(
    (resolve, _reject) => {
      done = resolve;
      reject = _reject;
    },
  );

  const env = {
    ...process.env,
    NATIVEWIND_NATIVE: options.platform === "web" ? undefined : "true",
    BROWSERSLIST: options.browserslist ?? undefined,
    BROWSERSLIST_ENV: options.browserslistEnv ?? undefined,
  };

  const platform = options.platform === "web" ? "web" : "native";
  process.stdout.write(`tailwindcss(${platform}) rebuilding... `);

  const timeout = setTimeout(() => {
    if (options.dev && !process.env.CI) {
      console.warn(
        `tailwindcss(${platform}) is taking a long time to build, please read https://tailwindcss.com/docs/content-configuration#pattern-recommendations to speed up your build time`,
      );
    }
    reject();
    // 1 minute.
  }, 60000);

  mkdirSync(dirname(options.output), { recursive: true });

  const output = getOutput(options.output, options);

  const spawnCommands = [
    ...options.cliCommand.split(" "),
    "--input",
    `"${input}"`,
    "--output",
    `"${output}"`,
  ];

  if (options.dev && options.hot) {
    spawnCommands.push("--watch");
  }

  try {
    const [command, ...args] = spawnCommands;
    const cli = spawn(command, args, {
      shell: true,
      env,
      windowsVerbatimArguments: true,
      windowsHide: true,
    });

    cli.on("error", (error) => reject());
    cli.stderr.on("data", (data: Buffer | string) => {
      data = data.toString();

      if (data.includes("tailwindcss/lib/cli") || data.includes("npm ERR!")) {
        reject();
      }

      if (data.includes("warn - ")) {
        console.warn(data);
        return;
      }

      if (data.startsWith("Specified input file")) {
        console.log("");
        console.error(data);
        clearTimeout(timeout);
        return;
      }

      if (!data.includes("Done in")) return;
      clearTimeout(timeout);

      const rawOutput = readFileSync(output, "utf-8");
      nativewindOptions.rawOutput = rawOutput;
      nativewindOptions.outputPath = output;

      sendUpdate(rawOutput, metroConfig.transformer.cssToReactNativeRuntime);

      done(nativewindOptions);
    });
  } catch {
    reject();
  }

  return deferred
    .then((data) => {
      console.log("done");
      return data;
    })
    .catch(() => {
      console.error(
        "\nError running TailwindCSS CLI, please run the CLI manually to see the error.",
      );
      console.error("Command used: ", ...spawnCommands);
      process.exit(1);
    });
}
