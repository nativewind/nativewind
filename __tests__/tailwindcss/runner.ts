import { MediaRecord, StyleRecord } from "../../src/babel/types";
import { getNativeTailwindConfig } from "../../src/babel/tailwind/native-config";
import { extractStyles } from "../../src/babel/native-style-extraction";
import { normaliseSelector } from "../../src/shared/selector";

const nativeConfig = getNativeTailwindConfig();

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

export function assertStyles(
  css: string,
  { styles: expectedStyles, media: expectedMedia }: Expected
) {
  const { styles, media } = extractStyles({
    theme: {},
    ...nativeConfig,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    content: [{ raw: "", extension: "html" } as any],
    safelist: [css],
  });

  expect(styles).toEqual(expectedStyles);

  if (expectedMedia) {
    expect(media).toEqual(expectedMedia);
  }
}

/**
 * Given an array of scales (eg 0,px,1,2,1/3) generates a set of tests
 */
export function generateTestsForScales<T extends string | number>(
  prefix: string,
  scales: Array<T>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  valueFunction: (n: T) => any
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
