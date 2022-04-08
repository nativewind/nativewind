import { dirname } from "path";
import { NodePath } from "@babel/core";
import * as t from "@babel/types";
import { Statement } from "@babel/types";
import { Babel } from "../types";
import { NativeVisitorState } from "../native-visitor";
import { isAllowedPath } from "../tailwind/allowed-paths";

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

/*
 * Finds if an import declaration has an imported value
 */
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

export function getImportBlockList(
  path: NodePath<t.ImportDeclaration>,
  state: NativeVisitorState
) {
  const { allowModules = "*", blockModules = [] } = state.opts;
  const { allowedContentPaths, filename } = state;

  if (
    allowedContentPaths === "*" &&
    allowModules === "*" &&
    blockModules.length === 0
  ) {
    return [];
  }

  const module = path.node.source.value;

  function getComponentNames() {
    return path.node.specifiers.flatMap((specifier) => {
      const name = specifier.local.name;

      if (name[0] === name[0].toUpperCase()) {
        return [name];
      }

      return [];
    });
  }

  if (module.startsWith(".")) {
    // This is a relative path, so make sure its within the content globs
    if (!isAllowedPath(module, allowedContentPaths, dirname(filename))) {
      return getComponentNames();
    }
  } else {
    // If the module is blocked, return the imported components
    if (blockModules.length > 0) {
      const isBlocked = blockModules.every((deny) => {
        if (deny instanceof RegExp) {
          return deny.test(module);
        } else {
          return module.startsWith(deny);
        }
      });

      if (isBlocked) {
        return getComponentNames();
      }
    }

    // If the module is not allowed, return the imported components
    if (allowModules !== "*") {
      const isAllowed = allowModules.every((allowed) => {
        if (allowed instanceof RegExp) {
          return allowed.test(module);
        } else {
          return module.startsWith(allowed);
        }
      });

      if (!isAllowed) {
        return getComponentNames();
      }
    }
  }

  // If we got here, then isAllowed = true & isBlock = false
  return [];
}
