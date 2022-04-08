import type { Visitor } from "@babel/traverse";
import { TailwindConfig } from "tailwindcss/tailwind-config";

import { Babel, State } from "./types";
import { getJSXElementName } from "./utils/jsx";
import { getImportBlockList, hasNamedImport } from "./utils/imports";
import {
  transformClassName,
  TransformClassNameOptions,
} from "./utils/transform-class-names";

export interface NativeVisitorState extends State {
  babel: Babel;
  tailwindConfig: TailwindConfig;
  blockList: Set<string>;
  hasUseParseTailwind: boolean;
  hasStyleSheetImport: boolean;
  hasClassNames: boolean;
  hasProvider: boolean;
  visitor?: Visitor<NativeVisitorState>;
  transformClassNameOptions: TransformClassNameOptions;
  allowedContentPaths: string[] | "*";
}

/**
 * Visitor that preforms common operations betweent the native platforms
 *
 * @remarks
 *
 * If a platform needs to provide bespoke functionality, they can provide a Visitor object
 * on the state. (note: This Visitor is not valided by Babel so use with caution)
 *
 * @privateRemarks
 *
 * This should only focus on common functionality, eg:
 *  - Detecting imports
 *  - Detecting if a JSXElement should be processed
 *
 *  The only exception to this is the className -> style transform
 *  as that is also used to detect the className attribute should be processed
 *
 */
export const nativeVisitor: Visitor<NativeVisitorState> = {
  ImportDeclaration(path, state) {
    for (const component of getImportBlockList(path, state)) {
      state.blockList.add(component);
    }

    // We only need to check named imports.
    // THe code will still work if they are using a Namespace Specifier
    state.hasStyleSheetImport =
      state.hasStyleSheetImport ||
      hasNamedImport(path, "StyleSheet", "react-native");

    state.hasUseParseTailwind =
      state.hasUseParseTailwind ||
      hasNamedImport(path, "__useParseTailwind", "tailwindcss-react-native");
  },
  JSXOpeningElement(path, state) {
    const name = getJSXElementName(path.node);

    if (state.blockList.has(name)) {
      return;
    }

    const hasClassNames = transformClassName(
      state.babel,
      path,
      state.transformClassNameOptions
    );

    state.hasClassNames ||= hasClassNames;

    if (typeof state.visitor?.JSXOpeningElement === "function") {
      state.visitor.JSXOpeningElement.bind(this)(path, state);
    }
  },
};
