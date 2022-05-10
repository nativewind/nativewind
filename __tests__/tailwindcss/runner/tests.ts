import { ColorValue } from "react-native";
import { Test } from ".";
import { normaliseSelector } from "../../../src/shared/selector";
import { MediaRecord, Style, StyleRecord } from "../../../src/types/common";

export function expectError(names: string[]): Test[] {
  return names.map((name) => [
    name,
    { styles: {}, media: {}, shouldError: true },
  ]);
}

export function createTests<T extends string | number | ColorValue | undefined>(
  prefix: string,
  suffixes: Record<string, T>,
  valueFunction: (
    n: T,
    suffix: string
  ) => Style | { style: Style; media?: string[] }
): Test[] {
  return Object.entries(suffixes).map(([suffix, value]) => {
    const styles: StyleRecord = {};
    const media: MediaRecord = {};

    // If the suffix is a decimal 0.5, the tailwind compiler will generate styles for
    // both 0.5 and 0
    //
    // This is true for all decimal numbers
    const scaleParsed = Number(suffix.toString());
    const flooredNumber = Math.floor(scaleParsed);

    if (Number.isFinite(flooredNumber) && flooredNumber !== scaleParsed) {
      const result = valueFunction(
        suffixes[flooredNumber],
        flooredNumber.toString()
      );

      const key = normaliseSelector(`${prefix}-${flooredNumber}`);

      if ("style" in result) {
        styles[`${key}.0`] = result.style;
        media[key] = result.media ?? [];
      } else {
        styles[key] = result;
      }
    }

    const key = suffix ? `${prefix}-${suffix}` : prefix;

    const result = valueFunction(value, suffix);

    if ("style" in result && "media" in result) {
      styles[`${normaliseSelector(key)}.0`] = result.style;
      media[normaliseSelector(key)] = result.media ?? [];
      return [key, { styles, media }];
    } else if ("style" in result) {
      styles[normaliseSelector(key)] = result.style;
      return [key, { styles }];
    } else {
      styles[normaliseSelector(key)] = result;
      return [key, { styles }];
    }
  });
}
