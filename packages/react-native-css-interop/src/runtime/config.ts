import { EnableCssInteropOptions, InteropComponentConfig } from "../types";

export function getNormalizeConfig(
  mapping: EnableCssInteropOptions<any>,
): InteropComponentConfig[] {
  const configs: InteropComponentConfig[] = [];

  for (const [source, options] of Object.entries(mapping)) {
    let target: string[];
    let inlineProp: string | undefined;
    let propToRemove: string | undefined;
    let nativeStyleToProp: InteropComponentConfig["nativeStyleToProp"];

    if (!options) continue;

    if (options === true) {
      target = [source];
    } else if (typeof options === "string") {
      target = [options];
    } else if (options.target === false) {
      /*
       * Even when target == false, you still need to process as normal. As nativeStyleToProp may move a style
       * Once the styles are moved, you then need to remove the prop as there maybe left over styles
       * e.g paddingTop: calc(10 + 2em). The user may also set a fontSize here to force a value of the `em`
       */
      target = [source];
      propToRemove = source;
      nativeStyleToProp = parseNativeStyleToProp(options.nativeStyleToProp);
    } else {
      target = options.target === true ? [source] : options.target.split(".");
      nativeStyleToProp = parseNativeStyleToProp(options.nativeStyleToProp);
    }

    if (target.length === 1 && target[0] !== source) {
      inlineProp = target[0];
    }

    configs.push({
      nativeStyleToProp,
      source,
      target,
      inlineProp,
      propToRemove,
    });
  }

  return configs;
}

function parseNativeStyleToProp(
  nativeStyleToProp?: Record<string, string | true>,
): InteropComponentConfig["nativeStyleToProp"] {
  if (!nativeStyleToProp) return;

  return Object.entries(nativeStyleToProp).map(([key, value]) => {
    return [key, value === true ? [key] : value.split(".")];
  });
}
