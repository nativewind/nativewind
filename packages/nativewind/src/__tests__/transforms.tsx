import { resetStyles } from "react-native-css-interop/testing-library";
import {
  invalidProperty,
  style,
  testCases,
  testCasesWithOptions,
} from "../test-utils";

afterEach(() => resetStyles());

describe("Transforms - Scale", () => {
  testCasesWithOptions(
    {
      css: "@tailwind base;@tailwind components;@tailwind utilities;",
    },
    [
      "scale-0",
      style({
        transform: [
          { rotate: "0deg" },
          { scaleX: 0 },
          { scaleY: 0 },
          { translateX: 0 },
          { translateY: 0 },
          { skewX: "0deg" },
          { skewY: "0deg" },
        ],
      }),
    ],
    [
      "scale-x-0",
      style({
        transform: [
          { rotate: "0deg" },
          { scaleX: 0 },
          { scaleY: 1 },
          { translateX: 0 },
          { translateY: 0 },
          { skewX: "0deg" },
          { skewY: "0deg" },
        ],
      }),
    ],
    [
      "scale-y-0",
      style({
        transform: [
          { rotate: "0deg" },
          { scaleX: 1 },
          { scaleY: 0 },
          { translateX: 0 },
          { translateY: 0 },
          { skewX: "0deg" },
          { skewY: "0deg" },
        ],
      }),
    ],
    [
      "scale-50",

      style({
        transform: [
          { rotate: "0deg" },
          { scaleX: 0.5 },
          { scaleY: 0.5 },
          { translateX: 0 },
          { translateY: 0 },
          { skewX: "0deg" },
          { skewY: "0deg" },
        ],
      }),
    ],
    [
      "scale-x-50",
      style({
        transform: [
          { rotate: "0deg" },
          { scaleX: 0.5 },
          { scaleY: 1 },
          { translateX: 0 },
          { translateY: 0 },
          { skewX: "0deg" },
          { skewY: "0deg" },
        ],
      }),
    ],
    [
      "scale-y-50",
      style({
        transform: [
          { rotate: "0deg" },
          { scaleX: 1 },
          { scaleY: 0.5 },
          { translateX: 0 },
          { translateY: 0 },
          { skewX: "0deg" },
          { skewY: "0deg" },
        ],
      }),
    ],
  );
});

describe("Transforms - Rotate", () => {
  testCasesWithOptions(
    {
      css: "@tailwind base;@tailwind components;@tailwind utilities;",
    },
    [
      "rotate-0",
      style({
        transform: [
          { rotate: "0deg" },
          { scaleX: 1 },
          { scaleY: 1 },
          { translateX: 0 },
          { translateY: 0 },
          { skewX: "0deg" },
          { skewY: "0deg" },
        ],
      }),
    ],
    [
      "rotate-180",

      style({
        transform: [
          { rotate: "180deg" },
          { scaleX: 1 },
          { scaleY: 1 },
          { translateX: 0 },
          { translateY: 0 },
          { skewX: "0deg" },
          { skewY: "0deg" },
        ],
      }),
    ],
  );
});

describe("Transforms - Translate", () => {
  testCasesWithOptions(
    {
      css: "@tailwind base;@tailwind components;@tailwind utilities;",
    },
    [
      "translate-x-0",
      style({
        transform: [
          { rotate: "0deg" },
          { scaleX: 1 },
          { scaleY: 1 },
          { translateX: 0 },
          { translateY: 0 },
          { skewX: "0deg" },
          { skewY: "0deg" },
        ],
      }),
    ],
    [
      "translate-y-0",
      style({
        transform: [
          { rotate: "0deg" },
          { scaleX: 1 },
          { scaleY: 1 },
          { translateX: 0 },
          { translateY: 0 },
          { skewX: "0deg" },
          { skewY: "0deg" },
        ],
      }),
    ],
    [
      "translate-x-px",
      style({
        transform: [
          { rotate: "0deg" },
          { scaleX: 1 },
          { scaleY: 1 },
          { translateX: 1 },
          { translateY: 0 },
          { skewX: "0deg" },
          { skewY: "0deg" },
        ],
      }),
    ],
    [
      "translate-y-px",
      style({
        transform: [
          { rotate: "0deg" },
          { scaleX: 1 },
          { scaleY: 1 },
          { translateX: 0 },
          { translateY: 1 },
          { skewX: "0deg" },
          { skewY: "0deg" },
        ],
      }),
    ],
    [
      "translate-x-1",
      style({
        transform: [
          { rotate: "0deg" },
          { scaleX: 1 },
          { scaleY: 1 },
          { translateX: 3.5 },
          { translateY: 0 },
          { skewX: "0deg" },
          { skewY: "0deg" },
        ],
      }),
    ],
    [
      "translate-y-1",
      style({
        transform: [
          { rotate: "0deg" },
          { scaleX: 1 },
          { scaleY: 1 },
          { translateX: 0 },
          { translateY: 3.5 },
          { skewX: "0deg" },
          { skewY: "0deg" },
        ],
      }),
    ],
  );
});

describe.skip("Transforms - Translate (%)", () => {
  testCasesWithOptions(
    {
      base: true,
    },
    [
      "w-2 translate-x-1/2",
      style({
        width: 7,
        transform: [
          { translateX: 3.5 },
          { translateY: 0 },
          { rotate: "0deg" },
          { skewX: "0deg" },
          { skewY: "0deg" },
          { scaleX: 1 },
          { scaleY: 1 },
        ],
      }),
    ],
    // [
    //   "translate-y-1/2",
    //   style({
    //     transform: [
    //       { translateX: 0 },
    //       { translateY: 3.5 },
    //       { rotate: "0" },
    //       { skewX: "0" },
    //       { skewY: "0" },
    //       { scaleX: 1 },
    //       { scaleY: 1 },
    //     ],
    //   }),
    // ],
    // [
    //   "translate-x-full",

    //   style({
    //     transform: [
    //       { translateX: 3.5 },
    //       { translateY: 0 },
    //       { rotate: "0" },
    //       { skewX: "0" },
    //       { skewY: "0" },
    //       { scaleX: 1 },
    //       { scaleY: 1 },
    //     ],
    //   }),
    // ],
    // [
    //   "translate-y-full",

    //   style({
    //     transform: [
    //       { translateX: 0 },
    //       { translateY: 3.5 },
    //       { rotate: "0" },
    //       { skewX: "0" },
    //       { skewY: "0" },
    //       { scaleX: 1 },
    //       { scaleY: 1 },
    //     ],
    //   }),
    // ],
  );
});

describe("Transforms - Skew", () => {
  testCasesWithOptions(
    {
      css: "@tailwind base;@tailwind components;@tailwind utilities;",
    },
    [
      "skew-x-0",

      style({
        transform: [
          { rotate: "0deg" },
          { scaleX: 1 },
          { scaleY: 1 },
          { translateX: 0 },
          { translateY: 0 },
          { skewX: "0deg" },
          { skewY: "0deg" },
        ],
      }),
    ],
    [
      "skew-y-0",

      style({
        transform: [
          { rotate: "0deg" },
          { scaleX: 1 },
          { scaleY: 1 },
          { translateX: 0 },
          { translateY: 0 },
          { skewX: "0deg" },
          { skewY: "0deg" },
        ],
      }),
    ],
    [
      "skew-x-1",

      style({
        transform: [
          { rotate: "0deg" },
          { scaleX: 1 },
          { scaleY: 1 },
          { translateX: 0 },
          { translateY: 0 },
          { skewX: "1deg" },
          { skewY: "0deg" },
        ],
      }),
    ],
    [
      "skew-y-1",

      style({
        transform: [
          { rotate: "0deg" },
          { scaleX: 1 },
          { scaleY: 1 },
          { translateX: 0 },
          { translateY: 0 },
          { skewX: "0deg" },
          { skewY: "1deg" },
        ],
      }),
    ],
  );
});

describe("Transforms - Mixed", () => {
  testCasesWithOptions(
    {
      css: "@tailwind base;@tailwind components;@tailwind utilities;",
    },
    [
      "rotate-90 skew-y-1 translate-x-1",

      style({
        transform: [
          { rotate: "90deg" },
          { scaleX: 1 },
          { scaleY: 1 },
          { translateX: 3.5 },
          { translateY: 0 },
          { skewX: "0deg" },
          { skewY: "1deg" },
        ],
      }),
    ],
  );
});

describe("Transforms - Transform Origin", () => {
  testCases(
    ["origin-center", invalidProperty("transform-origin")],
    ["origin-top", invalidProperty("transform-origin")],
    ["origin-top-right", invalidProperty("transform-origin")],
    ["origin-right", invalidProperty("transform-origin")],
    ["origin-bottom-right", invalidProperty("transform-origin")],
    ["origin-bottom", invalidProperty("transform-origin")],
    ["origin-bottom-left", invalidProperty("transform-origin")],
    ["origin-left", invalidProperty("transform-origin")],
    ["origin-top-left", invalidProperty("transform-origin")],
  );
});
