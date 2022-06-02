import { DefaultSerializedStyles } from "../../utils/serialize-styles";

import {
  arrayExpression,
  assignmentExpression,
  booleanLiteral,
  callExpression,
  Expression,
  expressionStatement,
  identifier,
  isExpression,
  logicalExpression,
  memberExpression,
  nullLiteral,
  numericLiteral,
  objectExpression,
  objectProperty,
  Statement,
  stringLiteral,
  unaryExpression,
} from "@babel/types";

export function appendVariables(
  body: Statement[],
  { styles, media }: DefaultSerializedStyles
) {
  body.push(
    expressionStatement(
      assignmentExpression(
        "=",
        memberExpression(
          identifier("globalThis"),
          identifier("tailwindcss_react_native_style")
        ),
        callExpression(
          memberExpression(identifier("Object"), identifier("assign")),
          [
            logicalExpression(
              "||",
              memberExpression(
                identifier("globalThis"),
                identifier("tailwindcss_react_native_style")
              ),
              identifier("{}")
            ),
            callExpression(
              memberExpression(
                identifier("RNStyleSheet"),
                identifier("create")
              ),
              [babelSerializeObject(styles)]
            ),
          ]
        )
      )
    ),
    expressionStatement(
      assignmentExpression(
        "=",
        memberExpression(
          identifier("globalThis"),
          identifier("tailwindcss_react_native_media")
        ),
        callExpression(
          memberExpression(identifier("Object"), identifier("assign")),
          [
            logicalExpression(
              "||",
              memberExpression(
                identifier("globalThis"),
                identifier("tailwindcss_react_native_media")
              ),
              identifier("{}")
            ),
            babelSerializeObject(media),
          ]
        )
      )
    )
  );
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

      throw new Error("unserializable literal");
  }
}

function isObject(literal: unknown): literal is Record<string, unknown> {
  return typeof literal === "object";
}
