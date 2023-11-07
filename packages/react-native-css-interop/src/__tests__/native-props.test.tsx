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

test(":native-prop() zero args", () => {
  registerCSS(`.my-class:native-prop() { color: red; background-color: blue }`);

  const component = render(
    <A testID={testID} className="my-class" />,
  ).getByTestId(testID);

  expect(component.props).toEqual(
    expect.objectContaining({
      color: "rgba(255, 0, 0, 1)",
      backgroundColor: "rgba(0, 0, 255, 1)",
      style: {},
    }),
  );
});

test(":native-prop() one arg", () => {
  registerCSS(
    `.my-class:native-prop(color) { color: red; background-color: blue }`,
  );

  const component = render(
    <A testID={testID} className="my-class" />,
  ).getByTestId(testID);

  expect(component.props).toEqual(
    expect.objectContaining({
      color: "rgba(255, 0, 0, 1)",
      style: {
        backgroundColor: "rgba(0, 0, 255, 1)",
      },
    }),
  );
});

test(":native-prop() two args", () => {
  registerCSS(
    `.my-class:native-prop(color,placeholderColor) { color: red; background-color: blue }`,
  );

  const component = render(
    <A testID={testID} className="my-class" />,
  ).getByTestId(testID);

  expect(component.props).toEqual(
    expect.objectContaining({
      placeholderColor: "rgba(255, 0, 0, 1)",
      style: {
        backgroundColor: "rgba(0, 0, 255, 1)",
      },
    }),
  );
});
