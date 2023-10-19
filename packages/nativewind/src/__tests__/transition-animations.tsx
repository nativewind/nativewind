import { resetStyles } from "react-native-css-interop/testing-library";
import { style, testCasesWithOptions } from "../test-utils";

afterEach(() => resetStyles());

/** TODO Rewrite these tests to actually test the properties, not what they just compile to */

describe.skip("Transitions & Animation - Transition Property", () => {
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

describe.skip("Transitions & Animation - Transition Duration", () => {
  testCasesWithOptions(
    {
      animated: true,
    },
    ["duration-75", {}],
  );
});

describe.skip("Transitions & Animation - Transition Timing Function", () => {
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

describe.skip("Transitions & Animation - Transition Delay", () => {
  testCasesWithOptions(
    {
      animated: true,
    },
    ["delay-0", {}],
  );
});

describe.skip("Transitions & Animation - Animation", () => {
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
