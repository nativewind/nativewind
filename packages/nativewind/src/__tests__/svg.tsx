import { resetStyles } from "react-native-css-interop/testing-library";
import { testCases } from "../test-utils";

afterEach(() => resetStyles());

describe("SVG - Fill", () => {
  testCases(["fill-black", { props: { fill: "rgba(0, 0, 0, 1)" } }]);
});

describe("SVG - Stroke", () => {
  testCases(["stroke-black", { props: { stroke: "rgba(0, 0, 0, 1)" } }]);
});

describe("SVG - Stroke Width", () => {
  testCases(["stroke-1", { props: { strokeWidth: 1 } }]);
});
