import {
  arrayExpression,
  booleanLiteral,
  callExpression,
  Expression,
  identifier,
  isExpression,
  memberExpression,
  nullLiteral,
  numericLiteral,
  objectExpression,
  objectProperty,
  stringLiteral,
  unaryExpression,
} from "@babel/types";
import { StyleRecord } from "../../types/common";
import { serializeStyles } from "./serialize-styles";

export function babelStyleSerializer(styleRecord: StyleRecord) {
  const { styles, media, ...rest } = serializeStyles(
    styleRecord,
    babelReplacer
  );

  return {
    styles: babelSerializeObject(styles),
    media: babelSerializeObject(media),
    hasStyles: Object.keys(styles).length > 0,
    ...rest,
  };
}

export function babelImport(name: string) {
  return `___tw_${name}`;
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function babelSerializeObject(literal: any): Expression {
  if (isExpression(literal)) {
    return literal;
  }

  if (literal === null) {
    return nullLiteral();
  }

  switch (typeof literal) {
    case "number":
      return numericLiteral(literal);
    case "string":
      return stringLiteral(literal);
    case "boolean":
      return booleanLiteral(literal);
    case "undefined":
      return unaryExpression("void", numericLiteral(0), true);
    default:
      if (Array.isArray(literal)) {
        return arrayExpression(literal.map((n) => babelSerializeObject(n)));
      }

      if (isObject(literal)) {
        return objectExpression(
          Object.keys(literal)
            .filter((k) => {
              return typeof literal[k] !== "undefined";
            })
            .map((k) => {
              return objectProperty(
                stringLiteral(k),
                babelSerializeObject(literal[k])
              );
            })
        );
      }

      throw new Error("un-serializable literal");
  }
}

function isObject(literal: unknown): literal is Record<string, unknown> {
  return typeof literal === "object";
}
