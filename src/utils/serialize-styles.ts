import {
  callExpression,
  identifier,
  memberExpression,
  stringLiteral,
} from "@babel/types";
import { MediaRecord, Style, StyleRecord } from "../types/common";

export interface DefaultSerializedStyles {
  styles: {
    [k: string]: Style;
  };
  media: MediaRecord;
}

/**
 * The Default Serializer which separates the styles into { style, media }
 */
export function serializeStyles(
  styleRecord: StyleRecord,
  replacer?: (key: string, value: string) => [string, unknown]
): DefaultSerializedStyles {
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

        if (replacer) {
          style = Object.fromEntries(
            Object.entries(style).map((v) => replacer(...v))
          );
        }

        return [newKey, style];
      });
    })
  );

  return { styles, media };
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
  return serializeStyles(styleRecord, (key, value) => {
    if (typeof value !== "string") {
      return [key, value];
    }

    if (value === "styleSheet(hairlineWidth)") {
      return [
        key,
        memberExpression(
          identifier("RNStyleSheet"),
          identifier("hairlineWidth")
        ),
      ];
    }

    if (value.startsWith("platformColor(")) {
      const result = /platformColor\((.+?)\)/.exec(value);

      if (!result) return [key, identifier("undefined")];

      const variables = result[1]
        .split(/[ ,]+/)
        .filter(Boolean)
        .map((v: string) => stringLiteral(v));

      return [key, callExpression(identifier("RNPlatformColor"), variables)];
    }

    return [key, value];
  });
}

/**
 * Used by Post CSS
 *
 * Replaces platform function strings with actual platform functions
 */
export function postCSSSerializer(styleRecord: StyleRecord) {
  const serialized = serializeStyles(styleRecord);

  const styleString = JSON.stringify(serialized.styles)
    .replace(...styleSheetReplacer)
    .replace(...platformColorReplacer);

  const mediaString = JSON.stringify(serialized.media);

  return {
    style: styleString,
    media: mediaString,
  };
}

// eslint-disable-next-line @typescript-eslint/ban-types
const styleSheetReplacer: Parameters<String["replace"]> = [
  // '"styleSheet(hairlineWidth)"' will be captured as ["styleSheet", "hairlineWidth"]
  new RegExp(`"(styleSheet)\\((.+?)\\)"`, "g"),
  // [styleSheet, hairlineWidth] => StyleSheet.hairlineWidth
  (_: string, s: string, attribute: string) => {
    const styleSheet = s.charAt(0).toUpperCase() + s.slice(1);
    return `${styleSheet}.${attribute}`;
  },
];

// eslint-disable-next-line @typescript-eslint/ban-types
const platformColorReplacer: Parameters<String["replace"]> = [
  // '"platformColor(color1, color2)"' will be captured as ["platformColor", "color1, color2"]
  new RegExp(`"(platformColor)\\((.+?)\\)"`, "g"),
  // [platformColor, "color1, color2"] => PlatformColor("color1","color2")
  (_: string, s: string, values: string) => {
    const platformColor = s.charAt(0).toUpperCase() + s.slice(1);
    const variables = values
      .split(/[ ,]+/)
      .filter(Boolean)
      .map((v) => `"${v}"`)
      .join(",");
    return `${platformColor}(${variables})`;
  },
];
