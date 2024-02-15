import type { NextHandleFunction } from "connect";
import connect from "connect";
import loadConfig from "tailwindcss/loadConfig";
import tailwindPackage from "tailwindcss/package.json";
import micromatch from "micromatch";

import path from "path";
import {
  withCssInterop,
  CssToReactNativeRuntimeOptions,
  ComposableIntermediateConfigT,
  middleware as cssInteropMiddleware,
} from "react-native-css-interop/metro";

import { cssToReactNativeRuntimeOptions } from "./common";
import { tailwindCli } from "./tailwind-cli";

interface WithNativeWindOptions extends CssToReactNativeRuntimeOptions {
  input: string;
  projectRoot?: string;
  outputDir?: string;
  configPath?: string;
  cliCommand?: string;
  browserslist?: string | null;
  browserslistEnv?: string | null;
}

const tailwindCliPromises: Record<string, ReturnType<typeof tailwindCli>> = {};
const cliOutputs: Record<string, Awaited<ReturnType<typeof tailwindCli>>> = {};

export function withNativeWind(
  metroConfig: ComposableIntermediateConfigT,
  {
    input,
    outputDir = ["node_modules", ".cache", "nativewind"].join(path.sep),
    projectRoot = process.cwd(),
    inlineRem = 14,
    configPath: tailwindConfigPath = "tailwind.config.js",
    cliCommand = `node ${path.join(
      require.resolve("tailwindcss/package.json"),
      "../",
      tailwindPackage.bin.tailwindcss,
    )}`,
    browserslist = "last 1 version",
    browserslistEnv = "native",
  }: WithNativeWindOptions = {} as WithNativeWindOptions,
) {
  if (!input) {
    throw new Error(
      "withNativeWind requires an input parameter: `withNativeWind(config, { input: <css-file> })`",
    );
  }

  input = path.resolve(input);
  const output = path.resolve(
    projectRoot,
    path.join(outputDir, path.basename(input!)),
  );

  const { important } = getTailwindConfig(tailwindConfigPath, output);

  // Get the CssInterop modified Metro Config (this includes its transform)
  metroConfig = withCssInterop(metroConfig, {
    ...cssToReactNativeRuntimeOptions,
    inlineRem,
    selectorPrefix: typeof important === "string" ? important : undefined,
  });
  // Override CSS Interop's transformer with our own (we call it ourselves)
  metroConfig.transformerPath = require.resolve("./transformer");

  // This is marked as deprecated, Expo SDK HEAVY RELIES on this, so its not going anywhere anytime soon
  const existingEnhanceMiddleware = metroConfig.server.enhanceMiddleware;
  metroConfig.server = {
    ...metroConfig.server,
    enhanceMiddleware(middleware, metroServer) {
      if (existingEnhanceMiddleware) {
        middleware = existingEnhanceMiddleware(middleware, metroServer);
      }

      return connect()
        .use(...cssInteropMiddleware)
        .use("/", nativewindMiddleware)
        .use(middleware);
    },
  };

  const nativewindMiddleware: NextHandleFunction = async (req, _res, next) => {
    const url = new URL(req.url!, "http://localhost");
    const platform = url.searchParams.get("platform");

    if (!platform) {
      next();
      return;
    }

    // Only start the Tailwind CLI process onces per platform
    tailwindCliPromises[platform] ||= tailwindCli(input!, metroConfig, {
      dev: url.searchParams.get("dev") !== "false",
      hot: url.searchParams.get("hot") !== "true",
      platform,
      projectRoot,
      input,
      output: `${output}.${platform}.css`,
      cliCommand,
      browserslist,
      browserslistEnv,
    });

    // Make sure we have some output before we start
    cliOutputs[platform] = await tailwindCliPromises[platform];

    next();
  };

  // Use getTransformOptions to bootstrap the Tailwind CLI, but ensure
  // we still call the original
  metroConfig.transformer = {
    ...metroConfig.transformer,
    nativewind: {
      input,
      outputs: cliOutputs,
    },
  };

  return metroConfig;
}

function getTailwindConfig(tailwindConfigPath: string, output: string) {
  const config = loadConfig(path.resolve(tailwindConfigPath));
  const content = config.content;
  const contentArray = "files" in content ? content.files : content;
  const matchesOutputDir = contentArray.some((pattern) => {
    if (typeof pattern !== "string") return false;
    return micromatch.isMatch(output, pattern);
  });

  if (matchesOutputDir) {
    throw new Error(
      `NativeWind: Your '${tailwindConfigPath}#content' includes the output file ${output} which will cause an infinite loop. Please read https://tailwindcss.com/docs/content-configuration#styles-rebuild-in-an-infinite-loop`,
    );
  }

  return config;
}
