import { resetStyles } from "react-native-css-interop/testing-library";
import { invalidProperty, testCases } from "../test-utils";

afterEach(() => resetStyles());

describe("Tables - Border Collapse", () => {
  testCases(
    ["border-collapse", invalidProperty("border-collapse")],
    ["border-separate", invalidProperty("border-collapse")],
  );
});

describe("Tables - Border Spacing", () => {
  testCases(
    ["border-spacing-0", invalidProperty("border-spacing")],
    ["border-spacing-x-0", invalidProperty("border-spacing")],
    ["border-spacing-y-0", invalidProperty("border-spacing")],
    ["border-spacing-px", invalidProperty("border-spacing")],
    ["border-spacing-x-px", invalidProperty("border-spacing")],
    ["border-spacing-y-px", invalidProperty("border-spacing")],
    ["border-spacing-1", invalidProperty("border-spacing")],
    ["border-spacing-x-1", invalidProperty("border-spacing")],
    ["border-spacing-y-1", invalidProperty("border-spacing")],
  );
});

describe("Tables - Table Layout", () => {
  testCases(
    ["table-auto", invalidProperty("table-layout")],
    ["table-fixed", invalidProperty("table-layout")],
  );
});

describe("Tables - Caption Side", () => {
  testCases(
    ["caption-top", invalidProperty("caption-side")],
    ["caption-bottom", invalidProperty("caption-side")],
  );
});
