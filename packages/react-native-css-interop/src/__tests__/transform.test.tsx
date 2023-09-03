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

test("translateX percentage", () => {
  registerCSS(`.my-class { width: 120px; transform: translateX(10%); }`);

  const component = render(
    <A testID={testID} className="my-class" />,
  ).getByTestId(testID);

  expect(component).toHaveStyle({
    width: 120,
    transform: [{ translateX: 12 }],
  });
});

test("translateY percentage", () => {
  registerCSS(`.my-class { height: 120px; transform: translateY(10%); }`);

  const component = render(
    <A testID={testID} className="my-class" />,
  ).getByTestId(testID);

  expect(component).toHaveStyle({
    height: 120,
    transform: [{ translateY: 12 }],
  });
});

test("rotate-180", () => {
  registerCSS(`.my-class { transform: rotate(180deg); }`);

  const component = render(
    <A testID={testID} className="my-class" />,
  ).getByTestId(testID);

  expect(component).toHaveStyle({
    transform: [{ rotate: "180deg" }],
  });
});
