import { MediaRecord, StyleRecord } from "../types/common";

export function serializeStyles(styleRecord: StyleRecord) {
  const media: MediaRecord = {};

  const styles = Object.fromEntries(
    Object.entries(styleRecord).flatMap(([key, value]) => {
      return value.map((style) => {
        let newKey = key;
        if ("atRules" in style) {
          const { atRules, ...rest } = style;
          media[key] ??= [];
          newKey = `${key}.${media[key].length}`;
          media[key].push(atRules);
          style = rest;
        }
        return [newKey, style];
      });
    })
  );

  return { styles, media };
}
