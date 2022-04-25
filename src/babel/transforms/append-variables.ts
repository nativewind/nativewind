import {
  callExpression,
  expressionStatement,
  identifier,
  memberExpression,
  Statement,
} from "@babel/types";
import serialize from "babel-literal-to-ast";
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
