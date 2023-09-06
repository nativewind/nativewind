import { EnableCssInteropOptions, NativeStyleToProp } from "../../types";

export interface NormalizedOptions<P> {
  config: Map<
    keyof P & string,
    {
      sources: (keyof P & string)[];
      nativeStyleToProp?: NativeStyleToProp<P>;
    }
  >;
  sources: (keyof P & string)[];
  dependencies: (keyof P & string)[];
}

export function getNormalizeConfig<P>(
  mapping: EnableCssInteropOptions<P>,
): NormalizedOptions<P> {
  const config: NormalizedOptions<P>["config"] = new Map();
  const dependencies = new Set<keyof P & string>();
  const sources = new Set<keyof P & string>();

  for (const [key, options] of Object.entries(mapping) as Array<
    [keyof P & string, EnableCssInteropOptions<P>[string]]
  >) {
    let target: (keyof P & string) | undefined;
    let nativeStyleToProp: NativeStyleToProp<P> | undefined;

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

    const existing = config.get(target) ?? { sources: [] };
    if (existing.sources.length === 0) {
      config.set(target, existing);
    }
    existing.sources.push(key);

    dependencies.add(target);
    dependencies.add(key);
    sources.add(key);

    if (nativeStyleToProp) {
      existing.nativeStyleToProp = {
        ...existing.nativeStyleToProp,
        ...nativeStyleToProp,
      };
    }
  }

  return {
    config,
    dependencies: Array.from(dependencies),
    sources: Array.from(sources),
  };
}
