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
    let removeTarget: true | undefined;

    if (!options) continue;

    if (typeof options === "boolean") {
      target = source;
    } else if (typeof options === "string") {
      target = options;
    } else if (options.target === false) {
      /*
       * Even when target == false, you still need to process as normal. As nativeStyleToProp may move a style
       * Once the styles are moved, you then need to remove the prop as there maybe left over styles
       * e.g paddingTop: calc(10 + 2em). The user may also set a fontSize here to force a value of the `em`
       */
      target = source;
      nativeStyleToProp = options.nativeStyleToProp;
      removeTarget = true;
    } else {
      target = options.target === true ? source : options.target;
      nativeStyleToProp = options.nativeStyleToProp;
    }

    config.set(target, {
      nativeStyleToProp,
      source,
      target,
      removeTarget,
    });
  }

  return Array.from(config.values());
}
