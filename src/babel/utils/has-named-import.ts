import { NodePath } from "@babel/core";
import {
  ImportDeclaration,
  isImportSpecifier,
  isStringLiteral,
} from "@babel/types";

/*
 * Finds if an import declaration has an imported value
 */
export function hasNamedImport(
  path: NodePath<ImportDeclaration>,
  variable: string,
  source: string
) {
  if (path.node.source.value === source) {
    return path.node.specifiers.some((specifier) => {
      if (!isImportSpecifier(specifier)) {
        return;
      }

      return isStringLiteral(specifier.imported)
        ? specifier.imported.value === variable
        : specifier.local.name === variable;
    });
  }

  return false;
}
