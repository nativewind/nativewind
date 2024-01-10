import {
  EnableCssInteropOptions,
  InteropComponentConfig,
  NativeStyleToProp,
} from "../types";

export function getNormalizeConfig(
  mapping: EnableCssInteropOptions<any>,
): InteropComponentConfig {
  const config = new Map<
    string,
    [string, NativeStyleToProp<any> | undefined]
  >();
  for (const [key, options] of Object.entries(mapping) as Array<
    [string, EnableCssInteropOptions<any>[string]]
  >) {
    let target: string | undefined;
    let nativeStyleToProp: NativeStyleToProp<any> | undefined;

    if (!options) continue;

    if (typeof options === "boolean") {
      target = key;
    } else if (typeof options === "string") {
      target = options;
    } else if (typeof options.target === "boolean") {
      target = key;
      nativeStyleToProp = options.nativeStyleToProp;
    } else if (typeof options.target === "string") {
      target = options.target;
      nativeStyleToProp = options.nativeStyleToProp;
    } else {
      throw new Error(
        `Unknown cssInterop target from config: ${JSON.stringify(config)}`,
      );
    }

    config.set(target, [key, nativeStyleToProp]);
  }

  return Array.from(config.entries()).map(
    ([key, [source, nativeStyleToProp]]) => [key, source, nativeStyleToProp],
  );
}
