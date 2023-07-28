import { resetStyles } from "react-native-css-interop/testing-library";
import { testCases } from "../test-utils";

afterEach(() => resetStyles());

describe.only("Transitions & Animation - Transition Property", () => {
  testCases(
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
      {
        style: {
          backgroundColor: "transparent",
          borderColor: "transparent",
          color: "transparent",
        },
        meta: {
          transition: {
            duration: [{ value: 150, type: "milliseconds" }],
            timingFunction: [
              {
                type: "cubic-bezier",
                x1: 0.4000000059604645,
                x2: 0.20000000298023224,
                y1: 0,
                y2: 1,
              },
            ],
            property: [
              "color",
              "backgroundColor",
              "borderColor",
              "textDecorationColor",
              "fill",
              "stroke",
            ],
          },
        },
      },
    ],
    // [
    //   "transition-opacity",
    //   {
    //     style: {
    //       opacity: 1,
    //     },
    //     meta: {
    //       transition: {
    //         duration: [{ value: 150, type: "milliseconds" }],
    //         timingFunction: [
    //           {
    //             type: "cubic-bezier",
    //             x1: 0.4000000059604645,
    //             x2: 0.20000000298023224,
    //             y1: 0,
    //             y2: 1,
    //           },
    //         ],
    //         property: ["opacity"],
    //       },
    //     },
    //   },
    // ],
  );
});

describe("Transitions & Animation - Transition Duration", () => {
  testCases([
    "duration-75",
    {
      meta: {
        transition: { duration: [{ value: 75, type: "milliseconds" }] },
      },
    },
  ]);
});

describe("Transitions & Animation - Transition Timing Function", () => {
  testCases(
    [
      "ease-linear",
      { meta: { transition: { timingFunction: [{ type: "linear" }] } } },
    ],
    [
      "ease-in",
      {
        meta: {
          transition: {
            timingFunction: [
              {
                type: "cubic-bezier",
                x1: 0.4000000059604645,
                x2: 1,
                y1: 0,
                y2: 1,
              },
            ],
          },
        },
      },
    ],
    [
      "ease-out",
      {
        meta: {
          transition: {
            timingFunction: [
              {
                type: "cubic-bezier",
                x1: 0,
                x2: 0.20000000298023224,
                y1: 0,
                y2: 1,
              },
            ],
          },
        },
      },
    ],
    [
      "ease-in-out",
      {
        meta: {
          transition: {
            timingFunction: [
              {
                type: "cubic-bezier",
                x1: 0.4000000059604645,
                x2: 0.20000000298023224,
                y1: 0,
                y2: 1,
              },
            ],
          },
        },
      },
    ],
  );
});

describe("Transitions & Animation - Transition Delay", () => {
  testCases([
    "delay-0",
    {
      meta: {
        transition: { delay: [{ value: 0, type: "seconds" }] },
      },
    },
  ]);
});

describe("Transitions & Animation - Animation", () => {
  testCases(
    // TODO:
    // "animate-ping",
    // "animate-pulse",
    // "animate-bounce",

    [
      "animate-none",
      {
        meta: {
          animations: {
            delay: [
              {
                type: "seconds",
                value: 0,
              },
            ],
            direction: ["normal"],
            duration: [
              {
                type: "seconds",
                value: 0,
              },
            ],
            fillMode: ["none"],
            iterationCount: [
              {
                type: "number",
                value: 1,
              },
            ],
            name: [
              {
                type: "none",
              },
            ],
            playState: ["running"],
            timingFunction: [
              {
                type: "ease",
              },
            ],
          },
        },
      },
    ],
    [
      "animate-spin",
      {
        style: {
          transform: [{ rotate: "0deg" }],
        },
        meta: {
          animations: {
            delay: [
              {
                type: "seconds",
                value: 0,
              },
            ],
            direction: ["normal"],
            duration: [
              {
                type: "seconds",
                value: 1,
              },
            ],
            fillMode: ["none"],
            iterationCount: [
              {
                type: "infinite",
              },
            ],
            name: [
              {
                type: "ident",
                value: "spin",
              },
            ],
            playState: ["running"],
            timingFunction: [
              {
                type: "linear",
              },
            ],
          },
        },
      },
    ],
    // [
    //   "animate-ping",
    //   {
    //     style: {
    //       opacity: NaN,
    //       transform: [{ scaleX: 1 }, { scaleY: 1 }],
    //     },
    //     meta: {
    //       animations: {
    //         delay: [
    //           {
    //             type: "seconds",
    //             value: 0,
    //           },
    //         ],
    //         direction: ["normal"],
    //         duration: [
    //           {
    //             type: "seconds",
    //             value: 1,
    //           },
    //         ],
    //         fillMode: ["none"],
    //         iterationCount: [
    //           {
    //             type: "infinite",
    //           },
    //         ],
    //         name: [
    //           {
    //             type: "ident",
    //             value: "ping",
    //           },
    //         ],
    //         playState: ["running"],
    //         timingFunction: [
    //           {
    //             type: "linear",
    //           },
    //         ],
    //       },
    //     },
    //   },
    // ],
  );
});
