import { ExtractedValues } from "../../postcss/plugin";
import { serializeHelper } from "./helper";

export function postCSSSerializer({
  styles: rawStyles,
  atRules,
  masks,
  topics,
}: ExtractedValues) {
  const { styles, ...rest } = serializeHelper(rawStyles, postCSSReplacer);

  return {
    styles: JSON.stringify(styles).replaceAll(/"?!!!"?/g, ""),
    atRules: JSON.stringify(atRules),
    masks: JSON.stringify(masks),
    topics: JSON.stringify(topics),
    ...rest,
  };
}

function postCSSReplacer(key: string, value: string): [string, unknown] {
  return [key, value];
}
