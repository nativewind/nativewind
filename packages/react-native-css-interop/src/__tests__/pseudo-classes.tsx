import { fireEvent, render, screen } from "@testing-library/react-native";
import { Pressable, TextInput } from "react-native";

import {
  createMockComponent,
  registerCSS,
  resetStyles,
} from "../testing-library";

const testID = "react-native-css-interop";

// View's do not have a onFocus listener on iOS/Android
const A = createMockComponent(TextInput);
const B = createMockComponent(Pressable, { propDeps: ["disabled"] });

beforeEach(() => resetStyles());

test("hover", () => {
  registerCSS(`.my-class:hover { width: 10px; }`);

  const component = render(
    <A testID={testID} className="my-class" />,
  ).getByTestId(testID);

  expect(component).toHaveStyle(undefined);

  fireEvent(component, "hoverIn");
  expect(component).toHaveStyle({ width: 10 });

  fireEvent(component, "hoverOut");
  expect(component).toHaveStyle(undefined);
});

test("active", () => {
  registerCSS(`.my-class:active { width: 10px; }`);

  const component = render(
    <A testID={testID} className="my-class" />,
  ).getByTestId(testID);

  expect(component).toHaveStyle(undefined);

  fireEvent(component, "pressIn");
  expect(component).toHaveStyle({ width: 10 });

  fireEvent(component, "pressOut");
  expect(component).toHaveStyle(undefined);
});

test("focus", () => {
  registerCSS(`.my-class:focus { width: 10px; }`);

  const component = render(
    <A testID={testID} className="my-class" />,
  ).getByTestId(testID);

  expect(component).toHaveStyle(undefined);

  fireEvent(component, "focus");
  expect(component).toHaveStyle({ width: 10 });

  fireEvent(component, "blur");
  expect(component).toHaveStyle(undefined);
});

test(":hover:active:focus", () => {
  registerCSS(`.my-class:hover:active:focus { width: 10px; }`);

  const component = render(
    <A testID={testID} className="my-class" />,
  ).getByTestId(testID);

  expect(component).toHaveStyle(undefined);

  fireEvent(component, "hoverIn", {});
  expect(component).toHaveStyle(undefined);

  fireEvent(component, "pressIn", {});
  expect(component).toHaveStyle(undefined);

  fireEvent(component, "focus", {});
  expect(component).toHaveStyle({ width: 10 });

  fireEvent(component, "hoverOut", {});
  expect(component).toHaveStyle(undefined);
});

test("disabled", () => {
  registerCSS(`.my-class:disabled { width: 10px; }`);

  const component = render(
    <B testID={testID} className="my-class" />,
  ).getByTestId(testID);


  expect(component).toHaveStyle(undefined);

  const testID2 = `${testID}-2`;
  const { rerender } = render(
    <B testID={testID2} className="my-class" disabled />,
  )
  expect(screen.getByTestId(testID2)).toHaveStyle({ width: 10 });

  rerender(<B testID={testID2} className="my-class" />);
  expect(screen.getByTestId(testID2)).toHaveStyle(undefined);

  rerender(<B testID={testID2} className="my-class" disabled />);
  expect(screen.getByTestId(testID2)).toHaveStyle({ width: 10 });
});
