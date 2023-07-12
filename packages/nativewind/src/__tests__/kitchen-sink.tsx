import { ViewStyle, ImageStyle, TextStyle } from "react-native";
import {
  createMockComponent,
  resetStyles,
} from "react-native-css-interop/testing-library";
import { renderTailwind } from "../test-utils";

type Style = ViewStyle & TextStyle & ImageStyle;

const A = createMockComponent();

afterEach(() => resetStyles());

const success = (style: Style) => ({ success: style });
const warning = (name: string, property: string, value: any) => ({
  failure: new Map([
    [name, [{ reason: "IncompatibleNativeValue", property, value }]],
  ]),
});

const cases = [
  ["z-0", success({ zIndex: 0 })],
  ["z-auto", warning("z-auto", "z-index", "auto")],
] as const;

test.each(cases)("%s", (className, expected) => {
  renderTailwind(<A className={className} />);

  if ("success" in expected && "failure" in expected) {
    expect(A).styleToEqual(expected.success);
    // expect(A).toHaveStyleWarnings(expected.failure);
  } else if ("success" in expected) {
    expect(A).styleToEqual(expected.success);
  } else if ("failure" in expected) {
    expect(A).styleToEqual({});
    expect(A).toHaveStyleWarnings(expected.failure);
  } else {
    console.error(`Invalid test for ${className}`);
  }
});
