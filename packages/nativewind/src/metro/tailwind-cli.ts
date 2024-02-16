import { spawn } from "node:child_process";
import { mkdirSync, readFileSync } from "node:fs";
import { dirname } from "node:path";

import type { GetTransformOptionsOpts } from "metro-config";
import {
  ComposableIntermediateConfigT,
  sendUpdate,
} from "react-native-css-interop/metro";

export interface TailwindCliOptions extends GetTransformOptionsOpts {
  projectRoot: string;
  input: string;
  output: string;
  cliCommand: string;
  browserslist: string | null;
  browserslistEnv: string | null;
}

let version = 1;

export async function tailwindCli(
  input: string,
  metroConfig: ComposableIntermediateConfigT,
  options: TailwindCliOptions,
) {
  let done: (css: string) => void;
  let reject: () => void = () => {};
  const deferred = new Promise<string | undefined>((resolve, _reject) => {
    done = resolve;
    reject = _reject;
  });

  const env = {
    ...process.env,
    NATIVEWIND_NATIVE: options.platform,
    BROWSERSLIST: options.browserslist ?? undefined,
    BROWSERSLIST_ENV: options.browserslistEnv ?? undefined,
  };

  process.stdout.write(`tailwindcss(${options.platform}) rebuilding... `);

  const timeout = setTimeout(() => {
    if (options.dev && !process.env.CI) {
      console.warn(
        `tailwindcss(${options.platform}) is taking a long time to build, please read https://tailwindcss.com/docs/content-configuration#pattern-recommendations to speed up your build time`,
      );
    }
    reject();
    // 1 minute.
  }, 60000);

  mkdirSync(dirname(options.output), { recursive: true });

  const spawnCommands = [
    ...options.cliCommand.split(" "),
    "--input",
    `"${input}"`,
    "--output",
    `"${options.output}"`,
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

    cli.on("error", (error) => {
      console.error("NativeWind failed while running TailwindCLI");
      console.error(error);
      clearTimeout(timeout);
      reject();
    });
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

      const rawOutput = readFileSync(options.output, "utf-8");

      sendUpdate(
        rawOutput,
        version,
        metroConfig.transformer.cssToReactNativeRuntime,
      );
      version++;

      done(rawOutput);
    });
  } catch (error) {
    console.error("NativeWind had an unknown error while running TailwindCLI");
    console.error(error);
    clearTimeout(timeout);
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
