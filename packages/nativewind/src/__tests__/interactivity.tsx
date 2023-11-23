import { resetStyles } from "react-native-css-interop/testing-library";
import { invalidProperty, style, testCases } from "../test-utils";

afterEach(() => resetStyles());

describe("Interactivity - Accent Color", () => {
  testCases(
    ["accent-inherit", invalidProperty("accent-color")],
    ["accent-current", invalidProperty("accent-color")],
    ["accent-white", invalidProperty("accent-color")],
  );
});

describe("Interactivity - Appearance", () => {
  testCases(["appearance-none", invalidProperty("appearance")]);
});

describe("Interactivity - Cursor", () => {
  testCases(
    ["cursor-auto", invalidProperty("cursor")],
    ["cursor-default", invalidProperty("cursor")],
    ["cursor-default", invalidProperty("cursor")],
  );
});

describe("Interactivity - Caret Color", () => {
  testCases(
    // ["caret-inherit", invalidProperty("caret-color")],
    // ["caret-current", invalidProperty("caret-color")],
    ["caret-white", { props: { cursorColor: "rgba(255, 255, 255, 1)" } }],
  );
});

describe("Interactivity - Pointer Events", () => {
  testCases(
    ["pointer-events-none", style({ pointerEvents: "none" })],
    ["pointer-events-auto", style({ pointerEvents: "auto" })],
    ["pointer-events-box-none", style({ pointerEvents: "box-none" })],
    ["pointer-events-box-only", style({ pointerEvents: "box-only" })],
  );
});

describe("Interactivity - Resize", () => {
  testCases(
    ["resize-none", invalidProperty("resize")],
    ["resize-y", invalidProperty("resize")],
    ["resize-x", invalidProperty("resize")],
    ["resize", invalidProperty("resize")],
  );
});

describe("Interactivity - Scroll Behavior", () => {
  testCases(
    ["scroll-auto", invalidProperty("scroll-behavior")],
    ["scroll-smooth", invalidProperty("scroll-behavior")],
  );
});

describe("Interactivity - Scroll Margin", () => {
  testCases(
    ["scroll-m-0", invalidProperty("scroll-margin")],
    [
      "scroll-mx-0",
      invalidProperty("scroll-margin-left", "scroll-margin-right"),
    ],
    [
      "scroll-my-0",
      invalidProperty("scroll-margin-top", "scroll-margin-bottom"),
    ],
    ["scroll-mt-0", invalidProperty("scroll-margin-top")],
    ["scroll-mr-0", invalidProperty("scroll-margin-right")],
    ["scroll-mb-0", invalidProperty("scroll-margin-bottom")],
    ["scroll-ml-0", invalidProperty("scroll-margin-left")],
    ["scroll-ms-0", invalidProperty("scroll-margin-inline-start")],
    ["scroll-me-0", invalidProperty("scroll-margin-inline-end")],
    ["scroll-m-px", invalidProperty("scroll-margin")],
    [
      "scroll-mx-px",
      invalidProperty("scroll-margin-left", "scroll-margin-right"),
    ],
    [
      "scroll-my-px",
      invalidProperty("scroll-margin-top", "scroll-margin-bottom"),
    ],
    ["scroll-mt-px", invalidProperty("scroll-margin-top")],
    ["scroll-mr-px", invalidProperty("scroll-margin-right")],
    ["scroll-mb-px", invalidProperty("scroll-margin-bottom")],
    ["scroll-ml-px", invalidProperty("scroll-margin-left")],
    ["scroll-ms-px", invalidProperty("scroll-margin-inline-start")],
    ["scroll-me-px", invalidProperty("scroll-margin-inline-end")],
  );
});

describe("Interactivity - Scroll Padding", () => {
  testCases(
    ["scroll-p-0", invalidProperty("scroll-padding")],
    [
      "scroll-px-0",
      invalidProperty("scroll-padding-left", "scroll-padding-right"),
    ],
    [
      "scroll-py-0",
      invalidProperty("scroll-padding-top", "scroll-padding-bottom"),
    ],
    ["scroll-pt-0", invalidProperty("scroll-padding-top")],
    ["scroll-pr-0", invalidProperty("scroll-padding-right")],
    ["scroll-pb-0", invalidProperty("scroll-padding-bottom")],
    ["scroll-pl-0", invalidProperty("scroll-padding-left")],
    ["scroll-ps-0", invalidProperty("scroll-padding-inline-start")],
    ["scroll-pe-0", invalidProperty("scroll-padding-inline-end")],
    ["scroll-p-px", invalidProperty("scroll-padding")],
    [
      "scroll-px-px",
      invalidProperty("scroll-padding-left", "scroll-padding-right"),
    ],
    [
      "scroll-py-px",
      invalidProperty("scroll-padding-top", "scroll-padding-bottom"),
    ],
    ["scroll-pt-px", invalidProperty("scroll-padding-top")],
    ["scroll-pr-px", invalidProperty("scroll-padding-right")],
    ["scroll-pb-px", invalidProperty("scroll-padding-bottom")],
    ["scroll-pl-px", invalidProperty("scroll-padding-left")],
    ["scroll-ps-px", invalidProperty("scroll-padding-inline-start")],
    ["scroll-pe-px", invalidProperty("scroll-padding-inline-end")],
  );
});

describe("Interactivity - Scroll Snap Align", () => {
  testCases(
    ["snap-start", invalidProperty("scroll-snap-align")],
    ["snap-end", invalidProperty("scroll-snap-align")],
    ["snap-center", invalidProperty("scroll-snap-align")],
    ["snap-align-none", invalidProperty("scroll-snap-align")],
  );
});

describe("Interactivity - Scroll Snap Stop", () => {
  testCases(
    ["snap-normal", invalidProperty("scroll-snap-stop")],
    ["snap-always", invalidProperty("scroll-snap-stop")],
  );
});

describe("Interactivity - Scroll Snap Type", () => {
  testCases(
    ["snap-none", invalidProperty("scroll-snap-type")],
    ["snap-x", invalidProperty("scroll-snap-type")],
    ["snap-y", invalidProperty("scroll-snap-type")],
    ["snap-both", invalidProperty("scroll-snap-type")],
    // These properties just generate variables
    ["snap-mandatory", {}],
    ["snap-proximity", {}],
  );
});

describe("Interactivity - Touch Action", () => {
  testCases(["touch-auto", invalidProperty("touch-action")]);
  testCases(["touch-none", invalidProperty("touch-action")]);
  testCases(["touch-pan-x", invalidProperty("touch-action")]);
  testCases(["touch-pan-left", invalidProperty("touch-action")]);
  testCases(["touch-pan-right", invalidProperty("touch-action")]);
  testCases(["touch-pan-y", invalidProperty("touch-action")]);
  testCases(["touch-pan-up", invalidProperty("touch-action")]);
  testCases(["touch-pan-down", invalidProperty("touch-action")]);
  testCases(["touch-pinch-zoom", invalidProperty("touch-action")]);
  testCases(["touch-manipulation", invalidProperty("touch-action")]);
});

describe("Interactivity - User Select", () => {
  testCases(["select-none", style({ userSelect: "none" })]);
  testCases(["select-text", style({ userSelect: "text" })]);
  testCases(["select-all", style({ userSelect: "all" })]);
  testCases(["select-auto", style({ userSelect: "auto" })]);
});

describe("Interactivity - Will Change", () => {
  testCases(
    ["will-change-auto", invalidProperty("will-change")],
    ["will-change-scroll", invalidProperty("will-change")],
    ["will-change-contents", invalidProperty("will-change")],
    ["will-change-transform", invalidProperty("will-change")],
  );
});
