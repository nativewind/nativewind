import { createRequire } from "module";
import { join, dirname, basename } from "path";
import { readdirSync, lstatSync } from "fs";
import micromatch from "micromatch";

import { NodePath } from "@babel/core";
import { ImportDeclaration } from "@babel/types";
import { SharedVisitorState } from "../types";

export function getImportBlockedComponents(
  path: NodePath<ImportDeclaration>,
  state: SharedVisitorState
) {
  const { allowModules, allowRelativeModules, blockModules, filename } = state;

  const require = createRequire(filename);

  const moduleName = path.node.source.value;
  let modulePaths: string[] = [];
  let returnComponentsAsBlocked = false;

  let isNodeModule: boolean;
  let isBlocked: boolean | null = null;
  let isAllowed: boolean | null = null;

  try {
    modulePaths = [require.resolve(moduleName)];
    isNodeModule =
      modulePaths[0].includes("node_modules") ||
      moduleName === "tailwindcss-react-native"; // Need this, coz the tests get confused
  } catch {
    /**
     * Hello user! If your are reading this then your probably wondering why your exotic import isn't working.
     *
     * You might be using module-alias or importing a folder without an index.{js,jsx,ts,tsx} file
     * either way your doing something that isn't vanilla node or typescript.
     *
     * Because there's many scenarios, we simply try
     *  - Scan the allow/block lists and try and work out if this is a module alias
     *  - Check if its a file
     *  - Check if its a directory that has an platform specific index files
     */
    const guessAtPath = join(dirname(state.filename), moduleName);

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
        for (const ext of ["js", "jsx", "ts", "tsx"]) {
          allowedIndexFiles.push(`index.${platform}.${ext}`);
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
