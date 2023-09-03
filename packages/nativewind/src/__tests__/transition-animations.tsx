import { resetStyles } from "react-native-css-interop/testing-library";
import { style, testCasesWithOptions } from "../test-utils";

afterEach(() => resetStyles());

describe("Transitions & Animation - Transition Property", () => {
  testCasesWithOptions(
    {
      animated: true,
    },
    // TODO: Add tests for all transition properties
    // "transition-none",
    // "transition-all",
    // "transition",
    // "transition-colors",
    // "transition-opacity",
    // "transition-shadow",
    // "transition-transform",
    [
      "transition-colors",
      style({
        backgroundColor: "transparent",
        borderColor: "transparent",
        color: "transparent",
      }),
    ],
    [
      "transition-opacity",
      style({
        opacity: 1,
      }),
    ],
  );
});

describe("Transitions & Animation - Transition Duration", () => {
  testCasesWithOptions(
    {
      animated: true,
    },
    ["duration-75", {}],
  );
});

describe("Transitions & Animation - Transition Timing Function", () => {
  testCasesWithOptions(
    {
      animated: true,
    },
    ["ease-linear", {}],
    ["ease-in", {}],
    ["ease-out", {}],
    ["ease-in-out", {}],
  );
});

describe("Transitions & Animation - Transition Delay", () => {
  testCasesWithOptions(
    {
      animated: true,
    },
    ["delay-0", {}],
  );
});

describe("Transitions & Animation - Animation", () => {
  testCasesWithOptions(
    {
      animated: true,
    },
    [
      // TODO:
      // "animate-ping",
      // "animate-pulse",
      // "animate-bounce",

      "animate-none",
      {},
    ],
    [
      "animate-spin",
      style({
        transform: [{ rotate: "0deg" }],
      }),
    ],
    // [
    //   "animate-ping",
    //   {
    //     style: {
    //       opacity: NaN,
    //       transform: [{ scaleX: 1 }, { scaleY: 1 }],
    //     },
    //   },
    // ],
  );
});
