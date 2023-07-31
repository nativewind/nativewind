import { resetStyles } from "react-native-css-interop/testing-library";
import { testCases, style } from "../test-utils";

afterEach(() => resetStyles());

describe("Accessibility - Screen Readers", () => {
  testCases(
    [
      "sr-only",
      {
        ...style({
          borderBottomWidth: 0,
          borderLeftWidth: 0,
          borderRightWidth: 0,
          borderTopWidth: 0,
          height: 1,
          marginBottom: -1,
          marginLeft: -1,
          marginRight: -1,
          marginTop: -1,
          overflow: "hidden",
          paddingBottom: 0,
          paddingLeft: 0,
          paddingRight: 0,
          paddingTop: 0,
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
          marginBottom: 0,
          marginLeft: 0,
          marginRight: 0,
          marginTop: 0,
          overflow: "visible",
          paddingBottom: 0,
          paddingLeft: 0,
          paddingRight: 0,
          paddingTop: 0,
        }),

        warning: () =>
          new Map([
            [
              "not-sr-only",
              [
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
