import { fork } from "child_process";

import { Debugger } from "debug";
import { type Config } from "tailwindcss";

import { TailwindCliOptions } from "../types";

/**
 * Tailwind CLI v3 is not very well suited for programmatic usage.
 * The recommended usage is PostCSS, but then we need to rebuild the plugin array/watcher/etc
 *
 * We also can't invoke the CLI directly as it writes to the file system/process.stdout/console.error
 * in hard to capture ways.
 *
 * Our hack is simply to fork a child process (allows us to capture the terminal output)
 * and override the fs (allows us to capture the output file)
 *
 * This is all a bad idea, but gives us full control over the output
 */

const child_file = __dirname + "/child.js";

const INITIAL_BUILD_TIMEOUT_MS = 60_000;

const getEnv = (options: TailwindCliOptions) => {
  return {
    ...process.env,
    NATIVEWIND_INPUT: options.input,
    NATIVEWIND_OS: options.platform,
    NATIVEWIND_WATCH: options.onChange ? "true" : "false",
    BROWSERSLIST: options.browserslist ?? undefined,
    BROWSERSLIST_ENV: options.browserslistEnv ?? undefined,
  };
};

export const tailwindCliV3 = function (debug: Debugger) {
  return {
    getCSSForPlatform(options: TailwindCliOptions) {
      debug("Start development Tailwind CLI");
      return new Promise<string>((resolve, reject) => {
        try {
          const child = fork(child_file, {
            stdio: "pipe",
            env: getEnv(options),
          });

          let initialMessage = true;
          let initialDoneIn = true;

          /*
           * The promise must settle even when the Tailwind build crashes
           * before its first IPC message, otherwise Metro waits on the
           * virtual CSS module forever with no error shown anywhere:
           * - non-watch mode: the child exits without sending -> reject on
           *   "exit"/"error"
           * - watch mode: tailwind --watch logs the error and keeps running,
           *   leaving the child alive but forever silent -> reject after a
           *   timeout
           * Keep the stderr tail so the rejection carries the real error.
           */
          let stderrTail = "";
          const initialFailure = (why: string) =>
            new Error(
              `NativeWind: Tailwind child ${why} before producing CSS - the bundle would hang silently. Tailwind output below.\n--- tailwind stderr ---\n${
                stderrTail.trim() || "(empty)"
              }`,
            );
          const initialTimer = setTimeout(() => {
            if (initialMessage) {
              reject(
                initialFailure(
                  `produced nothing within ${INITIAL_BUILD_TIMEOUT_MS / 1000}s`,
                ),
              );
            }
          }, INITIAL_BUILD_TIMEOUT_MS);

          child.stderr?.on("data", (data) => {
            data = data.toString();
            stderrTail = (stderrTail + data).slice(-4000);
            if (data.includes("Done in")) {
              if (initialDoneIn) {
                initialDoneIn = false;
              }
            } else if (data.includes("warn -")) {
              console.warn(data);
            }
          });

          child.stdout?.on("data", (data) => {
            data = data.toString();
          });

          child.on("error", (error) => {
            if (initialMessage) {
              clearTimeout(initialTimer);
              reject(error);
            }
          });

          child.on("exit", (code, signal) => {
            if (initialMessage) {
              clearTimeout(initialTimer);
              reject(initialFailure(`exited (code=${code}, signal=${signal})`));
            }
          });

          child.on("message", (message) => {
            if (initialMessage) {
              clearTimeout(initialTimer);
              resolve(message.toString());
              initialMessage = false;
              debug("Finished initial development Tailwind CLI");
            } else if (options.onChange) {
              debug("Tailwind CLI detected new styles");
              options.onChange(message.toString());
            }
          });
        } catch (e) {
          reject(e);
        }
      });
    },
  };
};

const flattenPresets = (configs: Partial<Config>[] = []): Partial<Config>[] => {
  if (!configs) return [];
  return configs.flatMap((config) => [
    config,
    ...flattenPresets(config.presets),
  ]);
};

export function tailwindConfigV3(path: string) {
  const config: Config = require("tailwindcss/loadConfig")(path);

  const hasPreset = flattenPresets(config.presets).some((preset) => {
    return preset.nativewind;
  });

  if (!hasPreset) {
    throw new Error(
      "Tailwind CSS has not been configured with the NativeWind preset",
    );
  }

  return config;
}
