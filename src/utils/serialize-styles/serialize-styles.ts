import {
  callExpression,
  identifier,
  isExpression,
  memberExpression,
  objectExpression,
  objectProperty,
  stringLiteral,
} from "@babel/types";
import { MediaRecord, Style, StyleRecord } from "../../types/common";

export interface DefaultSerializedStyles {
  styles: {
    [k: string]: Style;
  };
  media: MediaRecord;
  hasPlatform: boolean;
  hasPlatformColor: boolean;
}

/**
 * The Default Serializer which separates the styles into { style, media }
 */
export function serializeStyles(
  styleRecord: StyleRecord,
  replacer?: (key: string, value: string) => [string, unknown]
): DefaultSerializedStyles {
  const media: MediaRecord = {};

  let hasPlatform = false;
  let hasPlatformColor = false;

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

        if (replacer) {
          style = Object.fromEntries(
            Object.entries(style).map(([k, v]) => {
              if (typeof v === "string") {
                hasPlatform ||= v.includes("platform(");
                hasPlatformColor ||= v.includes("platformColor(");
              }
              return replacer(k, v);
            })
          );
        }

        return [newKey, style];
      });
    })
  );

  return { styles, media, hasPlatform, hasPlatformColor };
}

/**
 * Used by Jest
 *
 * Replaces platform function strings with known values
 */
export function testStyleSerializer(styleRecord: StyleRecord) {
  return serializeStyles(styleRecord, (key, value) => {
    if (value === "styleSheet(hairlineWidth)") {
      return [key, 1];
    }

    return [key, value];
  });
}

/**
 * Used by Babel
 *
 * Replaces platform function strings with actual platform functions
 */
export function babelStyleSerializer(styleRecord: StyleRecord) {
  return serializeStyles(styleRecord, babelReplacer);
}

function babelReplacer(key: string, value: string): [string, unknown] {
  if (typeof value !== "string") {
    return [key, value];
  }

  if (value === "styleSheet(hairlineWidth)") {
    return [
      key,
      memberExpression(identifier("RNStyleSheet"), identifier("hairlineWidth")),
    ];
  }

  if (value.startsWith("platformColor(")) {
    const result = value.match(/platformColor\((.+)\)/);

    if (!result) return [key, identifier("undefined")];

    const variables = result[1]
      .split(/[ ,]+/)
      .filter(Boolean)
      .map((v: string) => stringLiteral(v));

    return [key, callExpression(identifier("RNPlatformColor"), variables)];
  }

  if (value.startsWith("platform(")) {
    const result = value.match(/platform\((.+)\)/);

    if (!result) return [key, identifier("undefined")];

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

        const [key, value] = babelReplacer(platform, `${values.join("")}`);

        if (typeof value === "object" && isExpression(value)) {
          return objectProperty(identifier(key), value);
        } else if (typeof value === "string") {
          return objectProperty(identifier(key), stringLiteral(value));
        } else {
          throw new TypeError("Shouldn't reach here");
        }
      });

    return [
      key,
      callExpression(
        memberExpression(identifier("RNPlatform"), identifier("select")),
        [objectExpression(props)]
      ),
    ];
  }

  return [key, value];
}

/**
 * Used by Post CSS
 *
 * Replaces platform function strings with actual platform functions
 */
export function postCSSSerializer(styleRecord: StyleRecord) {
  const { styles, media, ...rest } = serializeStyles(
    styleRecord,
    postCSSReplacer
  );

  return {
    style: JSON.stringify(styles).replaceAll(/"?!!!"?/g, ""),
    media: JSON.stringify(media),
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
