import { Test } from ".";
import { normaliseSelector } from "../../../src/shared/selector";
import { Style, StyleRecord } from "../../../src/types/common";

export function expectError(names: string[]): Test[] {
  return names.map((name) => [
    name,
    { styles: {}, media: {}, shouldError: true },
  ]);
}

export function createTests<T extends string | number | undefined>(
  prefix: string,
  suffixes: Record<string, T>,
  valueFunction: (n: T, suffix: string) => Style
): Test[] {
  return Object.entries(suffixes).map(([suffix, value]) => {
    const styles: StyleRecord = {};

    // If the suffix is a decimal 0.5, the tailwind compiler will generate styles for
    // both 0.5 and 0
    //
    // This is true for all decimal numbers
    const scaleParsed = Number(suffix.toString());
    const flooredNumber = Math.floor(scaleParsed);

    if (Number.isFinite(flooredNumber) && flooredNumber !== scaleParsed) {
      styles[normaliseSelector(`${prefix}-${flooredNumber}`)] = valueFunction(
        suffixes[flooredNumber],
        flooredNumber.toString()
      );
    }

    const key = suffix ? `${prefix}-${suffix}` : prefix;

    styles[normaliseSelector(key)] = valueFunction(value, suffix);

    return [key, { styles }];
  });
}
