import { resetStyles } from "react-native-css-interop/testing-library";
import { invalidProperty, testCases } from "../test-utils";

afterEach(() => resetStyles());

describe("Filters - Blur", () => {
  testCases(["blur", invalidProperty("filter")]);
});

describe("Filters - Brightness", () => {
  testCases(["brightness-0", invalidProperty("filter")]);
});

describe("Filters - Contrast", () => {
  testCases(["contrast-0", invalidProperty("filter")]);
  testCases(["contrast-50", invalidProperty("filter")]);
  testCases(["contrast-200", invalidProperty("filter")]);
});

describe("Filters - Drop Shadow", () => {
  testCases(["drop-shadow", invalidProperty("filter")]);
});

describe("Filters - Grayscale", () => {
  testCases(
    ["grayscale", invalidProperty("filter")],
    ["grayscale-0", invalidProperty("filter")],
  );
});

describe("Filters - Hue Rotate", () => {
  testCases(
    ["hue-rotate-0", invalidProperty("filter")],
    ["hue-rotate-180", invalidProperty("filter")],
  );
});

describe("Filters - Invert", () => {
  testCases(
    ["invert-0", invalidProperty("filter")],
    ["invert", invalidProperty("filter")],
  );
});

describe("Filters - Saturate", () => {
  testCases(
    ["saturate-0", invalidProperty("filter")],
    ["saturate-100", invalidProperty("filter")],
  );
});

describe("Filters - Sepia", () => {
  testCases(["sepia", invalidProperty("filter")]);
});

describe("Filters - Backdrop Blur", () => {
  testCases(["backdrop-blur-none", invalidProperty("backdrop-filter")]);
});

describe("Filters - Backdrop Brightness", () => {
  testCases(["backdrop-brightness-0", invalidProperty("backdrop-filter")]);
});

describe("Filters - Backdrop Contrast", () => {
  testCases(["backdrop-contrast-0", invalidProperty("backdrop-filter")]);
});

describe("Filters - Backdrop Grayscale", () => {
  testCases(["backdrop-grayscale-0", invalidProperty("backdrop-filter")]);
});

describe("Filters - Backdrop Hue Rotate", () => {
  testCases(["backdrop-hue-rotate-0", invalidProperty("backdrop-filter")]);
});

describe("Filters - Backdrop Invert", () => {
  testCases(["backdrop-invert-0", invalidProperty("backdrop-filter")]);
});

describe("Filters - Backdrop Opacity", () => {
  testCases(["backdrop-opacity-0", invalidProperty("backdrop-filter")]);
});

describe("Filters - Backdrop Saturate", () => {
  testCases(["backdrop-saturate-0", invalidProperty("backdrop-filter")]);
});

describe("Filters - Backdrop Sepia", () => {
  testCases(["backdrop-sepia-0", invalidProperty("backdrop-filter")]);
});
