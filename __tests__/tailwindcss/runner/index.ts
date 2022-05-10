import { TailwindConfig } from "tailwindcss/tailwind-config";
import { extractStyles } from "../../../src/postcss/extract-styles";
import {
  MediaRecord,
  StyleError,
  StyleRecord,
} from "../../../src/types/common";

import plugin from "../../../src/plugin";
import { nativePlugin } from "../../../src/plugin/native";

export type Test = [string, Expected];

export { spacing } from "./spacing";
export { createTests, expectError } from "./tests";

export interface Expected {
  styles: StyleRecord;
  media?: MediaRecord;
  shouldError?: boolean;
}

export function tailwindRunner(name: string, testCases: Test[]) {
  describe(name, () => {
    test.each(testCases)("%s", assertStyles);
  });
}

export function assertStyles(
  css: string,
  { styles, media = {}, shouldError = false }: Expected
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
  });

  expect(output).toEqual({ styles, media });
  if (shouldError) {
    errors.push(...outputErrors);
    expect(errors.length).toBeGreaterThan(0);
  }
}
