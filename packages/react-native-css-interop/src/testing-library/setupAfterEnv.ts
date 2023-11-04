import { expect } from "@jest/globals";
import matchers from "expect/build/matchers";
import { styleMetaMap } from "../runtime/globals";

// I do not know why this is needed
matchers.customTesters = [];

expect.extend({
  toHaveStyle(received, style) {
    return matchers.toEqual(received?.props?.style, style);
  },
  toHaveStyleMeta(received, expected) {
    return matchers.toEqual(styleMetaMap.get(received?.props?.style), expected);
  },
});
