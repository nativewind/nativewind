import { ViewStyle, ImageStyle, TextStyle } from "react-native";
import {
  createMockComponent,
  resetStyles,
} from "react-native-css-interop/testing-library";
import { renderTailwind } from "../test-utils";
import {
  ExtractionWarning,
  StyleMeta,
} from "react-native-css-interop/dist/types";

type Style = ViewStyle & TextStyle & ImageStyle;
type Case = [
  string,
  {
    style?: ReturnType<typeof style>["style"];
    warning?: (name: string) => Map<string, ExtractionWarning[]>;
    meta?: StyleMeta;
  },
];

const A = createMockComponent();

afterEach(() => resetStyles());

const style = (style: Style & Record<string, unknown>) => ({ style });
const invalidProperty = (property: string) => ({
  warning: (name: string) =>
    new Map<string, ExtractionWarning[]>([
      [name, [{ type: "IncompatibleNativeProperty", property }]],
    ]),
});
const invalidValue = (property: string, value: any) => ({
  warning: (name: string) =>
    new Map<string, ExtractionWarning[]>([
      [name, [{ type: "IncompatibleNativeValue", property, value }]],
    ]),
});

function testCases(cases: Case[]) {
  test.each(cases)("%s", async (className, expected) => {
    await renderTailwind(<A className={className} />);

    if (expected.style) {
      expect(A).styleToEqual(expected.style);
    } else {
      expect(A).styleToEqual({});
    }

    if (expected.warning) {
      expect(A).toHaveStyleWarnings(expected.warning(className));
    } else {
      expect(A).toHaveStyleWarnings(new Map());
    }

    if (expected.meta) {
      expect(A).styleMetaToEqual(expected.meta);
    } else {
      expect(A).styleMetaToEqual(undefined);
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
    ["content-center", style({ alignContent: "center" })],
    ["content-start", style({ alignContent: "flex-start" })],
    ["content-end", style({ alignContent: "flex-end" })],
    ["content-between", style({ alignContent: "space-between" })],
    ["content-around", style({ alignContent: "space-around" })],
    ["content-evenly", invalidValue("align-content", "space-evenly")],
  ]);
});

describe("Layout - Align Items", () => {
  testCases([
    ["items-center", style({ alignItems: "center" })],
    ["items-start", style({ alignItems: "flex-start" })],
    ["items-end", style({ alignItems: "flex-end" })],
    ["items-baseline", style({ alignItems: "baseline" })],
    ["items-stretch", style({ alignItems: "stretch" })],
  ]);
});

describe("Layout - Align Self", () => {
  testCases([
    ["self-auto", style({ alignSelf: "auto" })],
    ["self-start", style({ alignSelf: "flex-start" })],
    ["self-end", style({ alignSelf: "flex-end" })],
    ["self-center", style({ alignSelf: "center" })],
    ["self-stretch", style({ alignSelf: "stretch" })],
    ["self-baseline", style({ alignSelf: "baseline" })],
  ]);
});

describe("Interactivity - Appearance", () => {
  testCases([["appearance-none", invalidProperty("appearance")]]);
});

describe("Layout - Aspect Ratio", () => {
  testCases([
    ["aspect-square", style({ aspectRatio: 1 })],
    ["aspect-video", style({ aspectRatio: "16 / 9" })],
    ["aspect-[4/3]", style({ aspectRatio: "4 / 3" })],
  ]);
});

describe("Filters - Backdrop Blur", () => {
  testCases([["backdrop-blur-none", invalidProperty("backdrop-filter")]]);
});

describe("Filters - Backdrop Brightness", () => {
  testCases([["backdrop-brightness-0", invalidProperty("backdrop-filter")]]);
});

describe("Filters - Backdrop Contrast", () => {
  testCases([["backdrop-contrast-0", invalidProperty("backdrop-filter")]]);
});

describe("Filters - Backdrop Grayscale", () => {
  testCases([["backdrop-grayscale-0", invalidProperty("backdrop-filter")]]);
});

describe("Filters - Backdrop Hue Rotate", () => {
  testCases([["backdrop-hue-rotate-0", invalidProperty("backdrop-filter")]]);
});
