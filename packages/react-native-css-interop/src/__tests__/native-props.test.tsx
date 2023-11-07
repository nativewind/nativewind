import { render } from "@testing-library/react-native";
import { View } from "react-native";

import {
  createMockComponent,
  registerCSS,
  resetStyles,
} from "../testing-library";

const testID = "react-native-css-interop";
const A = createMockComponent(View);

beforeEach(() => resetStyles());

test("native props", () => {
  registerCSS(`.my-class:native-prop(color,placeholderColor) { color: red }`);

  const component = render(
    <A testID={testID} className="my-class" />,
  ).getByTestId(testID);

  expect(component.props).toEqual(
    expect.objectContaining({
      placeholderColor: "rgba(255, 0, 0, 1)",
      style: {},
    }),
  );
});
