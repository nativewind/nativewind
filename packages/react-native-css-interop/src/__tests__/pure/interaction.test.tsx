import { View } from "react-native";

import { act, fireEvent, render, screen } from "@testing-library/react-native";

import { getUseInteropOptions, useInterop } from "../../runtime/pure";
import { addStyle } from "../../runtime/pure/testUtils";

const testID = "react-native-css-interop";
const children = undefined;

jest.useFakeTimers();

let renderCount = 0;

const { configStates, initialActions } = getUseInteropOptions({
  source: "className",
  target: "style",
});

function MyView(props: any) {
  renderCount++;
  return useInterop({ testID, ...props }, View, configStates, initialActions);
}

beforeEach(() => {
  renderCount = 0;
});

test("hover", () => {
  addStyle("text-blue-500", {
    s: [0],
    d: [{ color: "blue" }],
  });

  addStyle("hover:text-red-500", {
    s: [0],
    d: [{ color: "red" }],
    p: {
      h: true,
    },
  });

  render(<MyView className="text-blue-500 hover:text-red-500" />);
  const component = screen.getByTestId(testID);

  expect(component.props).toStrictEqual({
    testID,
    children,
    onHoverIn: expect.any(Function),
    onHoverOut: expect.any(Function),
    style: {
      color: "blue",
    },
  });
  expect(renderCount).toBe(1);

  act(() => fireEvent(component, "hoverIn"));

  expect(component.props).toStrictEqual({
    testID,
    children,
    onHoverIn: expect.any(Function),
    onHoverOut: expect.any(Function),
    style: {
      color: "red",
    },
  });
  expect(renderCount).toBe(2);

  act(() => fireEvent(component, "hoverOut"));

  expect(component.props).toStrictEqual({
    testID,
    children,
    onHoverIn: expect.any(Function),
    onHoverOut: expect.any(Function),
    style: {
      color: "blue",
    },
  });
  expect(renderCount).toBe(3);
});
