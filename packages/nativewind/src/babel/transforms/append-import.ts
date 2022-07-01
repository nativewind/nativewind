import {
  identifier,
  importDeclaration,
  importDefaultSpecifier,
  importSpecifier,
  Statement,
  stringLiteral,
} from "@babel/types";

export function prependImports(
  body: Statement[],
  variables: Array<string | string[]> | string,
  source: string
) {
  body.unshift(
    importDeclaration(
      typeof variables === "string"
        ? [importDefaultSpecifier(identifier(variables))]
        : variables.map((variable) => {
            return typeof variable === "string"
              ? importSpecifier(identifier(variable), identifier(variable))
              : importSpecifier(
                  identifier(variable[0]),
                  identifier(variable[1])
                );
          }),
      stringLiteral(source)
    )
  );
}
