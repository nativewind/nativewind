import { NodePath } from "@babel/core";
import * as t from "@babel/types";
import { Statement } from "@babel/types";
import { Babel, State } from "../types";

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

export function hasNamedImport(
  path: NodePath<t.ImportDeclaration>,
  variable: string,
  source: string
) {
  if (path.node.source.value === source) {
    return path.node.specifiers.some((specifier) => {
      if (!t.isImportSpecifier(specifier)) {
        return;
      }

      if (t.isStringLiteral(specifier.imported)) {
        return specifier.imported.value === variable;
      } else {
        return specifier.imported.name === variable;
      }
    });
  }

  return false;
}

export function getBlackedListedComponents(
  path: NodePath<t.ImportDeclaration>,
  state: State
) {
  const { allowedImports = "*", deniedImports = [] } = state.opts;

  if (allowedImports === "*" && deniedImports.length === 0) {
    return [];
  }

  const module = path.node.source.value;

  if (allowedImports !== "*") {
    const isAllowed = allowedImports.every((allowed) => {
      if (allowed instanceof RegExp) {
        return allowed.test(module);
      } else {
        return module.startsWith(allowed);
      }
    });

    if (isAllowed) {
      return [];
    }
  }

  if (deniedImports.length > 0) {
    const isDenied = deniedImports.every((deny) => {
      if (deny instanceof RegExp) {
        return deny.test(module);
      } else {
        return module.startsWith(deny);
      }
    });

    if (!isDenied) {
      return [];
    }
  }

  // If we have made it to here, either the module was
  // not allowed or was denied.
  return path.node.specifiers.map((specifier) => {
    return specifier.local.name;
  });
}
