import { expect } from "@jest/globals";
import matchers from "expect/build/matchers";
import {
  warnings,
  styleMetaMap,
  globalStyles,
} from "../runtime/shared/globals";

// I do not know why this is needed
matchers.customTesters = [];

expect.extend({
  styleToEqual(received, style) {
    const lastStyle =
      received.mock.calls[received.mock.calls.length - 1][0]?.style;

    if (style === undefined) {
      return lastStyle === undefined
        ? matchers.toEqual(lastStyle, style)
        : matchers.toEqual(lastStyle, {});
    } else {
      return matchers.toEqual(lastStyle, style);
    }
  },
  styleMetaToEqual(received, expected) {
    const style = globalStyles.get(received)!;
    return matchers.toEqual(styleMetaMap.get(style), expected);
  },
  toHaveStyleWarnings(_received, expected) {
    return matchers.toEqual(warnings, expected);
  },
});
