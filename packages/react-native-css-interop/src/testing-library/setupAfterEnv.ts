import { expect } from "@jest/globals";
import matchers from "expect/build/matchers";
import { warnings, styleMetaMap } from "../runtime/shared/globals";

// I do not know why this is needed
matchers.customTesters = [];

expect.extend({
  styleToEqual(received, style) {
    const lastCall = received.mock.calls[received.mock.calls.length - 1][0];
    return matchers.toEqual(lastCall.style, style);
  },
  styleMetaToEqual(received, expected) {
    const lastCall = received.mock.calls[received.mock.calls.length - 1][0];
    const styleMeta = styleMetaMap.get(lastCall.style);
    return matchers.toEqual(styleMeta, expected);
  },
  toHaveStyleWarnings(_received, expected) {
    return matchers.toEqual(warnings, expected);
  },
});
