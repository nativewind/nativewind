import { View } from "react-native";

import { render, screen } from "@testing-library/react-native";
import { getAnimatedStyle } from "react-native-reanimated";

import { getUseInteropOptions, useInterop } from "../../runtime/pure";
import { addKeyFrames, addStyle } from "../../runtime/pure/testUtils";

const testID = "react-native-css-interop";

jest.useFakeTimers();

const { configStates, initialActions } = getUseInteropOptions({
  source: "className",
  target: "style",
});

function MyAnimatedView(props: any) {
  return useInterop({ testID, ...props }, View, configStates, initialActions);
}

test("basic animation", () => {
  addKeyFrames("slide-in", {
    p: [["marginLeft", [0, 1], [100, 0], "%"]],
  });

  addStyle("animation-slide-in", {
    s: [0],
    a: {
      n: ["slide-in"],
      du: [1000],
    },
  });

  render(<MyAnimatedView className="animation-slide-in" />);

  expect(screen.getByTestId(testID)).toHaveAnimatedStyle({
    marginLeft: "100%",
  });

  jest.advanceTimersByTime(500);

  expect(getAnimatedStyle(screen.getByTestId(testID))).toEqual({
    marginLeft: "50%",
  });

  jest.advanceTimersByTime(500);

  expect(getAnimatedStyle(screen.getByTestId(testID))).toEqual({
    marginLeft: "0%",
  });

  jest.advanceTimersByTime(500);

  expect(getAnimatedStyle(screen.getByTestId(testID))).toEqual({
    marginLeft: "0%",
  });
});

test("updating animation", () => {
  addKeyFrames("slide-in", {
    p: [["marginLeft", [0, 1], [100, 0], "%"]],
  });

  addKeyFrames("slide-down", {
    p: [["marginTop", [0, 1], [0, 50], "%"]],
  });

  addStyle("animation-slide-in", {
    s: [0],
    a: {
      n: ["slide-in"],
      du: [1000],
    },
  });

  addStyle("animation-slide-down", {
    s: [0],
    a: {
      n: ["slide-down"],
      du: [1000],
    },
  });

  render(<MyAnimatedView className="animation-slide-in" />);

  expect(screen.getByTestId(testID)).toHaveAnimatedStyle({
    marginLeft: "100%",
  });

  screen.rerender(<MyAnimatedView className="animation-slide-down" />);

  expect(screen.getByTestId(testID)).toHaveAnimatedStyle({
    marginLeft: "100%",
  });

  jest.advanceTimersByTime(500);

  expect(getAnimatedStyle(screen.getByTestId(testID))).toEqual({
    marginLeft: 0,
    marginTop: "25%",
  });
});
