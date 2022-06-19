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
import { TailwindProvider, TailwindProviderProps } from "../../../src";
import { PropsWithChildren } from "react";

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
  atRules?: Record<string, Array<AtRuleTuple[]>>;
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
    serializer: (styles) => styles,
  });

  if (shouldError) {
    expect([...errors, ...outputErrors].length).toBeGreaterThan(0);
    expect(actualValues.styles).toEqual({});
    expect(actualValues.masks).toEqual({});
    expect(actualValues.atRules).toEqual({});
    expect(actualValues.topics).toEqual({});
  } else {
    expect(outputErrors.length).toBe(0);
    expect(actualValues.styles).toEqual(expectedValues.styles);
    expect(actualValues.masks).toEqual(expectedValues.masks || {});
    expect(actualValues.atRules).toEqual(expectedValues.atRules || {});
    expect(actualValues.topics).toEqual(expectedValues.topics || {});
  }
}

export function TestProvider({
  css,
  ...props
}: PropsWithChildren<TailwindProviderProps & { css: string }>) {
  const { styles, atRules } = extractStyles({
    theme: {},
    plugins: [cssPlugin, nativePlugin({})],
    content: [{ raw: "", extension: "html" }],
    safelist: [css],
    serializer: testStyleSerializer,
  });

  return <TailwindProvider styles={styles} media={atRules} {...props} />;
}
