import { extractStyles } from "../../src/babel/native-style-extraction";
import { normaliseSelector } from "../../src/shared/selector";
import { MediaRecord, Style, StyleRecord } from "../../src/types/common";

import plugin from "../../src/plugin";
import { nativePlugin } from "../../src/plugin/native";
import { TailwindConfig } from "tailwindcss/tailwind-config";

export type Test = [string, Expected];

export interface Expected {
  styles: StyleRecord;
  media?: MediaRecord;
}

export function emptyResults(names: string[]): Test[] {
  return names.map((name) => [name, { styles: {}, media: {} }]);
}

export function tailwindRunner(name: string, testCases: Test[]) {
  describe(name, () => {
    test.each(testCases)("%s", assertStyles);
  });
}

export function assertStyles(css: string, { styles, media = {} }: Expected) {
  const output = extractStyles({
    theme: {},
    plugins: [plugin, nativePlugin()],
    content: [
      { raw: "", extension: "html" },
    ] as unknown as TailwindConfig["content"],
    safelist: [css],
  });

  expect(output).toEqual({ styles, media });
}

/**
 * Given an array of scales (eg 0,px,1,2,1/3) generates a set of tests
 */
export function generateTestsForScales<T extends string | number>(
  prefix: string,
  scales: Array<T>,
  valueFunction: (n: T) => Style
): Test[] {
  return scales.map((scale) => {
    const scalesGeneratedByTailwind: T[] = [scale];

    // If the scale is 0.5, the tailwind compiler will generate styles for
    // both 0.5 and 0
    //
    // This is true for all decimal numbers
    const scaleParsed = Number(scale.toString());
    if (Number.isFinite(scaleParsed) && Math.floor(scaleParsed) !== scale) {
      scalesGeneratedByTailwind.push(Math.floor(scaleParsed) as T);
    }

    return [
      `${prefix}-${scale}`,
      {
        media: {},
        styles: Object.fromEntries(
          scalesGeneratedByTailwind.map((index) => [
            normaliseSelector(`${prefix}-${index}`),
            valueFunction(index),
          ])
        ),
      },
    ];
  });
}
