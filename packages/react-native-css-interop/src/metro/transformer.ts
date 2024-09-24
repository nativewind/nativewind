import worker, {
  JsTransformerConfig,
  JsTransformOptions,
  TransformResponse,
} from "metro-transform-worker";

interface TransformerConfig extends JsTransformerConfig {
  originalTransformerPath?: string;
}

export async function transform(
  config: TransformerConfig,
  projectRoot: string,
  filename: string,
  data: Buffer,
  options: JsTransformOptions,
): Promise<TransformResponse> {
  const transform = config.originalTransformerPath
    ? require(config.originalTransformerPath).transform
    : worker.transform;

  if (filename.match(/.css.ios.js$/)) {
    const debugEnabled = "debugEnabled" in config && config.debugEnabled;

    if (debugEnabled) {
      console.time("Transforming style JS file");
    }
    /**
     * The style object can be quite large and running it though a transform can be quite costly
     * Since the style file only uses a single import, we can transform a fake file to get the
     * dependencies and function mapping
     *
     * We just need to ensure that the code we generate matches the code Metro would generate
     */
    const result = await transform(
      config,
      projectRoot,
      filename,
      Buffer.from(
        `require("react-native-css-interop/dist/runtime/native/styles")`,
      ),
      options,
    );

    const code = data.toString("utf-8");

    if (debugEnabled) {
      console.timeEnd("Transforming style JS file");
    }

    return {
      dependencies: result.dependencies,
      output: [
        {
          data: {
            code,
            lineCount: code.split("\n").length,
            functionMap: result.output[0].data.functionMap,
          },
          type: result.output[0].type,
        },
      ],
    };
  }

  return transform(config, projectRoot, filename, data, options);
}
