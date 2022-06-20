import {
  arrayExpression,
  booleanLiteral,
  callExpression,
  Expression,
  identifier,
  isExpression,
  nullLiteral,
  numericLiteral,
  objectExpression,
  objectProperty,
  stringLiteral,
  unaryExpression,
} from "@babel/types";
import { ExtractedValues } from "../../postcss/plugin";
import { isRuntimeFunction, serializeHelper } from "./helper";

export function babelStyleSerializer({
  styles: rawStyles,
  atRules,
  masks,
  topics,
  childClasses,
}: ExtractedValues) {
  const { styles, ...rest } = serializeHelper(rawStyles, babelReplacer);

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
    childClasses:
      Object.keys(childClasses).length > 0
        ? babelSerializeObject(childClasses)
        : undefined,
    hasStyles: Object.keys(styles).length > 0,
    ...rest,
  };
}

function babelReplacer(key: string, value: string): [string, unknown] {
  if (typeof value !== "string") {
    return [key, value];
  }

  if (isRuntimeFunction(value)) {
    return [
      key,
      callExpression(identifier("NWRuntimeParser"), [stringLiteral(value)]),
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
