import {
  arrayExpression,
  booleanLiteral,
  callExpression,
  expressionStatement,
  identifier,
  memberExpression,
  nullLiteral,
  numericLiteral,
  objectExpression,
  objectProperty,
  Statement,
  stringLiteral,
  unaryExpression,
} from "@babel/types";
import { MediaRecord, StyleRecord } from "../types";
import { globalMedia, globalStyle } from "./constants";

export function appendVariables(
  body: Statement[],
  styles: StyleRecord,
  media: MediaRecord
) {
  body.push(
    expressionStatement(
      callExpression(
        memberExpression(identifier("Object"), identifier("assign")),
        [
          memberExpression(identifier("globalThis"), identifier(globalStyle)),
          callExpression(
            memberExpression(identifier("StyleSheet"), identifier("create")),
            [serialize(styles)]
          ),
        ]
      )
    ),
    expressionStatement(
      callExpression(
        memberExpression(identifier("Object"), identifier("assign")),
        [
          memberExpression(identifier("globalThis"), identifier(globalMedia)),
          serialize(media),
        ]
      )
    )
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function serialize(literal: any): any {
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
        return arrayExpression(literal.map((n) => serialize(n)));
      }
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
}
