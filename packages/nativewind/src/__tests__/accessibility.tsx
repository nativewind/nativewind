import { resetStyles } from "react-native-css-interop/testing-library";
import { testCases, style } from "../test-utils";

afterEach(() => resetStyles());

describe("Accessibility - Screen Readers", () => {
  testCases(
    [
      "sr-only",
      {
        ...style({
          borderWidth: 0,
          height: 1,
          margin: -1,
          overflow: "hidden",
          padding: 0,
          position: "absolute",
          width: 1,
        }),
        warning: () =>
          new Map([
            [
              "sr-only",
              [
                {
                  property: "clip",
                  type: "IncompatibleNativeProperty",
                },
                {
                  property: "white-space",
                  type: "IncompatibleNativeProperty",
                },
              ],
            ],
          ]),
      },
    ],
    [
      "not-sr-only",
      {
        ...style({
          margin: 0,
          overflow: "visible",
          padding: 0,
        }),

        warning: () =>
          new Map([
            [
              "not-sr-only",
              [
                {
                  property: "position",
                  type: "IncompatibleNativeValue",
                  value: "static",
                },
                {
                  property: "width",
                  type: "IncompatibleNativeValue",
                  value: "auto",
                },
                {
                  property: "height",
                  type: "IncompatibleNativeValue",
                  value: "auto",
                },
                {
                  property: "clip",
                  type: "IncompatibleNativeProperty",
                },
                {
                  property: "white-space",
                  type: "IncompatibleNativeProperty",
                },
              ],
            ],
          ]),
      },
    ],
  );
});
