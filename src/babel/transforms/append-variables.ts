import {
  arrayExpression,
  assignmentExpression,
  booleanLiteral,
  callExpression,
  Expression,
  expressionStatement,
  identifier,
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

import { StyleRecord } from "../../types/common";
import { serialiseStyles } from "../../utils/serialise-styles";

export function appendVariables(body: Statement[], styleRecord: StyleRecord) {
  const { styles, media } = serialiseStyles(styleRecord);

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
              memberExpression(identifier("StyleSheet"), identifier("create")),
              [serialize(styles)]
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
            serialize(media),
          ]
        )
      )
    )
  );
}

function serialize(literal: unknown): Expression {
  if (literal === null) {
    return nullLiteral();
  }
  switch (typeof literal) {
    case "number":
      return numericLiteral(literal);
    case "string":
      if (literal === "hairlineWidth") {
        return memberExpression(
          identifier("StyleSheet"),
          identifier("hairlineWidth")
        );
      }

      return stringLiteral(literal);
    case "boolean":
      return booleanLiteral(literal);
    case "undefined":
      return unaryExpression("void", numericLiteral(0), true);
    default:
      if (Array.isArray(literal)) {
        return arrayExpression(literal.map((n) => serialize(n)));
      }

      if (isObject(literal)) {
        return objectExpression(
          Object.keys(literal)
            .filter((k) => {
              return typeof literal[k] !== "undefined";
            })
            .map((k) => {
              return objectProperty(stringLiteral(k), serialize(literal[k]));
            })
        );
      }

      throw new Error("unserializable literal");
  }
}

function isObject(literal: unknown): literal is Record<string, unknown> {
  return typeof literal === "object";
}
