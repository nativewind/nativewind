import { resetStyles } from "react-native-css-interop/testing-library";
import { invalidProperty, invalidValue, style, testCases } from "../test-utils";

afterEach(() => resetStyles());

describe("Backgrounds - Background Attachment", () => {
  testCases(
    ["bg-fixed", invalidProperty("background-attachment")],
    // ["bg-local", invalidProperty("background-attachment")],
    // ["bg-scroll", invalidProperty("background-attachment")],
  );
});

describe("Backgrounds - Background Clip", () => {
  testCases(
    ["bg-clip-border", invalidProperty("background-clip")],
    ["bg-clip-padding", invalidProperty("background-clip")],
    ["bg-clip-content", invalidProperty("background-clip")],
    ["bg-clip-text", invalidProperty("background-clip")],
  );
});

describe("Backgrounds - Background Color", () => {
  testCases(
    ["bg-current", invalidValue("background-color", "currentcolor")],
    ["bg-transparent", style({ backgroundColor: "rgba(0, 0, 0, 0)" })],
    [
      "bg-white",
      {
        style: { backgroundColor: "rgba(255, 255, 255, 1)" },
      },
    ],
  );
});

describe("Backgrounds - Background Origin", () => {
  testCases(
    ["bg-origin-border", invalidProperty("background-origin")],
    ["bg-origin-padding", invalidProperty("background-origin")],
    ["bg-origin-content", invalidProperty("background-origin")],
  );
});

describe("Backgrounds - Background Position", () => {
  testCases(
    ["bg-bottom", invalidProperty("background-position")],
    ["bg-center", invalidProperty("background-position")],
    ["bg-left", invalidProperty("background-position")],
    ["bg-left-bottom", invalidProperty("background-position")],
    ["bg-left-top", invalidProperty("background-position")],
    ["bg-right", invalidProperty("background-position")],
    ["bg-right-bottom", invalidProperty("background-position")],
    ["bg-right-top", invalidProperty("background-position")],
    ["bg-top", invalidProperty("background-position")],
  );
});

describe("Backgrounds - Background Repeat", () => {
  testCases(["bg-repeat", invalidProperty("background-repeat")]);
});

describe("Backgrounds - Background Size", () => {
  testCases(
    ["bg-auto", invalidProperty("background-size")],
    ["bg-cover", invalidProperty("background-size")],
    ["bg-contain", invalidProperty("background-size")],
  );
});

describe("Backgrounds - Background Image", () => {
  testCases(
    ["bg-none", invalidProperty("background-image")],
    ["bg-gradient-to-t", invalidProperty("background-image")],
    ["bg-gradient-to-tr", invalidProperty("background-image")],
    ["bg-gradient-to-r", invalidProperty("background-image")],
    ["bg-gradient-to-br", invalidProperty("background-image")],
    ["bg-gradient-to-b", invalidProperty("background-image")],
    ["bg-gradient-to-bl", invalidProperty("background-image")],
    ["bg-gradient-to-l", invalidProperty("background-image")],
    ["bg-gradient-to-tl", invalidProperty("background-image")],
  );
});

describe.skip("Backgrounds - Gradient Color Stops", () => {
  // TODO
  testCases();
});
