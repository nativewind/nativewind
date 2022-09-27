import { ThemeConfig } from "tailwindcss/types/config";

import { extractStyles } from "../../../src/postcss/extract-styles";
import {
  AtRuleTuple,
  Style,
  StyleError,
  StyleRecord,
} from "../../../src/types/common";

import cssPlugin from "../../../src/tailwind/css";
import { nativePlugin } from "../../../src/tailwind/native";
import { NativeWindStyleSheet } from "../../../src";

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
  units?: Record<string, Record<string, string>>;
  atRules?: Record<string, Array<AtRuleTuple[]>>;
  transforms?: Record<string, boolean>;
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

export function resetStyleSheet(theme?: Partial<ThemeConfig>) {
  NativeWindStyleSheet.reset();
  NativeWindStyleSheet.setDangerouslyCompileStyles((css, store) => {
    const { raw } = extractStyles({
      theme,
      plugins: [cssPlugin, nativePlugin({})],
      content: [{ raw: "", extension: "html" }],
      safelist: [css],
    });

    store.create(raw);
  });
}
