import { fireEvent, render } from "@testing-library/react-native";
import { View } from "react-native";

import {
  createMockComponent,
  registerCSS,
  resetStyles,
} from "../testing-library";
import { useEffect } from "react";

const testID = "react-native-css-interop";
const A = createMockComponent(View);

beforeEach(() => resetStyles());

test("dynamic variables should not unmount children", () => {
  /**
   * The interop changes the render tree and can accidentally unmount components.
   * In this instance, having a variable will force the VariableProvider into the tree
   * Even if this variable is conditional, it shouldn't cause an unmount
   */
  registerCSS(`.my-class:hover { color: var(--color); --color: red; }`);

  const onUnMount = jest.fn();
  const onMount = jest.fn(() => onUnMount);

  const Child = (props: { assertMount: () => () => void }) => {
    useEffect(props.assertMount, []);
    return null;
  };

  const component = render(
    <A testID={testID} className="my-class">
      <Child assertMount={onMount} />
    </A>,
  ).getByTestId(testID);

  expect(onUnMount).not.toHaveBeenCalled();
  expect(onMount).toHaveBeenCalledTimes(1);

  fireEvent(component, "hoverIn");

  expect(onUnMount).not.toHaveBeenCalled();
  expect(onMount).toHaveBeenCalledTimes(1);
});

test("empty className", () => {
  const component = render(<A testID={testID} className="" />).getByTestId(
    testID,
  );

  expect(component.props.className).not.toBeDefined();
  expect(component).toHaveStyle(undefined);
});

test("missing className", () => {
  const component = render(<A testID={testID} />).getByTestId(testID);

  expect(component.props.className).not.toBeDefined();
  expect(component.props.style).not.toBeDefined();
});
