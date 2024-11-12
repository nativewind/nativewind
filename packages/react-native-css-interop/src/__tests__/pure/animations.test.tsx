import { View } from "react-native";

import { render, screen } from "@testing-library/react-native";
import { getAnimatedStyle } from "react-native-reanimated";

import { buildUseInterop } from "../../runtime/pure";
import { addKeyFrames, addStyle } from "../../runtime/pure/testUtils";

const testID = "react-native-css-interop";

jest.useFakeTimers();

const useInterop = buildUseInterop(View, {
  source: "className",
  target: "style",
});

function MyAnimatedView(props: any) {
  return useInterop({ testID, ...props });
}

test("basic animation", () => {
  addKeyFrames("slide-in", {
    p: [["marginLeft", [0, 1], [100, 0], "%"]],
  });

  addStyle("animation-slide-in", {
    s: [0],
    a: {
      name: [{ type: "string", value: "slide-in" }],
      duration: [{ type: "milliseconds", value: 1000 }],
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
      name: [{ type: "string", value: "slide-in" }],
      duration: [{ type: "milliseconds", value: 1000 }],
    },
  });

  addStyle("animation-slide-down", {
    s: [0],
    a: {
      name: [{ type: "string", value: "slide-down" }],
      duration: [{ type: "milliseconds", value: 1000 }],
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
