import { expect } from "@jest/globals";
import matchers from "expect/build/matchers";

// I do not know why this is needed
matchers.customTesters = [];

expect.extend({
  styleToEqual(received, style) {
    const lastCall = received.mock.calls[received.mock.calls.length - 1][0];
    return matchers.toEqual(lastCall.style, style);
  },
});
