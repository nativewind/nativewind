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
  if (typeof value !== "string") {
    return [key, value];
  }

  if (value === "styleSheet(hairlineWidth)") {
    return [key, "!!!RNStyleSheet.hairlineWidth!!!"];
  }

  if (value.startsWith("platformColor(")) {
    const result = value.match(/platformColor\((.+)\)/);

    if (!result) return [key, "!!!undefined!!!"];

    const variables = result[1]
      .split(/[ ,]+/)
      .filter(Boolean)
      .map((v: string) => `'${v}'`);

    return [key, `!!!RNPlatformColor(${variables.join(",")})!!!`];
  }

  if (value.startsWith("platform(")) {
    const result = value.match(/platform\((.+)\)/);

    if (!result) return [key, "!!!undefined!!!"];

    const props = result[1]
      .trim()
      .split(/\s+/)
      .map((a) => {
        // Edge case:
        //   platform(android:platformColor(@android:color/holo_blue_bright))
        // Sometimes the value can has a colon, so we need to collect all values
        // and join them
        let [platform, ...values] = a.split(":");

        if (!values) {
          values = [platform];
          platform = "default";
        }

        const [key, value] = postCSSReplacer(platform, `${values.join("")}`);

        return `"${key}": ${value}`;
      });

    return [key, `!!!RNPlatform.select({ ${props} })!!!`];
  }

  return [key, value];
}
