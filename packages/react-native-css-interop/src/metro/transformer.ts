import path from "path";

import worker, {
  JsTransformerConfig,
  JsTransformOptions,
  TransformResponse,
} from "metro-transform-worker";

interface TransformerConfig extends JsTransformerConfig {
  cssInterop_transformerPath?: string;
  cssInterop_outputDirectory: string;
}

export async function transform(
  config: TransformerConfig,
  projectRoot: string,
  filename: string,
  data: Buffer,
  options: JsTransformOptions,
): Promise<TransformResponse> {
  const transform = config.cssInterop_transformerPath
    ? require(config.cssInterop_transformerPath).transform
    : worker.transform;

  /**
   * Skip transforming anything that isn't ours, or is a .css file
   */
  if (
    path.dirname(filename) !== config.cssInterop_outputDirectory ||
    filename.endsWith(".css")
  ) {
    return transform(config, projectRoot, filename, data, options);
  }

  /**
   * The style object can be quite large and running it though a transform can be quite costly
   * Since the style file only uses a single import, we can transform a fake file to get the
   * dependencies and function mapping
   */
  const fakeFile = `import { injectData } from "react-native-css-interop/dist/runtime/native/styles";injectData({});`;
  const result = await transform(
    config,
    projectRoot,
    filename,
    Buffer.from(fakeFile),
    options,
  );

  const output = result.output[0] as any;
  const code = output.data.code.replace("({})", data.toString("utf-8"));

  return {
    ...result,
    output: [
      {
        ...output,
        data: {
          ...output.data,
          code,
        },
      },
    ],
  };
}
