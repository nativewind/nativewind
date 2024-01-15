import {
  EnableCssInteropOptions,
  InteropComponentConfig,
  NativeStyleToProp,
} from "../types";

export function getNormalizeConfig(
  mapping: EnableCssInteropOptions<any>,
): InteropComponentConfig[] {
  const config = new Map<string, InteropComponentConfig>();

  for (const [source, options] of Object.entries(mapping) as Array<
    [string, EnableCssInteropOptions<any>[string]]
  >) {
    let target: string;
    let nativeStyleToProp: NativeStyleToProp<any> | undefined;

    if (!options) continue;

    if (typeof options === "boolean") {
      target = source;
    } else if (typeof options === "string") {
      target = options;
    } else {
      target = typeof options.target === "boolean" ? source : options.target;
      nativeStyleToProp = options.nativeStyleToProp;
    }

    config.set(target, { target, source, nativeStyleToProp });
  }

  return Array.from(config.values());
}
