import { render } from "@testing-library/react-native";

import { StyleSheet } from "../runtime/native/stylesheet";
import { createMockComponent, registerCSS } from "../testing-library";
import { View } from "react-native";

const testID = "react-native-css-interop";
const A = createMockComponent(View);

afterEach(() => {
  StyleSheet.__reset();
});

test("heading", () => {
  registerCSS(`.my-class { font-size: 3rem; line-height: 1; }`);

  const component = render(
    <A testID={testID} className="my-class" />,
  ).getByTestId(testID);

  expect(component).toHaveStyle({
    fontSize: 42,
    lineHeight: 42,
  });
});
