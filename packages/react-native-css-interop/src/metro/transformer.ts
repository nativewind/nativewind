import worker, {
  JsTransformerConfig,
  JsTransformOptions,
  TransformResponse,
} from "metro-transform-worker";

import { cssToReactNativeRuntime } from "../css-to-rn";
import { CssToReactNativeRuntimeOptions } from "../types";

interface CssInteropJsTransformerConfig extends JsTransformerConfig {
  transformerPath?: string;
  cssToReactNativeRuntime?: CssToReactNativeRuntimeOptions;
}

type Experiments = NonNullable<CssToReactNativeRuntimeOptions["experiments"]>;

export function transform(
  config: CssInteropJsTransformerConfig,
  projectRoot: string,
  filename: string,
  data: Buffer | string,
  options: JsTransformOptions,
): Promise<TransformResponse> {
  const transformer = config.transformerPath
    ? require(config.transformerPath).transform
    : worker.transform;

  // If the file is not CSS, then use the default behavior.
  const isCss = options.type !== "asset" && matchCss(filename);

  if (!isCss || options.platform === "web") {
    return transformer(config, projectRoot, filename, data, options);
  }

  const runtimeData = JSON.stringify(
    cssToReactNativeRuntime(data, config.cssToReactNativeRuntime),
  );

  const isCSSModule = matchCssModule(filename);

  data = experimentsToJS(config.cssToReactNativeRuntime?.experiments);

  data = Buffer.from(
    isCSSModule
      ? `${data}module.exports = require("react-native-css-interop").StyleSheet.create(${runtimeData});`
      : `${data}require("react-native-css-interop").StyleSheet.registerCompiled(${runtimeData})`,
  );

  return worker.transform(config, projectRoot, filename, data, options);
}

export function experimentsToJS(experiments: Experiments = {}): string {
  return (
    Object.entries(experiments) as [keyof Experiments, true | undefined][]
  ).reduce((acc, [key, value]) => {
    if (!value) return acc;
    switch (key) {
      case "inlineAnimations":
        return `${acc}process.env.NATIVEWIND_INLINE_ANIMATION = '1';`;
      default:
        return acc;
    }
  }, "");
}

function matchCss(filePath: string): boolean {
  return /\.css$/.test(filePath);
}

function matchCssModule(filePath: string): boolean {
  return /\.module(\.(native|ios|android|web))?\.css$/.test(filePath);
}
