import { EnableCssInteropOptions, NativeStyleToProp } from "../../types";

type Prop = string;
type Source = string;

export interface NormalizedOptions {
  config: [Prop, Source, NativeStyleToProp<any> | undefined][];
  sources: Source[];
  dependencies: (Prop & Source)[];
}

export function getNormalizeConfig(
  mapping: EnableCssInteropOptions<any>,
): NormalizedOptions {
  const config = new Map<
    string,
    [Source, NativeStyleToProp<any> | undefined]
  >();
  const dependencies = new Set<string>();
  const sources = new Set<string>();

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
    dependencies.add(target);
    dependencies.add(key);
    sources.add(key);
  }

  return {
    dependencies: Array.from(dependencies),
    sources: Array.from(sources),
    config: Array.from(config.entries()).map(
      ([key, [source, nativeStyleToProp]]) => [key, source, nativeStyleToProp],
    ),
  };
}
