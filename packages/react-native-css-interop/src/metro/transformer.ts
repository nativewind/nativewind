import worker, {
  JsTransformerConfig,
  JsTransformOptions,
  TransformResponse,
} from "metro-transform-worker";

import { cssToReactNativeRuntime } from "../css-to-rn";

export function cssInteropTransform(
  config: JsTransformerConfig & {
    existingTransformerPath: string;
    externallyManagedCss?: Record<string, string>;
  },
  projectRoot: string,
  filename: string,
  data: Buffer,
  options: JsTransformOptions,
): Promise<TransformResponse> {
  // If the file is not CSS, then use the default behavior.
  const isCss = options.type !== "asset" && matchCss(filename);

  if (!isCss) {
    return config.existingTransformerPath
      ? require(config.existingTransformerPath)(
          config,
          projectRoot,
          filename,
          data,
          options,
        )
      : worker.transform(config, projectRoot, filename, data, options);
  }

  const { warnings, errors, ...stylesheetOptions } =
    cssToReactNativeRuntime(data);
  const stringifiedOptions = JSON.stringify(stylesheetOptions);

  // TODO: Log warnings and errors

  if (matchCssModule(filename)) {
    return worker.transform(
      config,
      projectRoot,
      filename,
      Buffer.from(
        `module.exports = require("react-native-css-interop").StyleSheet.create(${stringifiedOptions});`,
      ),
      options,
    );
  } else {
    return worker.transform(
      config,
      projectRoot,
      filename,
      Buffer.from(
        `require("react-native-css-interop").StyleSheet.register(${stringifiedOptions});`,
      ),
      options,
    );
  }
}

function matchCss(filePath: string): boolean {
  return /\.css$/.test(filePath);
}

function matchCssModule(filePath: string): boolean {
  return /\.module(\.(native|ios|android|web))?\.css$/.test(filePath);
}
