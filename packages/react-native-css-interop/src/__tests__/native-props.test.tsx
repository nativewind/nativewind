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
    }),
  );
});

test.only(":native-prop(*)", () => {
  registerCSS(
    `.my-class:native-prop(*) { color: red; background-color: blue }`,
  );

  const component = render(
    <A testID={testID} className="my-class" />,
  ).getByTestId(testID);

  expect(component.props).toEqual(
    expect.objectContaining({
      color: "rgba(255, 0, 0, 1)",
      backgroundColor: "rgba(0, 0, 255, 1)",
    }),
  );
});

test(":native-prop(color,customProp)", () => {
  registerCSS(
    `.my-class:native-prop(color,customProp) { color: red; background-color: blue }`,
  );

  const component = render(
    <A testID={testID} className="my-class" />,
  ).getByTestId(testID);

  expect(component.props).toEqual(
    expect.objectContaining({
      customProp: "rgba(255, 0, 0, 1)",
      style: expect.objectContaining({
        backgroundColor: "rgba(0, 0, 255, 1)",
      }),
    }),
  );
});
