import { resetStyles } from "react-native-css-interop/testing-library";
import { invalidProperty, invalidValue, style, testCases } from "../test-utils";

afterEach(() => resetStyles());

describe("Border - Border Radius", () => {
  testCases(
    [
      "rounded",
      style({
        borderBottomLeftRadius: 3.5,
        borderBottomRightRadius: 3.5,
        borderTopLeftRadius: 3.5,
        borderTopRightRadius: 3.5,
      }),
    ],
    [
      "rounded-t",
      style({
        borderTopLeftRadius: 3.5,
        borderTopRightRadius: 3.5,
      }),
    ],
    [
      "rounded-b",
      style({
        borderBottomLeftRadius: 3.5,
        borderBottomRightRadius: 3.5,
      }),
    ],
    [
      "rounded-full",
      style({
        borderBottomLeftRadius: 9999,
        borderBottomRightRadius: 9999,
        borderTopLeftRadius: 9999,
        borderTopRightRadius: 9999,
      }),
    ],
  );
});

describe("Border - Border Width", () => {
  testCases(
    [
      "border-0",
      style({
        borderTopWidth: 0,
        borderRightWidth: 0,
        borderBottomWidth: 0,
        borderLeftWidth: 0,
      }),
    ],
    ["border-x-1", style({ borderRightWidth: 0, borderLeftWidth: 0 })],
    ["border-y-1", style({ borderTopWidth: 0, borderBottomWidth: 0 })],
    ["border-t-1", style({ borderTopWidth: 0 })],
    ["border-r-1", style({ borderRightWidth: 0 })],
    ["border-b-1", style({ borderBottomWidth: 0 })],
    ["border-l-1", style({ borderLeftWidth: 0 })],
    [
      "border-1",
      style({
        borderTopWidth: 3.5,
        borderRightWidth: 3.5,
        borderBottomWidth: 3.5,
        borderLeftWidth: 3.5,
      }),
    ],
    ["border-x-1", style({ borderRightWidth: 3.5, borderLeftWidth: 3.5 })],
    ["border-y-1", style({ borderTopWidth: 3.5, borderBottomWidth: 3.5 })],
    ["border-t-1", style({ borderTopWidth: 3.5 })],
    ["border-r-1", style({ borderRightWidth: 3.5 })],
    ["border-b-1", style({ borderBottomWidth: 3.5 })],
    ["border-l-1", style({ borderLeftWidth: 3.5 })],
    [
      "border-px",
      style({
        borderTopWidth: 1,
        borderRightWidth: 1,
        borderBottomWidth: 1,
        borderLeftWidth: 1,
      }),
    ],
    ["border-x-1", style({ borderRightWidth: 1, borderLeftWidth: 1 })],
    ["border-y-1", style({ borderTopWidth: 1, borderBottomWidth: 1 })],
    ["border-t-1", style({ borderTopWidth: 1 })],
    ["border-r-1", style({ borderRightWidth: 1 })],
    ["border-b-1", style({ borderBottomWidth: 1 })],
    ["border-l-1", style({ borderLeftWidth: 1 })],
  );
});

describe("Border - Border Color", () => {
  testCases(
    [
      "border-white",
      {
        ...style({ borderColor: "rgba(255, 255, 255, 1)" }),
        meta: { variables: { "--tw-border-opacity": 1 } },
      },
    ],
    [
      "border-x-white",
      {
        ...style({
          borderLeftColor: "rgba(255, 255, 255, 1)",
          borderRightColor: "rgba(255, 255, 255, 1)",
        }),
        meta: { variables: { "--tw-border-opacity": 1 } },
      },
    ],
    [
      "border-y-white",
      {
        ...style({
          borderTopColor: "rgba(255, 255, 255, 1)",
          borderBottomColor: "rgba(255, 255, 255, 1)",
        }),
        meta: { variables: { "--tw-border-opacity": 1 } },
      },
    ],
    [
      "border-t-white",
      {
        ...style({ borderTopColor: "rgba(255, 255, 255, 1)" }),
        meta: { variables: { "--tw-border-opacity": 1 } },
      },
    ],
    [
      "border-b-white",
      {
        ...style({ borderBottomColor: "rgba(255, 255, 255, 1)" }),
        meta: { variables: { "--tw-border-opacity": 1 } },
      },
    ],
    [
      "border-l-white",
      {
        ...style({ borderLeftColor: "rgba(255, 255, 255, 1)" }),
        meta: { variables: { "--tw-border-opacity": 1 } },
      },
    ],
    [
      "border-r-white",
      {
        ...style({ borderRightColor: "rgba(255, 255, 255, 1)" }),
        meta: { variables: { "--tw-border-opacity": 1 } },
      },
    ],
    [
      "border-current",
      {
        warning: () =>
          new Map([
            [
              "border-current",
              [
                {
                  type: "IncompatibleNativeValue",
                  property: "border-top-color",
                  value: "currentcolor",
                },
                {
                  type: "IncompatibleNativeValue",
                  property: "border-bottom-color",
                  value: "currentcolor",
                },
                {
                  type: "IncompatibleNativeValue",
                  property: "border-left-color",
                  value: "currentcolor",
                },
                {
                  type: "IncompatibleNativeValue",
                  property: "border-right-color",
                  value: "currentcolor",
                },
              ],
            ],
          ]),
      },
    ],
    ["border-inherit", invalidValue("border-color", "inherit")],
    [
      "border-x-inherit",
      {
        warning: () =>
          new Map([
            [
              "border-x-inherit",
              [
                {
                  type: "IncompatibleNativeValue",
                  property: "border-left-color",
                  value: "inherit",
                },
                {
                  type: "IncompatibleNativeValue",
                  property: "border-right-color",
                  value: "inherit",
                },
              ],
            ],
          ]),
      },
    ],
    [
      "border-y-current",
      {
        warning: () =>
          new Map([
            [
              "border-y-current",
              [
                {
                  type: "IncompatibleNativeValue",
                  property: "border-top-color",
                  value: "currentcolor",
                },
                {
                  type: "IncompatibleNativeValue",
                  property: "border-bottom-color",
                  value: "currentcolor",
                },
              ],
            ],
          ]),
      },
    ],
    [
      "border-y-inherit",
      {
        warning: () =>
          new Map([
            [
              "border-y-inherit",
              [
                {
                  type: "IncompatibleNativeValue",
                  property: "border-top-color",
                  value: "inherit",
                },
                {
                  type: "IncompatibleNativeValue",
                  property: "border-bottom-color",
                  value: "inherit",
                },
              ],
            ],
          ]),
      },
    ],
    ["border-t-current", invalidValue("border-top-color", "currentcolor")],
    ["border-t-inherit", invalidValue("border-top-color", "inherit")],
    ["border-b-current", invalidValue("border-bottom-color", "currentcolor")],
    ["border-b-inherit", invalidValue("border-bottom-color", "inherit")],
    ["border-l-current", invalidValue("border-left-color", "currentcolor")],
    ["border-l-inherit", invalidValue("border-left-color", "inherit")],
    ["border-r-current", invalidValue("border-right-color", "currentcolor")],
    ["border-r-inherit", invalidValue("border-right-color", "inherit")],
  );
});

describe("Borders - Border Style", () => {
  testCases(
    ["border-solid", style({ borderStyle: "solid" })],
    ["border-dashed", style({ borderStyle: "dashed" })],
    ["border-dotted", style({ borderStyle: "dotted" })],
    ["border-none", invalidValue("border-style", '"none"')],
    ["border-double", invalidValue("border-style", '"double"')],
    ["border-hidden", invalidValue("border-style", '"hidden"')],
  );
});

describe.skip("Borders - Divide Width", () => {
  // TODO
  testCases();
});

describe.skip("Borders - Divide Color", () => {
  // TODO
  testCases();
});

describe.skip("Borders - Divide Style", () => {
  // TODO
  testCases();
});

describe.skip("Borders - Outline Width", () => {
  // TODO
  testCases();
});

describe.skip("Borders - Outline Color", () => {
  // TODO
  testCases();
});

describe.skip("Borders - Outline Style", () => {
  // TODO
  testCases();
});

describe.skip("Borders - Outline Offset", () => {
  // TODO
  testCases();
});

describe.skip("Borders - Ring Width", () => {
  // TODO
  testCases();
});

describe.skip("Borders - Ring Color", () => {
  // TODO
  testCases();
});

describe.skip("Borders - Ring Offset Width", () => {
  // TODO
  testCases();
});

describe.skip("Borders - Ring Offset Color", () => {
  // TODO
  testCases();
});