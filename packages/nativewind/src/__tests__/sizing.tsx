import { Dimensions } from "react-native";
import { resetStyles } from "react-native-css-interop/testing-library";
import { invalidValue, style, testCases } from "../test-utils";

afterEach(() => resetStyles());

describe("Sizing - Width", () => {
  testCases(
    ["w-0", style({ width: 0 })],
    ["w-px", style({ width: 1 })],
    ["w-1", style({ width: 3.5 })],
    ["w-1/2", style({ width: "50%" })],
    ["w-full", style({ width: "100%" })],
    ["w-auto", invalidValue("width", "auto")],
    ["w-min", invalidValue("width", "min-content")],
    ["w-max", invalidValue("width", "max-content")],
    ["w-fit", invalidValue("width", "fit-content")],
    ["w-screen", style({ width: Dimensions.get("window").width })],
  );
});

describe("Sizing - Min Width", () => {
  testCases(
    ["min-w-0", style({ minWidth: 0 })],
    ["min-w-full", style({ minWidth: "100%" })],
    ["min-w-min", invalidValue("min-width", "min-content")],
    ["min-w-max", invalidValue("min-width", "max-content")],
    ["min-w-fit", invalidValue("min-width", "fit-content")],
  );
});

describe("Sizing - Max Width", () => {
  testCases(
    ["max-w-0", style({ maxWidth: 0 })],
    ["max-w-full", style({ maxWidth: "100%" })],
    ["max-w-min", invalidValue("max-width", "min-content")],
    ["max-w-max", invalidValue("max-width", "max-content")],
    ["max-w-fit", invalidValue("max-width", "fit-content")],
  );
});

describe("Sizing - Height", () => {
  testCases(
    ["h-0", style({ height: 0 })],
    ["h-px", style({ height: 1 })],
    ["h-1", style({ height: 3.5 })],
    ["h-1/2", style({ height: "50%" })],
    ["h-full", style({ height: "100%" })],
    ["h-auto", invalidValue("height", "auto")],
    ["h-min", invalidValue("height", "min-content")],
    ["h-max", invalidValue("height", "max-content")],
    ["h-fit", invalidValue("height", "fit-content")],
    ["h-screen", style({ height: Dimensions.get("window").height })],
  );
});

describe("Sizing - Min Height", () => {
  testCases(
    ["min-h-0", style({ minHeight: 0 })],
    ["min-h-full", style({ minHeight: "100%" })],
    ["min-h-min", invalidValue("min-height", "min-content")],
    ["min-h-max", invalidValue("min-height", "max-content")],
    ["min-h-fit", invalidValue("min-height", "fit-content")],
  );
});

describe("Sizing - Max Height", () => {
  testCases(
    ["max-h-0", style({ maxHeight: 0 })],
    ["max-h-full", style({ maxHeight: "100%" })],
    ["max-h-min", invalidValue("max-height", "min-content")],
    ["max-h-max", invalidValue("max-height", "max-content")],
    ["max-h-fit", invalidValue("max-height", "fit-content")],
  );
});
