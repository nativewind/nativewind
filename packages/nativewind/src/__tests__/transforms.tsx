import { resetStyles } from "react-native-css-interop/testing-library";
import { invalidProperty, invalidValue, style, testCases } from "../test-utils";

afterEach(() => resetStyles());

describe("Transforms - Scale", () => {
  testCases(
    [
      "scale-0",
      {
        style: {
          transform: [
            { translateX: 0 },
            { translateY: 0 },
            { rotate: "0deg" },
            { skewX: "0deg" },
            { skewY: "0deg" },
            { scaleX: 0 },
            { scaleY: 0 },
          ],
        },
        meta: {
          variables: {
            "--tw-scale-x": 0,
            "--tw-scale-y": 0,
          },
        },
      },
    ],
    [
      "scale-x-0",
      {
        style: {
          transform: [
            { translateX: 0 },
            { translateY: 0 },
            { rotate: "0deg" },
            { skewX: "0deg" },
            { skewY: "0deg" },
            { scaleX: 0 },
            { scaleY: 1 },
          ],
        },
        meta: {
          variables: {
            "--tw-scale-x": 0,
          },
        },
      },
    ],
    [
      "scale-y-0",
      {
        style: {
          transform: [
            { translateX: 0 },
            { translateY: 0 },
            { rotate: "0deg" },
            { skewX: "0deg" },
            { skewY: "0deg" },
            { scaleX: 1 },
            { scaleY: 0 },
          ],
        },
        meta: {
          variables: {
            "--tw-scale-y": 0,
          },
        },
      },
    ],
    [
      "scale-50",
      {
        style: {
          transform: [
            { translateX: 0 },
            { translateY: 0 },
            { rotate: "0deg" },
            { skewX: "0deg" },
            { skewY: "0deg" },
            { scaleX: 0.5 },
            { scaleY: 0.5 },
          ],
        },
        meta: {
          variables: {
            "--tw-scale-x": 0.5,
            "--tw-scale-y": 0.5,
          },
        },
      },
    ],
    [
      "scale-x-50",
      {
        style: {
          transform: [
            { translateX: 0 },
            { translateY: 0 },
            { rotate: "0deg" },
            { skewX: "0deg" },
            { skewY: "0deg" },
            { scaleX: 0.5 },
            { scaleY: 1 },
          ],
        },
        meta: {
          variables: {
            "--tw-scale-x": 0.5,
          },
        },
      },
    ],
    [
      "scale-y-50",
      {
        style: {
          transform: [
            { translateX: 0 },
            { translateY: 0 },
            { rotate: "0deg" },
            { skewX: "0deg" },
            { skewY: "0deg" },
            { scaleX: 1 },
            { scaleY: 0.5 },
          ],
        },
        meta: {
          variables: {
            "--tw-scale-y": 0.5,
          },
        },
      },
    ],
  );
});

describe("Transforms - Rotate", () => {
  testCases(
    [
      "rotate-0",
      {
        style: {
          transform: [
            { translateX: 0 },
            { translateY: 0 },
            { rotate: "0deg" },
            { skewX: "0deg" },
            { skewY: "0deg" },
            { scaleX: 1 },
            { scaleY: 1 },
          ],
        },
        meta: {
          variables: {
            "--tw-rotate": "0deg",
          },
        },
      },
    ],
    [
      "rotate-180",
      {
        style: {
          transform: [
            { translateX: 0 },
            { translateY: 0 },
            { rotate: "180deg" },
            { skewX: "0deg" },
            { skewY: "0deg" },
            { scaleX: 1 },
            { scaleY: 1 },
          ],
        },
        meta: {
          variables: {
            "--tw-rotate": "180deg",
          },
        },
      },
    ],
  );
});

describe("Transforms - Translate", () => {
  testCases(
    [
      "translate-x-0",
      {
        style: {
          transform: [
            { translateX: 0 },
            { translateY: 0 },
            { rotate: "0deg" },
            { skewX: "0deg" },
            { skewY: "0deg" },
            { scaleX: 1 },
            { scaleY: 1 },
          ],
        },
        meta: {
          variables: {
            "--tw-translate-x": 0,
          },
        },
      },
    ],
    [
      "translate-y-0",
      {
        style: {
          transform: [
            { translateX: 0 },
            { translateY: 0 },
            { rotate: "0deg" },
            { skewX: "0deg" },
            { skewY: "0deg" },
            { scaleX: 1 },
            { scaleY: 1 },
          ],
        },
        meta: {
          variables: {
            "--tw-translate-y": 0,
          },
        },
      },
    ],
    [
      "translate-x-px",
      {
        style: {
          transform: [
            { translateX: 1 },
            { translateY: 0 },
            { rotate: "0deg" },
            { skewX: "0deg" },
            { skewY: "0deg" },
            { scaleX: 1 },
            { scaleY: 1 },
          ],
        },
        meta: {
          variables: {
            "--tw-translate-x": 1,
          },
        },
      },
    ],
    [
      "translate-y-px",
      {
        style: {
          transform: [
            { translateX: 0 },
            { translateY: 1 },
            { rotate: "0deg" },
            { skewX: "0deg" },
            { skewY: "0deg" },
            { scaleX: 1 },
            { scaleY: 1 },
          ],
        },
        meta: {
          variables: {
            "--tw-translate-y": 1,
          },
        },
      },
    ],
    [
      "translate-x-1",
      {
        style: {
          transform: [
            { translateX: 3.5 },
            { translateY: 0 },
            { rotate: "0deg" },
            { skewX: "0deg" },
            { skewY: "0deg" },
            { scaleX: 1 },
            { scaleY: 1 },
          ],
        },
        meta: {
          variables: {
            "--tw-translate-x": 3.5,
          },
        },
      },
    ],
    [
      "translate-y-1",
      {
        style: {
          transform: [
            { translateX: 0 },
            { translateY: 3.5 },
            { rotate: "0deg" },
            { skewX: "0deg" },
            { skewY: "0deg" },
            { scaleX: 1 },
            { scaleY: 1 },
          ],
        },
        meta: {
          variables: {
            "--tw-translate-y": 3.5,
          },
        },
      },
    ],
  );
});

describe.skip("Transforms - Translate (%)", () => {
  // TODO - These require the tailwind plugin
  testCases(
    [
      "translate-x-1/2",
      {
        style: {
          transform: [
            { translateX: 0 },
            { translateY: 0 },
            { rotate: "0deg" },
            { skewX: "0deg" },
            { skewY: "0deg" },
            { scaleX: 1 },
            { scaleY: 1 },
          ],
        },
        meta: {
          variables: {
            "--tw-translate-x": 3.5,
          },
        },
      },
    ],
    [
      "translate-y-1/2",
      {
        style: {
          transform: [
            { translateX: 0 },
            { translateY: 3.5 },
            { rotate: "0deg" },
            { skewX: "0deg" },
            { skewY: "0deg" },
            { scaleX: 1 },
            { scaleY: 1 },
          ],
        },
        meta: {
          variables: {
            "--tw-translate-y": 3.5,
          },
        },
      },
    ],
    [
      "translate-x-full",
      {
        style: {
          transform: [
            { translateX: 3.5 },
            { translateY: 0 },
            { rotate: "0deg" },
            { skewX: "0deg" },
            { skewY: "0deg" },
            { scaleX: 1 },
            { scaleY: 1 },
          ],
        },
        meta: {
          variables: {
            "--tw-translate-x": 3.5,
          },
        },
      },
    ],
    [
      "translate-y-full",
      {
        style: {
          transform: [
            { translateX: 0 },
            { translateY: 3.5 },
            { rotate: "0deg" },
            { skewX: "0deg" },
            { skewY: "0deg" },
            { scaleX: 1 },
            { scaleY: 1 },
          ],
        },
        meta: {
          variables: {
            "--tw-translate-y": 3.5,
          },
        },
      },
    ],
  );
});

describe("Transforms - Skew", () => {
  testCases(
    [
      "skew-x-0",
      {
        style: {
          transform: [
            { translateX: 0 },
            { translateY: 0 },
            { rotate: "0deg" },
            { skewX: "0deg" },
            { skewY: "0deg" },
            { scaleX: 1 },
            { scaleY: 1 },
          ],
        },
        meta: {
          variables: {
            "--tw-skew-x": "0deg",
          },
        },
      },
    ],
    [
      "skew-y-0",
      {
        style: {
          transform: [
            { translateX: 0 },
            { translateY: 0 },
            { rotate: "0deg" },
            { skewX: "0deg" },
            { skewY: "0deg" },
            { scaleX: 1 },
            { scaleY: 1 },
          ],
        },
        meta: {
          variables: {
            "--tw-skew-y": "0deg",
          },
        },
      },
    ],
    [
      "skew-x-1",
      {
        style: {
          transform: [
            { translateX: 0 },
            { translateY: 0 },
            { rotate: "0deg" },
            { skewX: "1deg" },
            { skewY: "0deg" },
            { scaleX: 1 },
            { scaleY: 1 },
          ],
        },
        meta: {
          variables: {
            "--tw-skew-x": "1deg",
          },
        },
      },
    ],
    [
      "skew-y-1",
      {
        style: {
          transform: [
            { translateX: 0 },
            { translateY: 0 },
            { rotate: "0deg" },
            { skewX: "0deg" },
            { skewY: "1deg" },
            { scaleX: 1 },
            { scaleY: 1 },
          ],
        },
        meta: {
          variables: {
            "--tw-skew-y": "1deg",
          },
        },
      },
    ],
  );
});

describe("Transforms - Mixed", () => {
  testCases([
    "rotate-90 skew-y-1 translate-x-1",
    {
      style: {
        transform: [
          { translateX: 3.5 },
          { translateY: 0 },
          { rotate: "90deg" },
          { skewX: "0deg" },
          { skewY: "1deg" },
          { scaleX: 1 },
          { scaleY: 1 },
        ],
      },
    },
  ]);
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
