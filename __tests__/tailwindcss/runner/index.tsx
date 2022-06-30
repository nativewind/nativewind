import { extractStyles } from "../../../src/postcss/extract-styles";
import {
  AtRuleTuple,
  Style,
  StyleError,
  StyleRecord,
} from "../../../src/types/common";

import cssPlugin from "../../../src/tailwind/css";
import { nativePlugin } from "../../../src/tailwind/native";
import { PropsWithChildren, useMemo } from "react";
import { StoreContext, StyleSheetRuntime } from "../../../src/style-sheet";
import {
  TestStyleSheetRuntime,
  TestStyleSheetStoreConstructor,
} from "../../style-sheet/tests";
import {
  isRuntimeFunction,
  parseString,
} from "../../../src/style-sheet/style-functions";

export type Test = [string, TestValues] | [string, StyleRecord, true];

export { spacing, spacingCases } from "./spacing";
export { createTests, expectError } from "./tests";

export function tailwindRunner(name: string, ...testCases: Array<Test[]>) {
  describe(name, () => {
    test.each(testCases.flat())("%s", assertStyles);
  });
}

export interface TestValues {
  styles?: Record<string, Style>;
  topics?: Record<string, Array<string>>;
  masks?: Record<string, number>;
  units?: StyleSheetRuntime["units"];
  atRules?: Record<string, Array<AtRuleTuple[]>>;
  childClasses?: Record<string, string[]>;
}

export function assertStyles(
  css: string,
  expectedValues: TestValues,
  shouldError = false
) {
  const errors: StyleError[] = [];

  const { errors: outputErrors, raw: actualValues } = extractStyles({
    theme: {},
    plugins: [
      cssPlugin,
      nativePlugin({
        onError(error: StyleError) {
          errors.push(error);
        },
      }),
    ],
    content: [{ raw: "", extension: "html" }],
    safelist: [css],
  });

  if (shouldError) {
    expect([...errors, ...outputErrors].length).toBeGreaterThan(0);
    expect(actualValues.styles).toEqual({});
  } else {
    if (outputErrors.length > 0) {
      for (const error of outputErrors) console.error(error);
    }
    expect(outputErrors.length).toBe(0);
    expect(actualValues).toEqual(expectedValues);
  }
}

function dangerouslyCompileStyles(css: string, store: StyleSheetRuntime) {
  const { raw } = extractStyles({
    theme: {},
    plugins: [cssPlugin, nativePlugin({})],
    content: [{ raw: "", extension: "html" }],
    safelist: [css],
  });

  const serializedStyles: Record<string, Record<string, unknown>> = {};

  for (const [key, style] of Object.entries(raw.styles || {})) {
    serializedStyles[key] = {};

    for (const [k, v] of Object.entries(style)) {
      if (isRuntimeFunction(v)) {
        serializedStyles[key][k] = parseString(v, (x) => x);
      } else {
        serializedStyles[key][k] = v;
      }
    }
  }

  store.create({
    ...raw,
    styles: serializedStyles,
  });
}

export function TestProvider({
  children,
  ...props
}: PropsWithChildren<TestStyleSheetStoreConstructor>) {
  const store = useMemo(
    () => new TestStyleSheetRuntime({ ...props, dangerouslyCompileStyles }),
    []
  );
  return (
    <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
  );
}
