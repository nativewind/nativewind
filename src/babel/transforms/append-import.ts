import { Statement } from "@babel/types";
import { Babel } from "../types";

export function appendImport(
  { types: t }: Babel,
  body: Statement[],
  variable: string,
  source: string
) {
  body.unshift(
    t.importDeclaration(
      [t.importSpecifier(t.identifier(variable), t.identifier(variable))],
      t.stringLiteral(source)
    )
  );
}
