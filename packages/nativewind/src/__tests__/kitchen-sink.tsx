import { ViewStyle, ImageStyle, TextStyle } from "react-native";
import {
  createMockComponent,
  resetStyles,
} from "react-native-css-interop/testing-library";
import { renderTailwind } from "../test-utils";
import { ExtractionWarning } from "react-native-css-interop/dist/types";

type Style = ViewStyle & TextStyle & ImageStyle;
type Case = [
  string,
  {
    success?: ReturnType<typeof success>["success"];
    failure?: (name: string) => Map<string, ExtractionWarning[]>;
  },
];

const A = createMockComponent();

afterEach(() => resetStyles());

const success = (style: Style) => ({ success: style });
const invalidProperty = (property: string) => ({
  failure: (name: string) =>
    new Map<string, ExtractionWarning[]>([
      [name, [{ type: "IncompatibleNativeProperty", property }]],
    ]),
});
const invalidValue = (property: string, value: any) => ({
  failure: (name: string) =>
    new Map<string, ExtractionWarning[]>([
      [name, [{ type: "IncompatibleNativeValue", property, value }]],
    ]),
});

function testCases(cases: Case[]) {
  test.each(cases)("%s", async (className, expected) => {
    await renderTailwind(<A className={className} />);

    if (expected.success) {
      expect(A).styleToEqual(expected.success);
    } else if (expected.failure) {
      expect(A).styleToEqual({});
      expect(A).toHaveStyleWarnings(expected.failure(className));
    }
  });
}

describe("Interactivity - Accent Color", () => {
  testCases([
    ["accent-inherit", invalidValue("accent-color", "inherit")],
    ["accent-current", invalidProperty("accent-color")],
    ["accent-white", invalidProperty("accent-color")],
  ]);
});

describe("Layout - Align Content", () => {
  testCases([
    ["content-center", success({ alignContent: "center" })],
    ["content-start", success({ alignContent: "flex-start" })],
    ["content-end", success({ alignContent: "flex-end" })],
    ["content-between", success({ alignContent: "space-between" })],
    ["content-around", success({ alignContent: "space-around" })],
    ["content-evenly", invalidValue("align-content", "space-evenly")],
  ]);
});

describe("Layout - Align Items", () => {
  testCases([
    ["items-center", success({ alignItems: "center" })],
    ["items-start", success({ alignItems: "flex-start" })],
    ["items-end", success({ alignItems: "flex-end" })],
    ["items-baseline", success({ alignItems: "baseline" })],
    ["items-stretch", success({ alignItems: "stretch" })],
  ]);
});
