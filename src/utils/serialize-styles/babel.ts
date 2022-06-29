import {
  arrayExpression,
  booleanLiteral,
  Expression,
  isExpression,
  nullLiteral,
  numericLiteral,
  objectExpression,
  objectProperty,
  stringLiteral,
  unaryExpression,
} from "@babel/types";
import { ExtractedValues } from "../../postcss/plugin";
import { serializeHelper } from "./helper";

export function babelStyleSerializer({
  styles: rawStyles,
  atRules,
  masks,
  units,
  topics,
  childClasses,
}: ExtractedValues) {
  const { styles, ...rest } = serializeHelper(rawStyles, (k, v) => [k, v]);

  return {
    styles: babelSerializeObject(styles),
    atRules:
      Object.keys(atRules).length > 0
        ? babelSerializeObject(atRules)
        : undefined,
    masks:
      Object.keys(masks).length > 0 ? babelSerializeObject(masks) : undefined,
    topics:
      Object.keys(topics).length > 0 ? babelSerializeObject(topics) : undefined,
    units:
      Object.keys(units).length > 0 ? babelSerializeObject(units) : undefined,
    childClasses:
      Object.keys(childClasses).length > 0
        ? babelSerializeObject(childClasses)
        : undefined,
    hasStyles: Object.keys(styles).length > 0,
    ...rest,
  };
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
