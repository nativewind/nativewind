import type { Visitor } from "@babel/traverse";
import { TailwindConfig } from "tailwindcss/tailwind-config";

import { getJSXElementName } from "./utils/get-jsx-element-name";
import { hasNamedImport } from "./utils/has-named-import";
import { getImportBlockedComponents } from "./utils/get-import-blocked-components";
import { hasAttribute } from "./utils/has-attribute";

import { componentProxy, packageName } from "./transforms/constants";
import { toStyledComponent } from "./transforms/to-component";
import { appendPlatformAttribute } from "./transforms/append-platform-attribute";

import { AllowPathOptions, State, TailwindReactNativeOptions } from "./types";

export interface VisitorState
  extends State,
    Required<TailwindReactNativeOptions> {
  allowRelativeModules: AllowPathOptions;
  blockList: Set<string>;
  hasClassNames: boolean;
  hasStyledComponentImport: boolean;
  hasProvider: boolean;
  hasStyleSheetImport: boolean;
  tailwindConfig: TailwindConfig;
}

/**
 * Visitor that preforms common operations
 *
 * @privateRemarks
 *
 * This should only focus on common functionality, eg:
 *  - Detecting imports
 *  - Detecting if a JSXElement should be processed
 */
export const visitor: Visitor<VisitorState> = {
  ImportDeclaration(path, state) {
    for (const component of getImportBlockedComponents(path, state)) {
      state.blockList.add(component);
    }

    state.hasStyleSheetImport ||= hasNamedImport(
      path,
      "StyleSheet",
      "react-native"
    );

    state.hasStyledComponentImport ||= hasNamedImport(
      path,
      componentProxy,
      packageName
    );
  },
  JSXElement(path, state) {
    const name = getJSXElementName(path.node.openingElement);

    state.hasProvider ||= name === "TailwindProvider";

    if (name === "TailwindProvider") {
      appendPlatformAttribute(path, state.platform);
    }

    if (state.blockList.has(name) || name[0] !== name[0].toUpperCase()) {
      return;
    }

    if (hasAttribute(path, "className")) {
      toStyledComponent(path);
      state.hasClassNames = true;
    }
  },
};
