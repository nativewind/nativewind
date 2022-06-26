import type { Visitor } from "@babel/traverse";

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
import { Config } from "tailwindcss";

export interface VisitorState
  extends State,
    Omit<Required<TailwindcssReactNativeBabelOptions>, "tailwindConfigPath"> {
  cwd: string;
  allowRelativeModules: AllowPathOptions;
  blockList: Set<string>;
  hasStyledComponentImport: boolean;
  hasStyleSheetImport: boolean;
  tailwindConfig: Config;
  canCompile: boolean;
  canTransform: boolean;
  didTransform: boolean;
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
      "RNStyleSheet",
      "react-native"
    );

    state.hasStyledComponentImport ||= hasNamedImport(
      path,
      "StyledComponent",
      "nativewind"
    );
  },
  JSXElement(path, state) {
    const { blockList, canTransform } = state;
    const name = getJSXElementName(path.node.openingElement);

    if (blockList.has(name) || name[0] !== name[0].toUpperCase()) {
      return;
    }

    if (someAttributes(path, ["className", "tw"]) && canTransform) {
      state.didTransform ||= true;
      toStyledComponent(path);
    }
  },
};
