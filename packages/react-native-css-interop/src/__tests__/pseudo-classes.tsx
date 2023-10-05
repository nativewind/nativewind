import { fireEvent, render } from "@testing-library/react-native";
import { TextInput } from "react-native";

import {
  createMockComponent,
  registerCSS,
  resetStyles,
} from "../testing-library";

const testID = "react-native-css-interop";

// View's do not have a onFocus listener on iOS/Android
const A = createMockComponent(TextInput);

beforeEach(() => resetStyles());

test.only("hover", () => {
  registerCSS(`.my-class:hover { width: 10px; }`);

  const component = render(
    <A testID={testID} className="my-class" />,
  ).getByTestId(testID);

  expect(component).toHaveStyle({});

  fireEvent(component, "hoverIn");
  expect(component).toHaveStyle({ width: 10 });

  fireEvent(component, "hoverOut");
  expect(component).toHaveStyle({});
});

test("active", () => {
  registerCSS(`.my-class:active { width: 10px; }`);

  const component = render(
    <A testID={testID} className="my-class" />,
  ).getByTestId(testID);

  expect(component).toHaveStyle({});

  fireEvent(component, "pressIn");
  expect(component).toHaveStyle({ width: 10 });

  fireEvent(component, "pressOut");
  expect(component).toHaveStyle({});
});

test("focus", () => {
  registerCSS(`.my-class:focus { width: 10px; }`);

  const component = render(
    <A testID={testID} className="my-class" />,
  ).getByTestId(testID);

  expect(component).toHaveStyle({});

  fireEvent(component, "focus");
  expect(component).toHaveStyle({ width: 10 });

  fireEvent(component, "blur");
  expect(component).toHaveStyle({});
});

test(":hover:active:focus", () => {
  registerCSS(`.my-class:hover:active:focus { width: 10px; }`);

  const component = render(
    <A testID={testID} className="my-class" />,
  ).getByTestId(testID);

  expect(component).toHaveStyle({});

  fireEvent(component, "hoverIn", {});
  expect(component).toHaveStyle({});

  fireEvent(component, "pressIn", {});
  expect(component).toHaveStyle({});

  fireEvent(component, "focus", {});
  expect(component).toHaveStyle({ width: 10 });

  fireEvent(component, "hoverOut", {});
  expect(component).toHaveStyle({});
});
