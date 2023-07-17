import { Dimensions } from "react-native";

import { resetStyles } from "react-native-css-interop/testing-library";
import { invalidProperty, invalidValue, style, testCases } from "../test-utils";

afterEach(() => resetStyles());

describe("Layout - Align Content", () => {
  testCases([
    ["content-center", style({ alignContent: "center" })],
    ["content-start", style({ alignContent: "flex-start" })],
    ["content-end", style({ alignContent: "flex-end" })],
    ["content-between", style({ alignContent: "space-between" })],
    ["content-around", style({ alignContent: "space-around" })],
    ["content-evenly", invalidValue("align-content", "space-evenly")],
  ]);
});

describe("Layout - Align Items", () => {
  testCases([
    ["items-center", style({ alignItems: "center" })],
    ["items-start", style({ alignItems: "flex-start" })],
    ["items-end", style({ alignItems: "flex-end" })],
    ["items-baseline", style({ alignItems: "baseline" })],
    ["items-stretch", style({ alignItems: "stretch" })],
  ]);
});

describe("Layout - Align Self", () => {
  testCases([
    ["self-auto", style({ alignSelf: "auto" })],
    ["self-start", style({ alignSelf: "flex-start" })],
    ["self-end", style({ alignSelf: "flex-end" })],
    ["self-center", style({ alignSelf: "center" })],
    ["self-stretch", style({ alignSelf: "stretch" })],
    ["self-baseline", style({ alignSelf: "baseline" })],
  ]);
});

describe("Layout - Clear", () => {
  testCases([
    ["clear-right", invalidProperty("clear")],
    ["clear-left", invalidProperty("clear")],
    ["clear-both", invalidProperty("clear")],
    ["clear-none", invalidProperty("clear")],
  ]);
});

describe("Layout - Columns", () => {
  testCases([
    ["columns-1", invalidProperty("columns")],
    ["columns-2", invalidProperty("columns")],
  ]);
});

describe("Interactivity - Accent Color", () => {
  testCases([
    ["accent-inherit", invalidProperty("accent-color")],
    ["accent-current", invalidProperty("accent-color")],
    ["accent-white", invalidProperty("accent-color")],
  ]);
});

describe("Interactivity - Caret Color", () => {
  testCases([
    ["caret-inherit", invalidProperty("caret-color")],
    ["caret-current", invalidProperty("caret-color")],
    ["caret-white", invalidProperty("caret-color")],
  ]);
});

describe("Interactivity - Cursor", () => {
  testCases([
    ["cursor-auto", invalidProperty("cursor")],
    ["cursor-default", invalidProperty("cursor")],
    ["cursor-default", invalidProperty("cursor")],
  ]);
});

describe("Interactivity - Pointer Events", () => {
  testCases([
    ["pointer-events-none", invalidProperty("pointer-events")],
    ["pointer-events-auto", invalidProperty("pointer-events")],
  ]);
});

describe("Interactivity - Resize", () => {
  testCases([
    ["resize-none", invalidProperty("resize")],
    ["resize-y", invalidProperty("resize")],
    ["resize-x", invalidProperty("resize")],
    ["resize", invalidProperty("resize")],
  ]);
});

describe("Interactivity - Scroll Behavior", () => {
  testCases([
    ["scroll-auto", invalidProperty("scroll-behavior")],
    ["scroll-smooth", invalidProperty("scroll-behavior")],
  ]);
});

describe("Interactivity - Scroll Margin", () => {
  testCases([
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
  ]);
});

describe("Interactivity - Scroll Padding", () => {
  testCases([
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
  ]);
});

describe("Interactivity - Scroll Snap Align", () => {
  testCases([
    ["snap-start", invalidProperty("scroll-snap-align")],
    ["snap-end", invalidProperty("scroll-snap-align")],
    ["snap-center", invalidProperty("scroll-snap-align")],
    ["snap-align-none", invalidProperty("scroll-snap-align")],
  ]);
});

describe("Interactivity - Scroll Snap Stop", () => {
  testCases([
    ["snap-normal", invalidProperty("scroll-snap-stop")],
    ["snap-always", invalidProperty("scroll-snap-stop")],
  ]);
});

describe("Interactivity - Scroll Snap Type", () => {
  testCases([
    ["snap-none", invalidProperty("scroll-snap-type")],
    ["snap-x", invalidProperty("scroll-snap-type")],
    ["snap-y", invalidProperty("scroll-snap-type")],
    ["snap-both", invalidProperty("scroll-snap-type")],
    ["snap-mandatory", style({})],
    ["snap-proximity", style({})],
  ]);
});

describe("Interactivity - Appearance", () => {
  testCases([["appearance-none", invalidProperty("appearance")]]);
});

describe("Interactivity - Touch Action", () => {
  testCases([["touch-auto", invalidProperty("touch-action")]]);
  testCases([["touch-none", invalidProperty("touch-action")]]);
  testCases([["touch-pan-x", invalidProperty("touch-action")]]);
  testCases([["touch-pan-left", invalidProperty("touch-action")]]);
  testCases([["touch-pan-right", invalidProperty("touch-action")]]);
  testCases([["touch-pan-y", invalidProperty("touch-action")]]);
  testCases([["touch-pan-up", invalidProperty("touch-action")]]);
  testCases([["touch-pan-down", invalidProperty("touch-action")]]);
  testCases([["touch-pinch-zoom", invalidProperty("touch-action")]]);
  testCases([["touch-manipulation", invalidProperty("touch-action")]]);
});

describe("Interactivity - User Select", () => {
  testCases([["select-none", invalidProperty("user-select")]]);
  testCases([["select-text", invalidProperty("user-select")]]);
  testCases([["select-all", invalidProperty("user-select")]]);
  testCases([["select-auto", invalidProperty("user-select")]]);
});

describe("Interactivity - Will Change", () => {
  testCases([
    ["will-change-auto", invalidProperty("will-change")],
    ["will-change-scroll", invalidProperty("will-change")],
    ["will-change-contents", invalidProperty("will-change")],
    ["will-change-transform", invalidProperty("will-change")],
  ]);
});

describe("Layout - Aspect Ratio", () => {
  testCases([
    ["aspect-square", style({ aspectRatio: 1 })],
    ["aspect-video", style({ aspectRatio: "16 / 9" })],
    ["aspect-[4/3]", style({ aspectRatio: "4 / 3" })],
  ]);
});

describe("Layout - Flex", () => {
  testCases([
    ["flex", style({ display: "flex" })],
    ["flex-1", style({ flexBasis: "0%", flexGrow: 1, flexShrink: 1 })],
    [
      "flex-auto",
      {
        ...style({ flexGrow: 1, flexShrink: 1 }),
        ...invalidValue("flex", "auto"),
      },
    ],
    [
      "flex-initial",
      {
        ...style({ flexGrow: 0, flexShrink: 1 }),
        ...invalidValue("flex", "auto"),
      },
    ],
    [
      "flex-none",
      {
        ...style({ flexGrow: 0, flexShrink: 0 }),
        ...invalidValue("flex", "auto"),
      },
    ],
  ]);
});

describe("Layout - Flex Basis", () => {
  testCases([
    ["basis-auto", invalidValue("flex-basis", "auto")],
    ["basis-0", style({ flexBasis: 0 })],
    ["basis-1", style({ flexBasis: 3.5 })],
    ["basis-px", style({ flexBasis: 1 })],
    ["basis-full", style({ flexBasis: "100%" })],
    ["basis-1/2", style({ flexBasis: "50%" })],
  ]);
});

describe("Layout - Flex Direction", () => {
  testCases([
    ["flex-row", style({ flexDirection: "row" })],
    ["flex-col", style({ flexDirection: "column" })],
    ["flex-row-reverse", style({ flexDirection: "row-reverse" })],
    ["flex-col-reverse", style({ flexDirection: "column-reverse" })],
  ]);
});

describe("Layout - Flex Grow", () => {
  testCases([
    ["grow", style({ flexGrow: 1 })],
    ["grow-0", style({ flexGrow: 0 })],
    ["grow-[2]", style({ flexGrow: 2 })],
  ]);
});

describe("Layout - Flex Shrink", () => {
  testCases([
    ["shrink", style({ flexShrink: 1 })],
    ["shrink-0", style({ flexShrink: 0 })],
  ]);
});

describe("Layout - Flex Wrap", () => {
  testCases([
    ["flex-wrap", style({ flexWrap: "wrap" })],
    ["flex-nowrap", style({ flexWrap: "nowrap" })],
    ["flex-wrap-reverse", style({ flexWrap: "wrap-reverse" })],
  ]);
});

describe("Layout - Float", () => {
  testCases([["float-right", invalidProperty("float")]]);
  testCases([["float-left", invalidProperty("float")]]);
  testCases([["float-none", invalidProperty("float")]]);
});

describe("Layout - Margin", () => {
  testCases([
    [
      "m-0",
      style({ marginLeft: 0, marginTop: 0, marginRight: 0, marginBottom: 0 }),
    ],
    ["mx-0", style({ marginLeft: 0, marginRight: 0 })],
    ["my-0", style({ marginTop: 0, marginBottom: 0 })],
    ["mt-0", style({ marginTop: 0 })],
    ["mr-0", style({ marginRight: 0 })],
    ["mb-0", style({ marginBottom: 0 })],
    ["ml-0", style({ marginLeft: 0 })],
    ["ms-0", style({ marginStart: 0 })],
    ["me-0", style({ marginEnd: 0 })],
  ]);
});

describe("Layout - Padding", () => {
  testCases([
    [
      "p-0",
      style({
        paddingLeft: 0,
        paddingTop: 0,
        paddingRight: 0,
        paddingBottom: 0,
      }),
    ],
    ["px-0", style({ paddingLeft: 0, paddingRight: 0 })],
    ["py-0", style({ paddingTop: 0, paddingBottom: 0 })],
    ["pt-0", style({ paddingTop: 0 })],
    ["pr-0", style({ paddingRight: 0 })],
    ["pb-0", style({ paddingBottom: 0 })],
    ["pl-0", style({ paddingLeft: 0 })],
    ["ps-0", style({ paddingStart: 0 })],
    ["pe-0", style({ paddingEnd: 0 })],
  ]);
});

describe("Filters - Backdrop Blur", () => {
  testCases([["backdrop-blur-none", invalidProperty("backdrop-filter")]]);
});

describe("Filters - Backdrop Brightness", () => {
  testCases([["backdrop-brightness-0", invalidProperty("backdrop-filter")]]);
});

describe("Filters - Backdrop Contrast", () => {
  testCases([["backdrop-contrast-0", invalidProperty("backdrop-filter")]]);
});

describe("Filters - Backdrop Grayscale", () => {
  testCases([["backdrop-grayscale-0", invalidProperty("backdrop-filter")]]);
});

describe("Filters - Backdrop Hue Rotate", () => {
  testCases([["backdrop-hue-rotate-0", invalidProperty("backdrop-filter")]]);
});

describe("Filters - Backdrop Invert", () => {
  testCases([["backdrop-invert-0", invalidProperty("backdrop-filter")]]);
});

describe("Filters - Backdrop Opacity", () => {
  testCases([["backdrop-opacity-0", invalidProperty("backdrop-filter")]]);
});

describe("Filters - Backdrop Saturate", () => {
  testCases([["backdrop-saturate-0", invalidProperty("backdrop-filter")]]);
});

describe("Filters - Backdrop Saturate", () => {
  testCases([["backdrop-sepia-0", invalidProperty("backdrop-filter")]]);
});

describe("Filters - Blur", () => {
  testCases([["blur", invalidProperty("filter")]]);
});

describe("Filters - Brightness", () => {
  testCases([["brightness-0", invalidProperty("filter")]]);
});

describe("Filters - Drop Shadow", () => {
  testCases([["drop-shadow", invalidProperty("filter")]]);
});

describe("Filters - Grayscale", () => {
  testCases([
    ["grayscale", invalidProperty("filter")],
    ["grayscale-0", invalidProperty("filter")],
  ]);
});

describe("Filters - Hue Rotate", () => {
  testCases([
    ["hue-rotate-0", invalidProperty("filter")],
    ["hue-rotate-180", invalidProperty("filter")],
  ]);
});

describe("Filters - Invert", () => {
  testCases([
    ["invert-0", invalidProperty("filter")],
    ["invert", invalidProperty("filter")],
  ]);
});

describe("Filters - Saturate", () => {
  testCases([
    ["saturate-0", invalidProperty("filter")],
    ["saturate-100", invalidProperty("filter")],
  ]);
});

describe("Filters - Sepia", () => {
  testCases([["sepia", invalidProperty("filter")]]);
});

describe("Backgrounds - Background Attachment", () => {
  testCases([
    ["bg-fixed", invalidProperty("background-attachment")],
    ["bg-local", invalidProperty("background-attachment")],
    ["bg-scroll", invalidProperty("background-attachment")],
  ]);
});

describe("Effects - Background Blend Mode", () => {
  testCases([
    ["bg-blend-normal", invalidProperty("background-blend-mode")],
    ["bg-blend-multiply", invalidProperty("background-blend-mode")],
    ["bg-blend-screen", invalidProperty("background-blend-mode")],
    ["bg-blend-overlay", invalidProperty("background-blend-mode")],
    ["bg-blend-darken", invalidProperty("background-blend-mode")],
    ["bg-blend-lighten", invalidProperty("background-blend-mode")],
    ["bg-blend-color-dodge", invalidProperty("background-blend-mode")],
    ["bg-blend-color-burn", invalidProperty("background-blend-mode")],
    ["bg-blend-hard-light", invalidProperty("background-blend-mode")],
    ["bg-blend-soft-light", invalidProperty("background-blend-mode")],
    ["bg-blend-difference", invalidProperty("background-blend-mode")],
    ["bg-blend-exclusion", invalidProperty("background-blend-mode")],
    ["bg-blend-hue", invalidProperty("background-blend-mode")],
    ["bg-blend-saturation", invalidProperty("background-blend-mode")],
    ["bg-blend-color", invalidProperty("background-blend-mode")],
    ["bg-blend-luminosity", invalidProperty("background-blend-mode")],
  ]);
});

describe("Backgrounds - Background Clip", () => {
  testCases([
    ["bg-clip-border", invalidProperty("background-clip")],
    ["bg-clip-padding", invalidProperty("background-clip")],
    ["bg-clip-content", invalidProperty("background-clip")],
    ["bg-clip-text", invalidProperty("background-clip")],
  ]);
});

describe("Typography - Content", () => {
  testCases([["content-none", invalidProperty("content")]]);
});

// Needs the plugin to override the `em`
describe.skip("Typography - Letter Spacing", () => {
  testCases([
    ["tracking-tighter", style({ letterSpacing: -0.5 })],
    ["tracking-tight", style({ letterSpacing: -0.25 })],
    ["tracking-normal", style({ letterSpacing: 0 })],
    ["tracking-wide", style({ letterSpacing: 0.25 })],
    ["tracking-wider", style({ letterSpacing: 0.5 })],
    ["tracking-widest", style({ letterSpacing: 1 })],
  ]);
});

describe("Typography - Line Height", () => {
  testCases([
    ["leading-3", style({ lineHeight: 10.5 })],
    ["leading-4", style({ lineHeight: 14 })],
  ]);
});

describe("Typography - List Style Position", () => {
  testCases([
    ["list-inside", invalidProperty("list-style-position")],
    ["list-outside", invalidProperty("list-style-position")],
  ]);
});

describe("Typography - List Style Type", () => {
  testCases([
    ["list-none", invalidProperty("list-style-type")],
    ["list-disc", invalidProperty("list-style-type")],
    ["list-decimal", invalidProperty("list-style-type")],
  ]);
});

describe("Typography - Font Size", () => {
  testCases([
    ["text-xs", style({ fontSize: 10.5, lineHeight: 14 })],
    ["text-base", style({ fontSize: 14, lineHeight: 21 })],
  ]);
});

describe("Typography - Text Align", () => {
  testCases([
    ["text-left", style({ textAlign: "left" })],
    ["text-center", style({ textAlign: "center" })],
    ["text-right", style({ textAlign: "right" })],
    ["text-justify", style({ textAlign: "justify" })],
  ]);
});

describe("Typography - Text Color", () => {
  testCases([
    [
      "text-black",
      {
        style: { color: "rgba(0, 0, 0, 1)" },
        meta: { variables: { "--tw-text-opacity": 1 } },
      },
    ],
    [
      "text-white",
      {
        style: { color: "rgba(255, 255, 255, 1)" },
        meta: { variables: { "--tw-text-opacity": 1 } },
      },
    ],
    [
      "text-transparent",
      {
        style: { color: "rgba(0, 0, 0, 0)" },
      },
    ],
    [
      "text-slate-50",
      {
        style: { color: "rgba(248, 250, 252, 1)" },
        meta: { variables: { "--tw-text-opacity": 1 } },
      },
    ],
    [
      "text-white/50",
      {
        style: { color: "rgba(255, 255, 255, 0.501960813999176)" },
      },
    ],
    ["text-current", invalidValue("color", "currentcolor")],
    ["text-inherit", invalidValue("color", "inherit")],
  ]);
});

describe("Typography - Text Decoration Color", () => {
  testCases([
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
  ]);
});

describe("Typography - Text Decoration Style", () => {
  testCases([
    ["decoration-solid", style({ textDecorationStyle: "solid" })],
    ["decoration-double", style({ textDecorationStyle: "double" })],
    ["decoration-dotted", style({ textDecorationStyle: "dotted" })],
    ["decoration-dashed", style({ textDecorationStyle: "dashed" })],
    ["decoration-wavy", invalidValue("text-decoration-style", "wavy")],
  ]);
});

describe("Typography - Font Smoothing", () => {
  testCases([
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
                  type: "IncompatibleNativeValue",
                  value: "antialiased",
                },
                {
                  property: "-moz-osx-font-smoothing",
                  type: "IncompatibleNativeValue",
                  value: "grayscale",
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
                  type: "IncompatibleNativeValue",
                  value: "auto",
                },
                {
                  property: "-moz-osx-font-smoothing",
                  type: "IncompatibleNativeValue",
                  value: "auto",
                },
              ],
            ],
          ]),
      },
    ],
  ]);
});

describe("Typography - Font Style", () => {
  testCases([
    ["italic", style({ fontStyle: "italic" })],
    ["not-italic", style({ fontStyle: "normal" })],
  ]);
});

describe("Typography - Font Weight", () => {
  testCases([
    ["font-thin", style({ fontWeight: "100" })],
    ["font-normal", style({ fontWeight: "400" })],
    ["font-black", style({ fontWeight: "900" })],
  ]);
});

describe("Flexbox & Grid - Gap", () => {
  testCases([
    ["gap-0", style({ columnGap: 0, rowGap: 0 })],
    ["gap-1", style({ columnGap: 3.5, rowGap: 3.5 })],
    ["gap-px", style({ columnGap: 1, rowGap: 1 })],
  ]);
});

describe("Flexbox & Grid - Grid Column Start / End", () => {
  testCases([
    ["col-auto", invalidProperty("grid-column")],
    ["col-span-1", invalidProperty("grid-column")],
    ["col-span-full", invalidProperty("grid-column")],
    ["col-start-1", invalidProperty("grid-column-start")],
    ["col-start-auto", invalidProperty("grid-column-start")],
    ["col-end-1", invalidProperty("grid-column-end")],
    ["col-end-auto", invalidProperty("grid-column-end")],
  ]);
});

describe("Flexbox & Grid - Grid Row Start / End", () => {
  testCases([
    ["row-auto", invalidProperty("grid-row")],
    ["row-span-1", invalidProperty("grid-row")],
    ["row-span-full", invalidProperty("grid-row")],
    ["row-start-1", invalidProperty("grid-row-start")],
    ["row-start-auto", invalidProperty("grid-row-start")],
    ["row-end-1", invalidProperty("grid-row-end")],
    ["row-end-auto", invalidProperty("grid-row-end")],
  ]);
});

describe("Flexbox & Grid - Grid Template Columns", () => {
  testCases([
    ["grid-cols-1", invalidProperty("grid-template-columns")],
    ["grid-cols-2", invalidProperty("grid-template-columns")],
    ["grid-cols-none", invalidProperty("grid-template-columns")],
    [
      "grid-cols-[200px_minmax(900px,_1fr)_100px]",
      invalidProperty("grid-template-columns"),
    ],
  ]);
});

describe("Flexbox & Grid - Grid Template Rows", () => {
  testCases([
    ["grid-rows-1", invalidProperty("grid-template-rows")],
    ["grid-rows-2", invalidProperty("grid-template-rows")],
    ["grid-rows-none", invalidProperty("grid-template-rows")],
    [
      "grid-rows-[200px_minmax(900px,_1fr)_100px]",
      invalidProperty("grid-template-rows"),
    ],
  ]);
});

describe("Typography - Background Color", () => {
  testCases([
    ["bg-current", invalidValue("background-color", "currentcolor")],
    ["bg-transparent", style({ backgroundColor: "rgba(0, 0, 0, 0)" })],
    [
      "bg-white",
      {
        style: { backgroundColor: "rgba(255, 255, 255, 1)" },
        meta: { variables: { "--tw-bg-opacity": 1 } },
      },
    ],
  ]);
});

describe("Typography - Text Decoration Style", () => {
  testCases([
    ["decoration-solid", style({ textDecorationStyle: "solid" })],
    ["decoration-double", style({ textDecorationStyle: "double" })],
    ["decoration-dotted", style({ textDecorationStyle: "dotted" })],
    ["decoration-dashed", style({ textDecorationStyle: "dashed" })],
    ["decoration-wavy", invalidValue("text-decoration-style", "wavy")],
  ]);
});

describe("Typography - Text Decoration Thickness", () => {
  testCases([
    ["decoration-auto", invalidProperty("text-decoration-thickness")],
  ]);
});

describe("Typography - Text Decoration", () => {
  testCases([
    ["underline", style({ textDecorationLine: "underline" })],
    ["line-through", style({ textDecorationLine: "line-through" })],
    ["no-underline", style({ textDecorationLine: "none" })],
    ["overline", invalidValue("text-decoration-line", "overline")],
  ]);
});

describe("Typography - Text Indent", () => {
  testCases([
    ["indent-px", invalidProperty("text-indent")],
    ["indent-0", invalidProperty("text-indent")],
    ["indent-1", invalidProperty("text-indent")],
  ]);
});

describe("Typography - Text Transform", () => {
  testCases([
    ["uppercase", style({ textTransform: "uppercase" })],
    ["lowercase", style({ textTransform: "lowercase" })],
    ["capitalize", style({ textTransform: "capitalize" })],
    ["normal-case", style({ textTransform: "none" })],
  ]);
});

describe("Typography - Text Overflow", () => {
  testCases([
    ["text-ellipsis", invalidProperty("text-overflow")],
    ["text-clip", invalidProperty("text-overflow")],
  ]);
});

describe("Typography - Text Underline Offset", () => {
  testCases([
    ["underline-offset-auto", invalidProperty("text-underline-offset")],
    ["underline-offset-0", invalidProperty("text-underline-offset")],
  ]);
});

describe("Typography - Vertical Alignment", () => {
  testCases([
    ["align-baseline", invalidValue("vertical-align", "baseline")],
    ["align-top", style({ verticalAlign: "top" })],
    ["align-middle", style({ verticalAlign: "middle" })],
    ["align-bottom", style({ verticalAlign: "bottom" })],
    ["align-text-top", invalidValue("vertical-align", "text-top")],
    ["align-text-bottom", invalidValue("vertical-align", "text-bottom")],
    ["align-sub", invalidValue("vertical-align", "sub")],
    ["align-super", invalidValue("vertical-align", "super")],
  ]);
});

describe("Typography - Whitespace", () => {
  testCases([
    ["whitespace-normal", invalidProperty("white-space")],
    ["whitespace-nowrap", invalidProperty("white-space")],
    ["whitespace-pre", invalidProperty("white-space")],
    ["whitespace-pre-line", invalidProperty("white-space")],
    ["whitespace-pre-wrap", invalidProperty("white-space")],
  ]);
});

describe("Typography - Word Break", () => {
  testCases([
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
  ]);
});

describe.skip("Backgrounds - Gradient Color Stops", () => {
  testCases([
    // ["from-inherit", invalidProperty("background-image")],
    // ["from-current", invalidProperty("background-image")],
    // ["from-transparent", invalidProperty("background-image")],
    // ["from-white", invalidProperty("background-image")],
    // ["via-inherit", invalidProperty("background-image")],
    // ["via-current", invalidProperty("background-image")],
    // ["via-transparent", invalidProperty("background-image")],
    // ["via-white", invalidProperty("background-image")],
    // ["to-inherit", invalidProperty("background-image")],
    // ["to-current", invalidProperty("background-image")],
    // ["to-transparent", invalidProperty("background-image")],
    // ["to-white", invalidProperty("background-image")],
  ]);
});

describe("Backgrounds - Gradient Color Stops", () => {
  testCases([
    ["bg-none", invalidProperty("background-image")],
    ["bg-gradient-to-t", invalidProperty("background-image")],
  ]);
});

describe("Backgrounds - Background Origin", () => {
  testCases([
    ["bg-origin-border", invalidProperty("background-origin")],
    ["bg-origin-padding", invalidProperty("background-origin")],
    ["bg-origin-content", invalidProperty("background-origin")],
  ]);
});

describe("Backgrounds - Background Position", () => {
  testCases([["bg-bottom", invalidProperty("background-position")]]);
});

describe("Backgrounds - Background Repeat", () => {
  testCases([["bg-repeat", invalidProperty("background-repeat")]]);
});

describe("Backgrounds - Background Size", () => {
  testCases([
    ["bg-auto", invalidProperty("background-size")],
    ["bg-cover", invalidProperty("background-size")],
    ["bg-contain", invalidProperty("background-size")],
  ]);
});

describe("Tables - Border Collapse", () => {
  testCases([
    ["border-collapse", invalidProperty("border-collapse")],
    ["border-separate", invalidProperty("border-collapse")],
  ]);
});
describe("Tables - Table Layout", () => {
  testCases([
    ["table-auto", invalidProperty("table-layout")],
    ["table-fixed", invalidProperty("table-layout")],
  ]);
});

describe("Border - Border Color", () => {
  testCases([
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
  ]);
});

describe("Border - Border Radius", () => {
  testCases([
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
  ]);
});

describe("Tables - Border Style", () => {
  testCases([
    ["border-solid", style({ borderStyle: "solid" })],
    ["border-dashed", style({ borderStyle: "dashed" })],
    ["border-dotted", style({ borderStyle: "dotted" })],
    ["border-none", invalidValue("border-style", '"none"')],
    ["border-double", invalidValue("border-style", '"double"')],
    ["border-hidden", invalidValue("border-style", '"hidden"')],
  ]);
});

describe("Sizing - Height", () => {
  testCases([
    ["h-0", style({ height: 0 })],
    ["h-px", style({ height: 1 })],
    ["h-1", style({ height: 3.5 })],
    ["h-1/2", style({ height: "50%" })],
    ["h-full", style({ height: "100%" })],
    ["h-auto", style({ height: "auto" })],
    ["h-min", invalidValue("height", "min-content")],
    ["h-max", invalidValue("height", "max-content")],
    ["h-fit", invalidValue("height", "fit-content")],
    [
      "h-screen",
      { ...style({ height: Dimensions.get("window").height }), meta: {} },
    ],
  ]);
});

describe("Layout - Box Decoration Break", () => {
  testCases([
    ["box-decoration-clone", invalidProperty("box-decoration-break")],
    ["box-decoration-slice", invalidProperty("box-decoration-break")],
  ]);
});

describe("Layout - Box Sizing", () => {
  testCases([
    ["box-border", invalidProperty("box-sizing")],
    ["box-content", invalidProperty("box-sizing")],
  ]);
});

describe("Layout - Break After", () => {
  testCases([
    ["break-after-auto", invalidProperty("break-after")],
    ["break-after-avoid", invalidProperty("break-after")],
    ["break-after-all", invalidProperty("break-after")],
    ["break-after-avoid-page", invalidProperty("break-after")],
    ["break-after-page", invalidProperty("break-after")],
    ["break-after-left", invalidProperty("break-after")],
    ["break-after-right", invalidProperty("break-after")],
    ["break-after-column", invalidProperty("break-after")],
  ]);
});

describe("Layout - Break Before", () => {
  testCases([
    ["break-before-auto", invalidProperty("break-before")],
    ["break-before-avoid", invalidProperty("break-before")],
    ["break-before-all", invalidProperty("break-before")],
    ["break-before-avoid-page", invalidProperty("break-before")],
    ["break-before-page", invalidProperty("break-before")],
    ["break-before-left", invalidProperty("break-before")],
    ["break-before-right", invalidProperty("break-before")],
    ["break-before-column", invalidProperty("break-before")],
  ]);
});

describe("Layout - Break Inside", () => {
  testCases([
    ["break-inside-auto", invalidProperty("break-inside")],
    ["break-inside-avoid", invalidProperty("break-inside")],
    ["break-inside-avoid-page", invalidProperty("break-inside")],
    ["break-inside-avoid-column", invalidProperty("break-inside")],
  ]);
});

describe("Layout - Isolation", () => {
  testCases([
    ["isolate", invalidProperty("isolation")],
    ["isolation-auto", invalidProperty("isolation")],
  ]);
});

describe("Layout - Grid Auto Flow", () => {
  testCases([
    ["grid-flow-row", invalidProperty("grid-auto-flow")],
    ["grid-flow-col", invalidProperty("grid-auto-flow")],
    ["grid-flow-row-dense", invalidProperty("grid-auto-flow")],
    ["grid-flow-col-dense", invalidProperty("grid-auto-flow")],
  ]);
});

describe("Layout - Grid Auto Columns", () => {
  testCases([
    ["auto-cols-auto", invalidProperty("grid-auto-columns")],
    ["auto-cols-min", invalidProperty("grid-auto-columns")],
    ["auto-cols-max", invalidProperty("grid-auto-columns")],
    ["auto-cols-fr", invalidProperty("grid-auto-columns")],
  ]);
});

describe("Layout - Grid Auto Rows", () => {
  testCases([
    ["auto-rows-auto", invalidProperty("grid-auto-rows")],
    ["auto-rows-min", invalidProperty("grid-auto-rows")],
    ["auto-rows-max", invalidProperty("grid-auto-rows")],
    ["auto-rows-fr", invalidProperty("grid-auto-rows")],
  ]);
});

describe("Layout - Justify Content", () => {
  testCases([
    ["justify-start", style({ justifyContent: "flex-start" })],
    ["justify-end", style({ justifyContent: "flex-end" })],
    ["justify-center", style({ justifyContent: "center" })],
    ["justify-between", style({ justifyContent: "space-between" })],
    ["justify-around", style({ justifyContent: "space-around" })],
    ["justify-evenly", style({ justifyContent: "space-evenly" })],
  ]);
});

describe("Layout - Justify Items", () => {
  testCases([
    ["justify-items-start", invalidProperty("justify-items")],
    ["justify-items-end", invalidProperty("justify-items")],
    ["justify-items-center", invalidProperty("justify-items")],
    ["justify-items-stretch", invalidProperty("justify-items")],
  ]);
});

describe("Layout - Justify Self", () => {
  testCases([
    ["justify-self-auto", invalidProperty("justify-self")],
    ["justify-self-start", invalidProperty("justify-self")],
    ["justify-self-end", invalidProperty("justify-self")],
    ["justify-self-center", invalidProperty("justify-self")],
    ["justify-self-stretch", invalidProperty("justify-self")],
  ]);
});

describe("Layout - Visibility", () => {
  testCases([
    ["visible", invalidProperty("visibility")],
    ["invisible", invalidProperty("visibility")],
  ]);
});

describe("Layout - Z-Index", () => {
  testCases([
    ["z-auto", invalidValue("z-index", "auto")],
    ["z-0", style({ zIndex: 0 })],
  ]);
});
