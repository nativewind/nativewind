import { expect } from "@jest/globals";
import matchers from "expect/build/matchers";
import { styleMetaMap } from "../runtime/globals";

// I do not know why this is needed
matchers.customTesters = [];

expect.extend({
  toHaveStyle(received, style) {
    const receivedStyle = received?.props?.style
      ? Object.fromEntries(Object.entries(received?.props?.style))
      : undefined;
    return matchers.toEqual(receivedStyle, style);
  },
  toHaveStyleMeta(received, expected) {
    return matchers.toEqual(styleMetaMap.get(received?.props?.style), expected);
  },
});
