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

  if (filename.match(/\.css\..+?\.js$/)) {
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
        `import { injectData } from "react-native-css-interop/dist/runtime/native/styles";
        injectData({});
        `,
      ),
      options,
    );

    if (debugEnabled) {
      console.timeEnd("Transforming style JS file");
    }

    return {
      dependencies: result.dependencies,
      output: [
        {
          // data: result.output[0].data,
          data: {
            ...result.output[0].data,
            code: result.output[0].data.code.replace(
              "injectData)({})",
              data.toString("utf-8"),
            ),
          },
          type: result.output[0].type,
        },
      ],
    };
  }

  return transform(config, projectRoot, filename, data, options);
}
