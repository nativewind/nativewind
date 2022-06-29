import { extractStyles } from "../../../src/postcss/extract-styles";
import {
  AtRuleTuple,
  Style,
  StyleError,
  StyleRecord,
} from "../../../src/types/common";
import { testStyleSerializer } from "../../../src/utils/serialize-styles";

import cssPlugin from "../../../src/tailwind/css";
import { nativePlugin } from "../../../src/tailwind/native";
import { PropsWithChildren, useMemo } from "react";
import { StoreContext, StyleSheetRuntime } from "../../../src/style-sheet";
import {
  TestStyleSheetRuntime,
  TestStyleSheetStoreConstructor,
} from "../../style-sheet/tests";

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

  const { errors: outputErrors, ...actualValues } = extractStyles({
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
    serializer: (output) => {
      const actualValues: TestValues = {};

      actualValues.styles =
        Object.keys(output.styles).length > 0 ? output.styles : undefined;
      actualValues.topics =
        Object.keys(output.topics).length > 0 ? output.topics : undefined;
      actualValues.masks =
        Object.keys(output.masks).length > 0 ? output.masks : undefined;
      actualValues.units =
        Object.keys(output.units).length > 0 ? output.units : undefined;
      actualValues.atRules =
        Object.keys(output.atRules).length > 0 ? output.atRules : undefined;
      actualValues.childClasses =
        Object.keys(output.childClasses).length > 0
          ? output.childClasses
          : undefined;

      return actualValues;
    },
  });

  if (shouldError) {
    expect([...errors, ...outputErrors].length).toBeGreaterThan(0);
    expect(actualValues).toEqual({});
  } else {
    if (outputErrors.length > 0) {
      for (const error of outputErrors) console.error(error);
    }
    expect(outputErrors.length).toBe(0);
    expect(actualValues).toEqual(expectedValues);
  }
}

function dangerouslyCompileStyles(css: string, store: StyleSheetRuntime) {
  const output = extractStyles({
    theme: {},
    plugins: [cssPlugin, nativePlugin({})],
    content: [{ raw: "", extension: "html" }],
    safelist: [css],
    serializer: testStyleSerializer,
  });

  store.create(output);
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
