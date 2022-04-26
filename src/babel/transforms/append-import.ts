import {
  identifier,
  importDeclaration,
  importSpecifier,
  Statement,
  stringLiteral,
} from "@babel/types";

export function prependImport(
  body: Statement[],
  variable: string,
  source: string
) {
  body.unshift(
    importDeclaration(
      [importSpecifier(identifier(variable), identifier(variable))],
      stringLiteral(source)
    )
  );
}
