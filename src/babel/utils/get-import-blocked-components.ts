import { createRequire } from "node:module";
import { join, dirname, basename } from "node:path";
import { readdirSync, lstatSync, existsSync } from "node:fs";
import micromatch from "micromatch";

import { NodePath } from "@babel/core";
import { ImportDeclaration } from "@babel/types";
import { SharedVisitorState } from "../types";

const allowedIndexFiles: string[] = [];
for (const platform of ["android", "ios", "native", "web", "windows"]) {
  for (const extension of ["js", "jsx", "ts", "tsx"]) {
    allowedIndexFiles.push(`index.${platform}.${extension}`);
  }
}

export function getImportBlockedComponents(
  path: NodePath<ImportDeclaration>,
  state: SharedVisitorState
): string[] {
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
     * Hello user! If your are reading this then your probably wondering why your exotic import isn't working.
     *
     * You might be using module-alias, ts-config paths, or importing a folder without an index.{js,jsx,ts,tsx} file
     * either way your doing something that doesn't follow the rules of a normal require statement.
     *
     * Because there's many scenarios, we simply try
     *  - Check if its a file
     *  - Check if its a directory that has an platform specific index files
     *  - Scan the allow/block lists and try and work out if this is a module alias
     */
    const guessAtPath = join(dirname(filename), moduleName);
    const existsOnFileSystem = existsSync(guessAtPath);

    if (existsOnFileSystem) {
      if (lstatSync(guessAtPath).isFile()) {
        // Not sure why require would fail if this was a file, but lets account for it anyway
        isNodeModule = false;
        modulePaths.push(guessAtPath);
      } else {
        isNodeModule = false;

        for (const file of readdirSync(guessAtPath)) {
          if (allowedIndexFiles.includes(basename(file))) {
            modulePaths.push(join(guessAtPath, file));
          }
        }
      }
    } else {
      isNodeModule = true;
      isBlocked = micromatch.isMatch(moduleName, blockModules);
      isAllowed =
        allowModules === "*"
          ? true
          : micromatch.isMatch(moduleName, allowModules);
    }
  }

  if (isNodeModule) {
    isBlocked ??= micromatch.isMatch(moduleName, blockModules);
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
