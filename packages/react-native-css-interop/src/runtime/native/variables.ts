import { styleMetaMap } from "./misc";
import { StyleProp } from "../../types";

export function vars(variables: Record<string, string | number>) {
  const $variables: Record<string, string | number> = {};

  for (const [key, value] of Object.entries(variables)) {
    if (key.startsWith("--")) {
      $variables[key] = value;
    } else {
      $variables[`--${key}`] = value;
    }
  }

  // Create an empty style prop with meta
  const style: StyleProp = {};
  styleMetaMap.set(style, { variables: $variables });
  return style;
}
