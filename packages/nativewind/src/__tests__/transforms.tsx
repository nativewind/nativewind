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
          { translateX: 0 },
          { translateY: 0 },
          { rotate: "0" },
          { skewX: "0" },
          { skewY: "0" },
          { scaleX: 0 },
          { scaleY: 0 },
        ],
      }),
    ],
    [
      "scale-x-0",
      style({
        transform: [
          { translateX: 0 },
          { translateY: 0 },
          { rotate: "0" },
          { skewX: "0" },
          { skewY: "0" },
          { scaleX: 0 },
          { scaleY: 1 },
        ],
      }),
    ],
    [
      "scale-y-0",
      style({
        transform: [
          { translateX: 0 },
          { translateY: 0 },
          { rotate: "0" },
          { skewX: "0" },
          { skewY: "0" },
          { scaleX: 1 },
          { scaleY: 0 },
        ],
      }),
    ],
    [
      "scale-50",

      style({
        transform: [
          { translateX: 0 },
          { translateY: 0 },
          { rotate: "0" },
          { skewX: "0" },
          { skewY: "0" },
          { scaleX: 0.5 },
          { scaleY: 0.5 },
        ],
      }),
    ],
    [
      "scale-x-50",
      style({
        transform: [
          { translateX: 0 },
          { translateY: 0 },
          { rotate: "0" },
          { skewX: "0" },
          { skewY: "0" },
          { scaleX: 0.5 },
          { scaleY: 1 },
        ],
      }),
    ],
    [
      "scale-y-50",

      style({
        transform: [
          { translateX: 0 },
          { translateY: 0 },
          { rotate: "0" },
          { skewX: "0" },
          { skewY: "0" },
          { scaleX: 1 },
          { scaleY: 0.5 },
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
          { translateX: 0 },
          { translateY: 0 },
          { rotate: "0deg" },
          { skewX: "0" },
          { skewY: "0" },
          { scaleX: 1 },
          { scaleY: 1 },
        ],
      }),
    ],
    [
      "rotate-180",

      style({
        transform: [
          { translateX: 0 },
          { translateY: 0 },
          { rotate: "180deg" },
          { skewX: "0" },
          { skewY: "0" },
          { scaleX: 1 },
          { scaleY: 1 },
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
          { translateX: 0 },
          { translateY: 0 },
          { rotate: "0" },
          { skewX: "0" },
          { skewY: "0" },
          { scaleX: 1 },
          { scaleY: 1 },
        ],
      }),
    ],
    [
      "translate-y-0",

      style({
        transform: [
          { translateX: 0 },
          { translateY: 0 },
          { rotate: "0" },
          { skewX: "0" },
          { skewY: "0" },
          { scaleX: 1 },
          { scaleY: 1 },
        ],
      }),
    ],
    [
      "translate-x-px",

      style({
        transform: [
          { translateX: 1 },
          { translateY: 0 },
          { rotate: "0" },
          { skewX: "0" },
          { skewY: "0" },
          { scaleX: 1 },
          { scaleY: 1 },
        ],
      }),
    ],
    [
      "translate-y-px",
      style({
        transform: [
          { translateX: 0 },
          { translateY: 1 },
          { rotate: "0" },
          { skewX: "0" },
          { skewY: "0" },
          { scaleX: 1 },
          { scaleY: 1 },
        ],
      }),
    ],
    [
      "translate-x-1",
      style({
        transform: [
          { translateX: 3.5 },
          { translateY: 0 },
          { rotate: "0" },
          { skewX: "0" },
          { skewY: "0" },
          { scaleX: 1 },
          { scaleY: 1 },
        ],
      }),
    ],
    [
      "translate-y-1",
      style({
        transform: [
          { translateX: 0 },
          { translateY: 3.5 },
          { rotate: "0" },
          { skewX: "0" },
          { skewY: "0" },
          { scaleX: 1 },
          { scaleY: 1 },
        ],
      }),
    ],
  );
});

describe.skip("Transforms - Translate (%)", () => {
  // TODO - These require the tailwind plugin
  testCasesWithOptions(
    {
      css: "@tailwind base;@tailwind components;@tailwind utilities;",
    },
    [
      "translate-x-1/2",
      style({
        transform: [
          { translateX: 0 },
          { translateY: 0 },
          { rotate: "0" },
          { skewX: "0" },
          { skewY: "0" },
          { scaleX: 1 },
          { scaleY: 1 },
        ],
      }),
    ],
    [
      "translate-y-1/2",

      style({
        transform: [
          { translateX: 0 },
          { translateY: 3.5 },
          { rotate: "0" },
          { skewX: "0" },
          { skewY: "0" },
          { scaleX: 1 },
          { scaleY: 1 },
        ],
      }),
    ],
    [
      "translate-x-full",

      style({
        transform: [
          { translateX: 3.5 },
          { translateY: 0 },
          { rotate: "0" },
          { skewX: "0" },
          { skewY: "0" },
          { scaleX: 1 },
          { scaleY: 1 },
        ],
      }),
    ],
    [
      "translate-y-full",

      style({
        transform: [
          { translateX: 0 },
          { translateY: 3.5 },
          { rotate: "0" },
          { skewX: "0" },
          { skewY: "0" },
          { scaleX: 1 },
          { scaleY: 1 },
        ],
      }),
    ],
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
          { translateX: 0 },
          { translateY: 0 },
          { rotate: "0" },
          { skewX: "0deg" },
          { skewY: "0" },
          { scaleX: 1 },
          { scaleY: 1 },
        ],
      }),
    ],
    [
      "skew-y-0",

      style({
        transform: [
          { translateX: 0 },
          { translateY: 0 },
          { rotate: "0" },
          { skewX: "0" },
          { skewY: "0deg" },
          { scaleX: 1 },
          { scaleY: 1 },
        ],
      }),
    ],
    [
      "skew-x-1",

      style({
        transform: [
          { translateX: 0 },
          { translateY: 0 },
          { rotate: "0" },
          { skewX: "1deg" },
          { skewY: "0" },
          { scaleX: 1 },
          { scaleY: 1 },
        ],
      }),
    ],
    [
      "skew-y-1",

      style({
        transform: [
          { translateX: 0 },
          { translateY: 0 },
          { rotate: "0" },
          { skewX: "0" },
          { skewY: "1deg" },
          { scaleX: 1 },
          { scaleY: 1 },
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
          { translateX: 3.5 },
          { translateY: 0 },
          { rotate: "90deg" },
          { skewX: "0" },
          { skewY: "1deg" },
          { scaleX: 1 },
          { scaleY: 1 },
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
