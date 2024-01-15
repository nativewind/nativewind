import { resetStyles } from "react-native-css-interop/testing-library";
import { invalidProperty, invalidValue, style, testCases } from "../test-utils";

afterEach(() => resetStyles());

describe("Typography - Font Family", () => {
  testCases(
    ["font-sans", style({ fontFamily: "system font" })],
    ["font-serif", style({ fontFamily: "Georgia" })],
    ["font-mono", style({ fontFamily: "Courier New" })],
  );
});

describe("Typography - Font Size", () => {
  testCases(
    ["text-xs", style({ fontSize: 10.5, lineHeight: 14 })],
    ["text-base", style({ fontSize: 14, lineHeight: 21 })],
  );
});

describe("Typography - Font Smoothing", () => {
  testCases(
    [
      "antialiased",
      {
        warning: () =>
          new Map([
            [
              "antialiased",
              [
                {
                  property: "-webkit-font-smoothing",
                  type: "IncompatibleNativeProperty",
                },
                {
                  property: "-moz-osx-font-smoothing",
                  type: "IncompatibleNativeProperty",
                },
              ],
            ],
          ]),
      },
    ],
    [
      "subpixel-antialiased",
      {
        warning: () =>
          new Map([
            [
              "subpixel-antialiased",
              [
                {
                  property: "-webkit-font-smoothing",
                  type: "IncompatibleNativeProperty",
                },
                {
                  property: "-moz-osx-font-smoothing",
                  type: "IncompatibleNativeProperty",
                },
              ],
            ],
          ]),
      },
    ],
  );
});

describe("Typography - Font Style", () => {
  testCases(
    ["italic", style({ fontStyle: "italic" })],
    ["not-italic", style({ fontStyle: "normal" })],
  );
});

describe("Typography - Font Weight", () => {
  testCases(
    ["font-thin", style({ fontWeight: "100" })],
    ["font-normal", style({ fontWeight: "400" })],
    ["font-black", style({ fontWeight: "900" })],
  );
});

describe("Typography - Font Variant Numeric", () => {
  testCases(
    ["normal-nums", invalidProperty("font-variant-numeric")],
    ["ordinal", invalidProperty("font-variant-numeric")],
    ["slashed-zero", invalidProperty("font-variant-numeric")],
    ["lining-nums", invalidProperty("font-variant-numeric")],
    ["oldstyle-nums", invalidProperty("font-variant-numeric")],
    ["proportional-nums", invalidProperty("font-variant-numeric")],
    ["tabular-nums", invalidProperty("font-variant-numeric")],
    ["diagonal-fractions", invalidProperty("font-variant-numeric")],
    ["stacked-fractions", invalidProperty("font-variant-numeric")],
  );
});

describe("Typography - Letter Spacing", () => {
  testCases(
    ["tracking-tighter", style({ letterSpacing: -0.5 })],
    ["tracking-tight", style({ letterSpacing: -0.25 })],
    ["tracking-normal", style({ letterSpacing: 0 })],
    ["tracking-wide", style({ letterSpacing: 0.25 })],
    ["tracking-wider", style({ letterSpacing: 0.5 })],
    ["tracking-widest", style({ letterSpacing: 1 })],
  );
});

describe.only("Typography - Line Clamp", () => {
  testCases(
    // [
    //   "line-clamp-1",
    //   { props: { numberOfLines: 1 }, style: { overflow: "hidden" } },
    // ],
    // [
    //   "line-clamp-2",
    //   { props: { numberOfLines: 2 }, style: { overflow: "hidden" } },
    // ],
    // [
    //   "line-clamp-3",
    //   { props: { numberOfLines: 3 }, style: { overflow: "hidden" } },
    // ],
    // [
    //   "line-clamp-4",
    //   { props: { numberOfLines: 4 }, style: { overflow: "hidden" } },
    // ],
    // [
    //   "line-clamp-5",
    //   { props: { numberOfLines: 5 }, style: { overflow: "hidden" } },
    // ],
    // [
    //   "line-clamp-6",
    //   { props: { numberOfLines: 6 }, style: { overflow: "hidden" } },
    // ],
    [
      "line-clamp-none",
      { props: { numberOfLines: 0 }, style: { overflow: "visible" } },
    ],
  );
});

describe("Typography - Line Height", () => {
  testCases(
    ["leading-3", style({ lineHeight: 10.5 })],
    ["leading-4", style({ lineHeight: 14 })],
  );
});

describe("Typography - List Style Image", () => {
  testCases(["list-image-none", invalidProperty("list-style-image")]);
});

describe("Typography - List Style Position", () => {
  testCases(
    ["list-inside", invalidProperty("list-style-position")],
    ["list-outside", invalidProperty("list-style-position")],
  );
});

describe("Typography - List Style Type", () => {
  testCases(
    ["list-none", invalidProperty("list-style-type")],
    ["list-disc", invalidProperty("list-style-type")],
    ["list-decimal", invalidProperty("list-style-type")],
  );
});

describe("Typography - Text Align", () => {
  testCases(
    ["text-left", style({ textAlign: "left" })],
    ["text-center", style({ textAlign: "center" })],
    ["text-right", style({ textAlign: "right" })],
    ["text-justify", style({ textAlign: "justify" })],
  );
});

describe("Typography - Text Color", () => {
  testCases(
    ["text-black", style({ color: "rgba(0, 0, 0, 1)" })],
    ["text-white", style({ color: "rgba(255, 255, 255, 1)" })],
    ["text-transparent", style({ color: "rgba(0, 0, 0, 0)" })],
    ["text-slate-50", style({ color: "rgba(248, 250, 252, 1)" })],
    [
      "text-white/50",
      style({ color: "rgba(255, 255, 255, 0.501960813999176)" }),
    ],
    ["text-current", invalidValue("color", "currentcolor")],
    ["text-inherit", invalidValue("color", "inherit")],
  );
});

describe("Typography - Text Decoration", () => {
  testCases(
    ["underline", style({ textDecorationLine: "underline" })],
    ["line-through", style({ textDecorationLine: "line-through" })],
    ["no-underline", style({ textDecorationLine: "none" })],
    ["overline", invalidValue("text-decoration-line", "overline")],
  );
});

describe("Typography - Text Decoration Color", () => {
  testCases(
    ["decoration-black", style({ textDecorationColor: "rgba(0, 0, 0, 1)" })],
    [
      "decoration-white",
      style({ textDecorationColor: "rgba(255, 255, 255, 1)" }),
    ],
    [
      "decoration-transparent",
      style({ textDecorationColor: "rgba(0, 0, 0, 0)" }),
    ],
    [
      "decoration-slate-50",
      style({ textDecorationColor: "rgba(248, 250, 252, 1)" }),
    ],
    [
      "decoration-current",
      invalidValue("text-decoration-color", "currentcolor"),
    ],
    ["decoration-inherit", invalidValue("text-decoration-color", "inherit")],
  );
});

describe("Typography - Text Decoration Style", () => {
  testCases(
    ["decoration-solid", style({ textDecorationStyle: "solid" })],
    ["decoration-double", style({ textDecorationStyle: "double" })],
    ["decoration-dotted", style({ textDecorationStyle: "dotted" })],
    ["decoration-dashed", style({ textDecorationStyle: "dashed" })],
    ["decoration-wavy", invalidValue("text-decoration-style", "wavy")],
  );
});

describe("Typography - Text Decoration Thickness", () => {
  testCases(
    ["decoration-auto", invalidProperty("text-decoration-thickness")],
    ["decoration-from-font", invalidProperty("text-decoration-thickness")],
    ["decoration-0", invalidProperty("text-decoration-thickness")],
    ["decoration-1", invalidProperty("text-decoration-thickness")],
  );
});

describe("Typography - Text Underline Offset", () => {
  testCases(
    ["underline-offset-auto", invalidProperty("text-underline-offset")],
    ["underline-offset-0", invalidProperty("text-underline-offset")],
  );
});

describe("Typography - Text Transform", () => {
  testCases(
    ["uppercase", style({ textTransform: "uppercase" })],
    ["lowercase", style({ textTransform: "lowercase" })],
    ["capitalize", style({ textTransform: "capitalize" })],
    ["normal-case", style({ textTransform: "none" })],
  );
});

describe("Typography - Text Overflow", () => {
  testCases(
    ["text-ellipsis", invalidProperty("text-overflow")],
    ["text-clip", invalidProperty("text-overflow")],
  );
});

describe("Typography - Text Indent", () => {
  testCases(
    ["indent-px", invalidProperty("text-indent")],
    ["indent-0", invalidProperty("text-indent")],
    ["indent-1", invalidProperty("text-indent")],
  );
});

describe("Typography - Vertical Align", () => {
  testCases(
    ["align-baseline", invalidValue("vertical-align", "baseline")],
    ["align-top", style({ verticalAlign: "top" })],
    ["align-middle", style({ verticalAlign: "middle" })],
    ["align-bottom", style({ verticalAlign: "bottom" })],
    ["align-text-top", invalidValue("vertical-align", "text-top")],
    ["align-text-bottom", invalidValue("vertical-align", "text-bottom")],
    ["align-sub", invalidValue("vertical-align", "sub")],
    ["align-super", invalidValue("vertical-align", "super")],
  );
});

describe("Typography - Whitespace", () => {
  testCases(
    ["whitespace-normal", invalidProperty("white-space")],
    ["whitespace-nowrap", invalidProperty("white-space")],
    ["whitespace-pre", invalidProperty("white-space")],
    ["whitespace-pre-line", invalidProperty("white-space")],
    ["whitespace-pre-wrap", invalidProperty("white-space")],
  );
});

describe("Typography - Word Break", () => {
  testCases(
    [
      "break-normal",
      {
        warning: () =>
          new Map([
            [
              "break-normal",
              [
                {
                  property: "overflow-wrap",
                  type: "IncompatibleNativeProperty",
                },
                { property: "word-break", type: "IncompatibleNativeProperty" },
              ],
            ],
          ]),
      },
    ],
    ["break-words", invalidProperty("overflow-wrap")],
    ["break-all", invalidProperty("word-break")],
  );
});

describe("Typography - Hyphens", () => {
  testCases(
    ["hyphens-none", invalidProperty("hyphens")],
    ["hyphens-manual", invalidProperty("hyphens")],
    ["hyphens-auto", invalidProperty("hyphens")],
  );
});

describe("Typography - Content", () => {
  testCases(["content-none", invalidProperty("content")]);
});
