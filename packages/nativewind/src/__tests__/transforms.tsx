import { resetStyles } from "react-native-css-interop/testing-library";
import { invalidProperty, invalidValue, style, testCases } from "../test-utils";

afterEach(() => resetStyles());

describe.skip("Transforms - Scale", () => {
  // TODO
  testCases();
});

describe.skip("Transforms - Rotate", () => {
  // TODO
  testCases();
});

describe.skip("Transforms - Translate", () => {
  // TODO
  testCases();
});

describe.skip("Transforms - Skew", () => {
  // TODO
  testCases();
});

describe("Transforms - Transform Origin", () => {
  testCases(
    ["origin-center", invalidProperty("transform-origin")],
    ["origin-top", invalidProperty("transform-origin")],
    ["origin-top-right", invalidProperty("transform-origin")],
    ["origin-right", invalidProperty("transform-origin")],
    ["origin-bottom-right", invalidProperty("transform-origin")],
    ["origin-bottom", invalidProperty("transform-origin")],
    ["origin-bottom-left", invalidProperty("transform-origin")],
    ["origin-left", invalidProperty("transform-origin")],
    ["origin-top-left", invalidProperty("transform-origin")],
  );
});
