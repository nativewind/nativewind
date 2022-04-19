import { Statement } from "@babel/types";
import serialize from "babel-literal-to-ast";
import { Babel, MediaRecord, StyleRecord } from "../types";

export function appendVariables(
  babel: Babel,
  body: Statement[],
  styles: StyleRecord,
  media: MediaRecord
) {
  const { types: t } = babel;

  body.push(
    t.variableDeclaration("const", [
      t.variableDeclarator(
        t.identifier("__tailwindStyles"),
        t.callExpression(
          t.memberExpression(
            t.identifier("StyleSheet"),
            t.identifier("create")
          ),
          [serialize(styles)]
        )
      ),
    ]),
    t.variableDeclaration("const", [
      t.variableDeclarator(t.identifier("__tailwindMedia"), serialize(media)),
    ])
  );
}
