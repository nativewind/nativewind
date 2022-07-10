import { NodePath, types } from "@babel/core";
import {
  isImportDefaultSpecifier,
  isImportSpecifier,
  isStringLiteral,
} from "@babel/types";

/*
 * Finds if an import declaration has an imported value
 */
export function hasNamedImport(
  path: NodePath<types.ImportDeclaration>,
  variable: string,
  source: string
) {
  if (path.node.source.value.startsWith(source)) {
    return path.node.specifiers.some((specifier) => {
      if (isImportDefaultSpecifier(specifier)) {
        return specifier.local.name === variable;
      } else if (isImportSpecifier(specifier)) {
        return isStringLiteral(specifier.imported)
          ? specifier.imported.value === variable
          : specifier.imported.name === variable;
      }

      return false;
    });
  }

  return false;
}
