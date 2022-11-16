/* eslint-disable @typescript-eslint/no-explicit-any */
import { writeFileSync } from "node:fs";
import { join } from "node:path";

import findCacheDir from "find-cache-dir";
import { expoColorSchemeWarning } from "./expo/color-scheme-warning";
import runTailwindCli from "./tailwind";

export interface GetTransformOptionsOptions {
  dev: boolean;
  hot: boolean;
  platform: string | null | undefined;
}

// We actually don't do anything to the Metro config,
export default function withNativeWind(config: Record<string, any> = {}) {
  /**
   * NATIVEWIND_OUTPUT needs to be set before this is returned, otherwise
   * it won't be passed to Babel
   */
  const cacheDirectory = findCacheDir({ name: "nativewind", create: true });
  if (!cacheDirectory)
    throw new Error("[NativeWind] Unable to secure cache directory");

  const filename = join(cacheDirectory, "output");
  const output = `${filename}.js`;
  writeFileSync(output, "");

  process.env.NATIVEWIND_OUTPUT = filename;

  return {
    ...config,
    transformer: {
      ...config.transformer,
      getTransformOptions: async (...args: any[]) => {
        const entry: string = args[0][0];
        const transformOptions: GetTransformOptionsOptions = args[1];

        // Clear Metro's progress bar and move to the start of the line
        // We will print out own output before letting Metro print again
        process.stdout.clearLine(0);
        process.stdout.cursorTo(0);

        expoColorSchemeWarning(entry);

        runTailwindCli(entry, {
          ...transformOptions,
          cacheDirectory,
          output,
        });

        return config.transformer?.getTransformOptions(...args);
      },
    },
  };
}
