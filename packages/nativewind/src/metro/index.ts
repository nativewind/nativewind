import type { MetroConfig } from "metro-config";
import { debug as debugFn } from "debug";
import path from "path";
import {
  withCssInterop,
  WithCssInteropOptions,
} from "react-native-css-interop/metro";

import { cssToReactNativeRuntimeOptions } from "./common";
import { tailwindCli, tailwindConfig } from "./tailwind";
import { setupTypeScript } from "./typescript";

interface WithNativeWindOptions extends WithCssInteropOptions {
  input: string;
  projectRoot?: string;
  outputDir?: string;
  configPath?: string;
  cliCommand?: string;
  browserslist?: string | null;
  browserslistEnv?: string | null;
  typescriptEnvPath?: string;
  disableTypeScriptGeneration?: boolean;
}

const debug = debugFn("nativewind");

export function withNativeWind(
  config: MetroConfig,
  {
    input,
    inlineRem = 14,
    configPath: tailwindConfigPath = "tailwind.config",
    browserslist = "last 1 version",
    browserslistEnv = "native",
    typescriptEnvPath = "nativewind-env.d.ts",
    disableTypeScriptGeneration = false,
  }: WithNativeWindOptions = {} as WithNativeWindOptions,
): MetroConfig {
  if (input) input = path.resolve(input);

  debug(`input: ${input}`);

  const { important } = tailwindConfig(path.resolve(tailwindConfigPath));

  debug(`important: ${important}`);

  const cli = tailwindCli(debug);

  if (!disableTypeScriptGeneration) {
    debug(`checking TypeScript setup`);
    setupTypeScript(typescriptEnvPath);
  }

  return withCssInterop(config, {
    ...cssToReactNativeRuntimeOptions,
    inlineRem,
    selectorPrefix: typeof important === "string" ? important : undefined,
    input,
    debug,
    processPROD: (platform) => {
      debug(`processPROD: ${platform}`);
      return cli.processPROD({
        platform,
        input,
        browserslist,
        browserslistEnv,
      });
    },
    processDEV: (platform, onChange) => {
      debug(`processDEV: ${platform}`);
      return cli.processDEV({
        platform,
        input,
        browserslist,
        browserslistEnv,
        onChange,
      });
    },
  });
}
