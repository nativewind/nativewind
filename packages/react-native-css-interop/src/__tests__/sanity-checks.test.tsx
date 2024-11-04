/** @jsxImportSource test */
import { useEffect } from "react";
import { View } from "react-native";

import {
  fireEvent,
  registerCSS,
  render,
  screen,
  setupAllComponents,
} from "test";

const testID = "react-native-css-interop";
setupAllComponents();

test("dynamic variables should not unmount children", () => {
  /**
   * The interop changes the render tree and can accidentally unmount components.
   * In this instance, having a variable will force the VariableProvider into the tree
   * Even if this variable is conditional, it shouldn't cause an unmount
   */
  registerCSS(`.my-class:hover { color: var(--color); --color: red; }`);

  const onUnMount = jest.fn();
  const onMount = jest.fn(() => onUnMount);

  const Child = (props: { assertMount: () => () => void; testID?: string }) => {
    useEffect(props.assertMount, []);
    return null;
  };

  const component = render(
    <View testID={testID} className="my-class">
      <Child testID="child" assertMount={onMount} />
    </View>,
  ).getByTestId(testID);

  expect(onUnMount).not.toHaveBeenCalled();
  expect(onMount).toHaveBeenCalledTimes(1);

  fireEvent(component, "hoverIn");

  expect(onUnMount).not.toHaveBeenCalled();
  expect(onMount).toHaveBeenCalledTimes(1);
});

test("empty className", () => {
  const component = render(<View testID={testID} className="" />).getByTestId(
    testID,
  );

  expect(component.props.className).not.toBeDefined();
  expect(component).toHaveStyle(undefined);
});

test("rerender empty className", () => {
  registerCSS(`.bg-red-500 { color: red; }`);

  render(<View testID={testID} className="bg-red-500" />);

  const component = screen.getByTestId(testID);

  expect(component).toHaveStyle({ color: "#ff0000" });

  screen.rerender(<View testID={testID} className="" />);
});

test("missing className", () => {
  const component = render(<View testID={testID} />).getByTestId(testID);

  expect(component.props.className).not.toBeDefined();
  expect(component.props.style).not.toBeDefined();
});

test("rerender missing className", () => {
  registerCSS(`.bg-red-500 { color: red; }`);

  render(<View testID={testID} className="bg-red-500" />);

  const component = screen.getByTestId(testID);

  expect(component).toHaveStyle({ color: "#ff0000" });

  screen.rerender(<View testID={testID} />);

  expect(component.props.style).not.toBeDefined();
});

test("null className", () => {
  const component = render(
    <View testID={testID} className={null as any} />,
  ).getByTestId(testID);

  expect(component.props.className).not.toBeDefined();
  expect(component.props.style).not.toBeDefined();
});

test("rerender null className", () => {
  registerCSS(`.bg-red-500 { color: red; }`);

  render(<View testID={testID} className="bg-red-500" />);

  const component = screen.getByTestId(testID);

  expect(component).toHaveStyle({ color: "#ff0000" });

  screen.rerender(<View testID={testID} className={null as any} />);

  expect(component.props.style).not.toBeDefined();
});

test("styles don't mutate other styles", () => {
  registerCSS(
    `.text-red-500 { color: red; } .dynamic { background-color: var(--test); --test: blue }`,
  );

  render(<View testID={testID} className="text-red-500 dynamic" />);

  const component = screen.getByTestId(testID);

  expect(component).toHaveStyle({ color: "#ff0000", backgroundColor: "blue" });

  screen.rerender(<View testID={testID} className="text-red-500" />);

  expect(component).toHaveStyle({ color: "#ff0000" });
});
