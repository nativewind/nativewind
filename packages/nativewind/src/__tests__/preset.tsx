import { resetStyles } from "react-native-css-interop/testing-library";
import { style, testCases } from "../test-utils";

afterEach(() => resetStyles());

describe("Preset - color-*", () => {
  testCases(["color-black", style({ color: "rgba(0, 0, 0, 1)" })]);
});
