import { View } from "react-native";

import {
  render,
  createMockComponent,
  registerCSS,
  resetStyles,
} from "test-utils";

const testID = "react-native-css-interop";
const A = createMockComponent(View);

beforeEach(() => resetStyles());

test("type prefix", () => {
  registerCSS(`html .my-class { color: red; }`, {
    selectorPrefix: "html",
  });

  const component = render(
    <A testID={testID} className="my-class" />,
  ).getByTestId(testID);

  expect(component).toHaveStyle({
    color: "rgba(255, 0, 0, 1)",
  });
});

test("class prefix", () => {
  registerCSS(`.test .my-class { color: red; }`, {
    selectorPrefix: ".test",
  });

  const component = render(
    <A testID={testID} className="my-class" />,
  ).getByTestId(testID);

  expect(component).toHaveStyle({
    color: "rgba(255, 0, 0, 1)",
  });
});
