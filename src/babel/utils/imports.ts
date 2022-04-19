import { createRequire } from "node:module";
import { join, dirname, basename } from "node:path";
import { readdirSync, lstatSync } from "node:fs";
import micromatch from "micromatch";
import { NodePath } from "@babel/core";
import {
  ImportDeclaration,
  isImportSpecifier,
  isStringLiteral,
} from "@babel/types";
import { NativeVisitorState } from "../native-visitor";

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
        : specifier.imported.name === variable;
    });
  }

  return false;
}

export function getImportBlockList(
  path: NodePath<ImportDeclaration>,
  state: NativeVisitorState
) {
  const { allowModules, allowRelativeModules, blockModules, filename } = state;

  const require = createRequire(filename);

  const moduleName = path.node.source.value;
  let modulePaths: string[] = [];
  let returnComponentsAsBlocked = false;

  let isNodeModule: boolean;
  let isBlocked: boolean | undefined;
  let isAllowed: boolean | undefined;

  try {
    modulePaths = [require.resolve(moduleName)];
    isNodeModule =
      modulePaths[0].includes("node_modules") ||
      moduleName === "tailwindcss-react-native"; // Need this, coz the tests get confused
  } catch {
    /**
     * Hello user! If your are reading this then your probably why your exotic import isn't working.
     *
     * You might be using module-alias or importing a folder without an index.{js,jsx,ts,tsx} file
     * either way your doing something that isn't vanilla node or typescript.
     *
     * Because there's many scenarios, we simply try
     *  - Scan the allow/block lists and try and work out if this is a module alias
     *  - Check if its a file
     *  - Check if its a directory that has an platform specific index files
     */
    const guessAtPath = join(dirname(filename), moduleName);

    isBlocked = micromatch.isMatch(moduleName, blockModules);
    isAllowed = micromatch.isMatch(moduleName, allowModules);

    if (isBlocked || isAllowed) {
      isNodeModule = true;
    } else if (lstatSync(guessAtPath).isFile()) {
      isNodeModule = false;
      modulePaths.push(guessAtPath);
    } else {
      const allowedIndexFiles: string[] = [];

      for (const platform of ["android", "ios", "native", "web", "windows"]) {
        for (const extension of ["js", "jsx", "ts", "tsx"]) {
          allowedIndexFiles.push(`index.${platform}.${extension}`);
        }
      }

      isNodeModule = false;
      modulePaths = readdirSync(guessAtPath).flatMap((file) => {
        if (allowedIndexFiles.includes(basename(file))) {
          return [join(guessAtPath, file)];
        }

        return [];
      });
    }
  }

  if (isNodeModule) {
    isBlocked ??=
      blockModules.length > 0 && micromatch.isMatch(moduleName, blockModules);

    isAllowed ??= micromatch.isMatch(moduleName, allowModules);

    returnComponentsAsBlocked = isBlocked || !isAllowed;
  } else {
    const isNotAllowedRelative =
      Array.isArray(allowRelativeModules) &&
      allowRelativeModules.length > 0 &&
      !modulePaths.some((modulePath) =>
        micromatch.isMatch(modulePath, allowRelativeModules)
      );

    returnComponentsAsBlocked = isNotAllowedRelative;
  }

  if (!returnComponentsAsBlocked) {
    return [];
  }

  // Only return component names
  return path.node.specifiers.flatMap((specifier) => {
    const name = specifier.local.name;

    if (name[0] === name[0].toUpperCase()) {
      return [name];
    }

    return [];
  });
}
