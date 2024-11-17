/** @jsxImportSource test */
import { View } from "react-native";

import { act, fireEvent, render, screen } from "@testing-library/react-native";
import { registerCSS, setupAllComponents } from "test";

const testID = "react-native-css-interop";
const children = undefined;

setupAllComponents();

const MyView = jest.fn((props) => {
  console.log(props);
  return <View {...props} />;
});

test("hover", () => {
  registerCSS(`
    .text-blue-500 {
      color: blue;
    }

    .text-blue-500:hover {
      color: red;
    }
  `);

  render(
    <MyView testID={testID} className="text-blue-500 hover:text-red-500" />,
  );
  const component = screen.getByTestId(testID);

  expect(component.props).toStrictEqual({
    testID,
    children,
    onHoverIn: expect.any(Function),
    onHoverOut: expect.any(Function),
    style: {
      color: "#0000ff",
    },
  });

  act(() => fireEvent(component, "hoverIn"));

  expect(component.props).toStrictEqual({
    testID,
    children,
    onHoverIn: expect.any(Function),
    onHoverOut: expect.any(Function),
    style: {
      color: "#ff0000",
    },
  });
  act(() => fireEvent(component, "hoverOut"));

  expect(component.props).toStrictEqual({
    testID,
    children,
    onHoverIn: expect.any(Function),
    onHoverOut: expect.any(Function),
    style: {
      color: "#0000ff",
    },
  });
  expect(MyView).toHaveBeenCalledTimes(1);
});
