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

export function transform(
  config: CssInteropJsTransformerConfig,
  projectRoot: string,
  filename: string,
  data: Buffer,
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

  data = Buffer.from(
    matchCssModule(filename)
      ? `module.exports = require("react-native-css-interop").StyleSheet.create(${runtimeData});`
      : `require("react-native-css-interop").StyleSheet.register(${runtimeData});`,
  );

  return worker.transform(config, projectRoot, filename, data, options);
}

function matchCss(filePath: string): boolean {
  return /\.css$/.test(filePath);
}

function matchCssModule(filePath: string): boolean {
  return /\.module(\.(native|ios|android|web))?\.css$/.test(filePath);
}
