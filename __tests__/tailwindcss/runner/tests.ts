import { ColorValue } from "react-native";
import { Test } from ".";
import { normalizeCssSelector } from "../../../src/shared/selector";
import { AtRuleRecord, Style, StyleRecord } from "../../../src/types/common";

export function expectError(names: string[]): Test[] {
  return names.map((name) => [name, {}, true]);
}

export function createTests<T extends string | number | ColorValue | undefined>(
  prefix: string,
  suffixes: Record<string, T>,
  valueFunction: (
    n: T,
    suffix: string
  ) => Style | AtRuleRecord | Array<Style | AtRuleRecord>
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
      const key = `${prefix}-${flooredNumber}`;
      const result = valueFunction(
        suffixes[flooredNumber],
        flooredNumber.toString()
      );

      styles[normalizeCssSelector(key)] = Array.isArray(result)
        ? result
        : [result];
    }

    const key = suffix ? `${prefix}-${suffix}` : prefix;

    const result = valueFunction(value, suffix);

    styles[normalizeCssSelector(key)] = Array.isArray(result)
      ? result
      : [result];

    return [key, styles];
  });
}
