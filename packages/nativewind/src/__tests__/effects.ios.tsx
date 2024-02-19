import { resetStyles } from "react-native-css-interop/testing-library";
import {
  invalidProperty,
  style,
  testCases,
  testCasesWithOptions,
} from "../test-utils";

afterEach(() => resetStyles());

describe("Effects - Box Shadow", () => {
  testCasesWithOptions(
    { base: true },
    [
      "shadow-sm",
      style({
        shadowColor: "rgba(0, 0, 0, 0.3490196168422699)",
        shadowOpacity: 1,
        shadowOffset: {
          height: 1,
          width: 0,
        },
        shadowRadius: 1,
      }),
    ],
    [
      "shadow",
      style({
        shadowColor: "rgba(0, 0, 0, 0.3490196168422699)",
        shadowOpacity: 1,
        shadowOffset: {
          height: 1,
          width: 0,
        },
        shadowRadius: 4,
      }),
    ],
    [
      "shadow-none",
      style({
        shadowColor: "rgba(0, 0, 0, 0)",
        shadowOpacity: 1,
        shadowOffset: {
          height: 0,
          width: 0,
        },
        shadowRadius: 0,
      }),
    ],
  );
});

describe.skip("Effects - Box Shadow Color", () => {
  // TODO
  testCases();
});

describe("Effects - Opacity", () => {
  testCases(
    ["opacity-0", style({ opacity: 0 })],
    ["opacity-100", style({ opacity: 1 })],
  );
});

describe("Effects - Mix Blend Mode", () => {
  testCases(
    ["mix-blend-normal", invalidProperty("mix-blend-mode")],
    ["mix-blend-multiply", invalidProperty("mix-blend-mode")],
    ["mix-blend-screen", invalidProperty("mix-blend-mode")],
    ["mix-blend-overlay", invalidProperty("mix-blend-mode")],
    ["mix-blend-darken", invalidProperty("mix-blend-mode")],
    ["mix-blend-lighten", invalidProperty("mix-blend-mode")],
    ["mix-blend-color-dodge", invalidProperty("mix-blend-mode")],
    ["mix-blend-color-burn", invalidProperty("mix-blend-mode")],
    ["mix-blend-hard-light", invalidProperty("mix-blend-mode")],
    ["mix-blend-soft-light", invalidProperty("mix-blend-mode")],
    ["mix-blend-difference", invalidProperty("mix-blend-mode")],
    ["mix-blend-exclusion", invalidProperty("mix-blend-mode")],
    ["mix-blend-hue", invalidProperty("mix-blend-mode")],
    ["mix-blend-saturation", invalidProperty("mix-blend-mode")],
    ["mix-blend-color", invalidProperty("mix-blend-mode")],
    ["mix-blend-luminosity", invalidProperty("mix-blend-mode")],
  );
});

describe("Effects - Background Blend Mode", () => {
  testCases(
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
  );
});
