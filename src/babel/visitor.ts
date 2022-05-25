import type { Visitor } from "@babel/traverse";
import { TailwindConfig } from "tailwindcss/tailwind-config";

import { getJSXElementName } from "./utils/get-jsx-element-name";
import { hasNamedImport } from "./utils/has-named-import";
import { getImportBlockedComponents } from "./utils/get-import-blocked-components";
import { someAttributes } from "./utils/has-attribute";

import { toStyledComponent } from "./transforms/to-component";

import {
  AllowPathOptions,
  State,
  TailwindcssReactNativeBabelOptions,
} from "./types";

export interface VisitorState
  extends State,
    Required<TailwindcssReactNativeBabelOptions> {
  cwd: string;
  allowRelativeModules: AllowPathOptions;
  blockList: Set<string>;
  hasClassNames: boolean;
  hasStyledComponentImport: boolean;
  hasProvider: boolean;
  hasStyleSheetImport: boolean;
  tailwindConfig: TailwindConfig;
  tailwindConfigPath: string;
  canCompile: boolean;
  canTransform: boolean;
}

/**
 * Visitor that detects what
 * - components should be transformed
 * - what imports exist
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
      "StyledComponent",
      "tailwindcss-react-native"
    );
  },
  JSXElement(path, state) {
    const { blockList, canTransform } = state;
    const name = getJSXElementName(path.node.openingElement);

    state.hasProvider ||= name === "TailwindProvider";

    if (blockList.has(name) || name[0] !== name[0].toUpperCase()) {
      return;
    }

    if (someAttributes(path, ["className", "tw", "fill", "stroke"])) {
      if (canTransform) toStyledComponent(path);
      state.hasClassNames = true;
    }
  },
};
