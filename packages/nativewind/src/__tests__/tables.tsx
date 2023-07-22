import { resetStyles } from "react-native-css-interop/testing-library";
import { invalidProperty, invalidValue, style, testCases } from "../test-utils";

afterEach(() => resetStyles());

describe("Tables - Border Collapse", () => {
  testCases(
    ["border-collapse", invalidProperty("border-collapse")],
    ["border-separate", invalidProperty("border-collapse")],
  );
});

describe("Tables - Border Spacing", () => {
  testCases(
    [
      "border-spacing-0",
      {
        ...invalidProperty("border-spacing"),
        meta: {
          variables: {
            "--tw-border-spacing-x": 0,
            "--tw-border-spacing-y": 0,
          },
        },
      },
    ],
    [
      "border-spacing-x-0",
      {
        ...invalidProperty("border-spacing"),
        meta: {
          variables: { "--tw-border-spacing-x": 0 },
        },
      },
    ],
    [
      "border-spacing-y-0",
      {
        ...invalidProperty("border-spacing"),
        meta: {
          variables: { "--tw-border-spacing-y": 0 },
        },
      },
    ],
    [
      "border-spacing-px",
      {
        ...invalidProperty("border-spacing"),
        meta: {
          variables: {
            "--tw-border-spacing-x": 1,
            "--tw-border-spacing-y": 1,
          },
        },
      },
    ],
    [
      "border-spacing-x-px",
      {
        ...invalidProperty("border-spacing"),
        meta: {
          variables: { "--tw-border-spacing-x": 1 },
        },
      },
    ],
    [
      "border-spacing-y-px",
      {
        ...invalidProperty("border-spacing"),
        meta: {
          variables: { "--tw-border-spacing-y": 1 },
        },
      },
    ],
    [
      "border-spacing-1",
      {
        ...invalidProperty("border-spacing"),
        meta: {
          variables: {
            "--tw-border-spacing-x": 3.5,
            "--tw-border-spacing-y": 3.5,
          },
        },
      },
    ],
    [
      "border-spacing-x-1",
      {
        ...invalidProperty("border-spacing"),
        meta: {
          variables: { "--tw-border-spacing-x": 3.5 },
        },
      },
    ],
    [
      "border-spacing-y-1",
      {
        ...invalidProperty("border-spacing"),
        meta: {
          variables: { "--tw-border-spacing-y": 3.5 },
        },
      },
    ],
  );
});

describe("Tables - Table Layout", () => {
  testCases(
    ["table-auto", invalidProperty("table-layout")],
    ["table-fixed", invalidProperty("table-layout")],
  );
});

describe("Tables - Caption Side", () => {
  testCases(
    ["caption-top", invalidProperty("caption-side")],
    ["caption-bottom", invalidProperty("caption-side")],
  );
});
