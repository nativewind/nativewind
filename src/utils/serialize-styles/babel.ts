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
import { ExtractedValues } from "../../postcss/plugin";
import { matchRuntimeFunction } from "../../style-sheet/style-functions";
import { isRuntimeFunction, serializeHelper } from "./helper";

export function babelStyleSerializer({
  styles: rawStyles,
  atRules,
  masks,
  units,
  topics,
  childClasses,
}: ExtractedValues) {
  const { styles, ...rest } = serializeHelper(rawStyles, babelReplacer);

  return {
    styles: babelSerializeLiteral(styles),
    atRules:
      Object.keys(atRules).length > 0
        ? babelSerializeLiteral(atRules)
        : undefined,
    masks:
      Object.keys(masks).length > 0 ? babelSerializeLiteral(masks) : undefined,
    topics:
      Object.keys(topics).length > 0
        ? babelSerializeLiteral(topics)
        : undefined,
    units:
      Object.keys(units).length > 0 ? babelSerializeLiteral(units) : undefined,
    childClasses:
      Object.keys(childClasses).length > 0
        ? babelSerializeLiteral(childClasses)
        : undefined,
    hasStyles: Object.keys(styles).length > 0,
    ...rest,
  };
}

function babelReplacer(
  key: string,
  value: string
): [string, string | Expression | undefined] {
  if (!isRuntimeFunction(value)) {
    return [key, value];
  }

  return [key, functionReplacer(value)];
}

function functionReplacer(functionString: string): Expression {
  const [name, value] = matchRuntimeFunction(functionString);

  if (!name) {
    return identifier("undefined");
  }

  return callExpression(
    memberExpression(identifier("NativeWindStyleSheet"), identifier("parse")),
    [
      stringLiteral(name),
      isRuntimeFunction(value)
        ? functionReplacer(value)
        : babelSerializeLiteral(value),
    ]
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function babelSerializeLiteral(literal: any): Expression {
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
        return arrayExpression(literal.map((n) => babelSerializeLiteral(n)));
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
                babelSerializeLiteral(literal[k])
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
