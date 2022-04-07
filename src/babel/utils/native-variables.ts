import { Expression, Statement } from "@babel/types";
import { Babel } from "../types";

export function appendVariables(
  babel: Babel,
  body: Statement[],
  styles: Expression,
  media: Expression
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
          [styles]
        )
      ),
    ])
  );

  body.push(
    t.variableDeclaration("const", [
      t.variableDeclarator(t.identifier("__tailwindMedia"), media),
    ])
  );
}
