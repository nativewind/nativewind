import { resetStyles } from "react-native-css-interop/testing-library";
import { invalidProperty, invalidValue, style, testCases } from "../test-utils";

afterEach(() => resetStyles());

describe("Layout - Aspect Ratio", () => {
  testCases(
    ["aspect-square", style({ aspectRatio: 1 })],
    // ["aspect-video", style({ aspectRatio: "16 / 9" })],
    // ["aspect-[4/3]", style({ aspectRatio: "4 / 3" })],
  );
});

describe("Layout - Container", () => {
  testCases([
    "container",
    style({
      maxWidth: 640,
      width: "100%",
    }),
  ]);
});

describe("Layout - Columns", () => {
  testCases(
    ["columns-1", invalidProperty("columns")],
    ["columns-2", invalidProperty("columns")],
  );
});

describe("Layout - Break After", () => {
  testCases(
    ["break-after-auto", invalidProperty("break-after")],
    ["break-after-avoid", invalidProperty("break-after")],
    ["break-after-all", invalidProperty("break-after")],
    ["break-after-avoid-page", invalidProperty("break-after")],
    ["break-after-page", invalidProperty("break-after")],
    ["break-after-left", invalidProperty("break-after")],
    ["break-after-right", invalidProperty("break-after")],
    ["break-after-column", invalidProperty("break-after")],
  );
});

describe("Layout - Break Before", () => {
  testCases(
    ["break-before-auto", invalidProperty("break-before")],
    ["break-before-avoid", invalidProperty("break-before")],
    ["break-before-all", invalidProperty("break-before")],
    ["break-before-avoid-page", invalidProperty("break-before")],
    ["break-before-page", invalidProperty("break-before")],
    ["break-before-left", invalidProperty("break-before")],
    ["break-before-right", invalidProperty("break-before")],
    ["break-before-column", invalidProperty("break-before")],
  );
});

describe("Layout - Break Inside", () => {
  testCases(
    ["break-inside-auto", invalidProperty("break-inside")],
    ["break-inside-avoid", invalidProperty("break-inside")],
    ["break-inside-avoid-page", invalidProperty("break-inside")],
    ["break-inside-avoid-column", invalidProperty("break-inside")],
  );
});

describe("Layout - Box Decoration Break", () => {
  testCases(
    ["box-decoration-clone", invalidProperty("box-decoration-break")],
    ["box-decoration-slice", invalidProperty("box-decoration-break")],
  );
});

describe("Layout - Box Sizing", () => {
  testCases(
    ["box-border", invalidProperty("box-sizing")],
    ["box-content", invalidProperty("box-sizing")],
  );
});

describe("Layout - Display", () => {
  testCases(
    ["flex", style({ display: "flex" })],
    ["hidden", style({ display: "none" })],
    ["block", invalidValue("display", "block")],
    ["inline-block", invalidValue("display", "inline-block")],
    ["inline", invalidValue("display", "inline")],
    ["inline-flex", invalidValue("display", "inline-flex")],
    ["table", invalidValue("display", "table")],
    ["inline-table", invalidValue("display", "inline-table")],
    ["table-caption", invalidValue("display", "table-caption")],
    ["table-cell", invalidValue("display", "table-cell")],
    ["table-column", invalidValue("display", "table-column")],
    ["table-column-group", invalidValue("display", "table-column-group")],
    ["table-footer-group", invalidValue("display", "table-footer-group")],
    ["table-header-group", invalidValue("display", "table-header-group")],
    ["table-row-group", invalidValue("display", "table-row-group")],
    ["table-row", invalidValue("display", "table-row")],
    ["flow-root", invalidValue("display", "flow-root")],
    ["grid", invalidValue("display", "grid")],
    ["inline-grid", invalidValue("display", "inline-grid")],
    ["contents", invalidValue("display", "contents")],
    ["list-item", invalidValue("display", "list-item")],
  );
});

describe("Layout - Floats", () => {
  testCases(["float-right", invalidProperty("float")]);
  testCases(["float-left", invalidProperty("float")]);
  testCases(["float-none", invalidProperty("float")]);
});

describe("Layout - Clear", () => {
  testCases(
    ["clear-right", invalidProperty("clear")],
    ["clear-left", invalidProperty("clear")],
    ["clear-both", invalidProperty("clear")],
    ["clear-none", invalidProperty("clear")],
  );
});

describe("Layout - Isolation", () => {
  testCases(
    ["isolate", invalidProperty("isolation")],
    ["isolation-auto", invalidProperty("isolation")],
  );
});

describe("Layout - Object Fit", () => {
  testCases(
    ["object-contain", invalidProperty("object-fit")],
    ["object-cover", invalidProperty("object-fit")],
    ["object-fill", invalidProperty("object-fit")],
    ["object-none", invalidProperty("object-fit")],
    ["object-scale-down", invalidProperty("object-fit")],
  );
});

describe("Layout - Object Position", () => {
  testCases(
    ["object-bottom", invalidProperty("object-position")],
    ["object-center", invalidProperty("object-position")],
    ["object-left", invalidProperty("object-position")],
    ["object-left-bottom", invalidProperty("object-position")],
    ["object-left-top", invalidProperty("object-position")],
    ["object-right", invalidProperty("object-position")],
    ["object-right-bottom", invalidProperty("object-position")],
    ["object-right-top", invalidProperty("object-position")],
    ["object-top", invalidProperty("object-position")],
  );
});

describe("Layout - Overflow", () => {
  testCases(
    ["overflow-auto", invalidValue("overflow", "auto")],
    ["overflow-clip", invalidValue("overflow", "clip")],
    ["overflow-scroll", invalidValue("overflow", "scroll")],
    ["overflow-x-auto", invalidProperty("overflow-x")],
    ["overflow-y-auto", invalidProperty("overflow-y")],
    ["overflow-x-hidden", invalidProperty("overflow-x")],
    ["overflow-y-hidden", invalidProperty("overflow-y")],
    ["overflow-x-clip", invalidProperty("overflow-x")],
    ["overflow-y-clip", invalidProperty("overflow-y")],
    ["overflow-x-visible", invalidProperty("overflow-x")],
    ["overflow-y-visible", invalidProperty("overflow-y")],
    ["overflow-x-scroll", invalidProperty("overflow-x")],
    ["overflow-y-scroll", invalidProperty("overflow-y")],
    ["overflow-hidden", style({ overflow: "hidden" })],
    ["overflow-visible", style({ overflow: "visible" })],
  );
});

describe("Layout - Overscroll Behavior", () => {
  testCases(
    ["overscroll-auto", invalidProperty("overscroll-behavior")],
    ["overscroll-contain", invalidProperty("overscroll-behavior")],
    ["overscroll-none", invalidProperty("overscroll-behavior")],
    ["overscroll-y-auto", invalidProperty("overscroll-behavior-y")],
    ["overscroll-y-contain", invalidProperty("overscroll-behavior-y")],
    ["overscroll-y-none", invalidProperty("overscroll-behavior-y")],
    ["overscroll-x-auto", invalidProperty("overscroll-behavior-x")],
    ["overscroll-x-contain", invalidProperty("overscroll-behavior-x")],
    ["overscroll-x-none", invalidProperty("overscroll-behavior-x")],
  );
});

describe("Layout - Position", () => {
  testCases(
    ["absolute", style({ position: "absolute" })],
    ["relative", style({ position: "relative" })],
    ["static", invalidValue("position", "static")],
    ["fixed", invalidValue("position", "fixed")],
    ["sticky", invalidValue("position", "sticky")],
  );
});

describe("Layout - Top Right Bottom Left", () => {
  testCases(
    ["top-0", style({ top: 0 })],
    ["top-px", style({ top: 1 })],
    ["top-1", style({ top: 3.5 })],
    ["top-1/2", style({ top: "50%" })],
    ["top-full", style({ top: "100%" })],
    ["top-[10px]", style({ top: 10 })],
    ["bottom-0", style({ bottom: 0 })],
    ["bottom-px", style({ bottom: 1 })],
    ["bottom-1", style({ bottom: 3.5 })],
    ["bottom-1/2", style({ bottom: "50%" })],
    ["bottom-full", style({ bottom: "100%" })],
    ["bottom-[10px]", style({ bottom: 10 })],
    ["left-0", style({ left: 0 })],
    ["left-px", style({ left: 1 })],
    ["left-1", style({ left: 3.5 })],
    ["left-1/2", style({ left: "50%" })],
    ["left-full", style({ left: "100%" })],
    ["left-[10px]", style({ left: 10 })],
    ["right-0", style({ right: 0 })],
    ["right-px", style({ right: 1 })],
    ["right-1", style({ right: 3.5 })],
    ["right-1/2", style({ right: "50%" })],
    ["right-full", style({ right: "100%" })],
    ["right-[10px]", style({ right: 10 })],
    [
      "inset-auto",
      {
        warning: () =>
          new Map([
            [
              "inset-auto",
              [
                {
                  type: "IncompatibleNativeValue",
                  property: "top",
                  value: "auto",
                },
                {
                  type: "IncompatibleNativeValue",
                  property: "bottom",
                  value: "auto",
                },
                {
                  type: "IncompatibleNativeValue",
                  property: "left",
                  value: "auto",
                },
                {
                  type: "IncompatibleNativeValue",
                  property: "right",
                  value: "auto",
                },
              ],
            ],
          ]),
      },
    ],
    [
      "inset-x-auto",
      {
        warning: () =>
          new Map([
            [
              "inset-x-auto",
              [
                {
                  type: "IncompatibleNativeValue",
                  property: "left",
                  value: "auto",
                },
                {
                  type: "IncompatibleNativeValue",
                  property: "right",
                  value: "auto",
                },
              ],
            ],
          ]),
      },
    ],
    [
      "inset-y-auto",
      {
        warning: () =>
          new Map([
            [
              "inset-y-auto",
              [
                {
                  type: "IncompatibleNativeValue",
                  property: "top",
                  value: "auto",
                },
                {
                  type: "IncompatibleNativeValue",
                  property: "bottom",
                  value: "auto",
                },
              ],
            ],
          ]),
      },
    ],
    ["top-auto", invalidValue("top", "auto")],
    ["right-auto", invalidValue("right", "auto")],
    ["bottom-auto", invalidValue("bottom", "auto")],
    ["left-auto", invalidValue("left", "auto")],
  );
});

describe("Layout - Visibility", () => {
  testCases(
    ["visible", style({ opacity: 1 })],
    ["invisible", style({ opacity: 0 })],
  );
});

describe("Layout - Z-Index", () => {
  testCases(
    ["z-auto", invalidValue("z-index", "auto")],
    ["z-0", style({ zIndex: 0 })],
  );
});
