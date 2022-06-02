import { TailwindConfig } from "tailwindcss/tailwind-config";
import { extractStyles } from "../../../src/postcss/extract-styles";
import { StyleError, StyleRecord } from "../../../src/types/common";
import { testStyleSerializer } from "../../../src/utils/serialize-styles";

import plugin from "../../../src/tailwind";
import { nativePlugin } from "../../../src/tailwind/native";
import { TailwindProvider, TailwindProviderProps } from "../../../src";
import { PropsWithChildren } from "react";

export type Test = [string, StyleRecord] | [string, StyleRecord, true];

export { spacing, spacingCases } from "./spacing";
export { createTests, expectError } from "./tests";

export function tailwindRunner(name: string, ...testCases: Array<Test[]>) {
  describe(name, () => {
    test.each(testCases.flat())("%s", assertStyles);
  });
}

export function assertStyles(
  css: string,
  styles: StyleRecord,
  shouldError = false
) {
  const errors: StyleError[] = [];

  const { errors: outputErrors, ...output } = extractStyles({
    theme: {},
    plugins: [
      plugin,
      nativePlugin({
        onError(error) {
          errors.push(error);
        },
      }),
    ],
    content: [
      { raw: "", extension: "html" },
    ] as unknown as TailwindConfig["content"],
    safelist: [css],
    serializer: (styles) => styles,
  });

  if (shouldError) {
    expect([...errors, ...outputErrors].length).toBeGreaterThan(0);
  } else {
    expect(outputErrors.length).toBe(0);
  }

  expect(output.output).toEqual(styles);
}

export function TestProvider({
  css,
  ...props
}: PropsWithChildren<TailwindProviderProps & { css: string }>) {
  const { output } = extractStyles({
    theme: {},
    plugins: [plugin, nativePlugin()],
    content: [
      { raw: "", extension: "html" },
    ] as unknown as TailwindConfig["content"],
    safelist: [css],
    serializer: testStyleSerializer,
  });

  return <TailwindProvider {...output} {...props} />;
}
