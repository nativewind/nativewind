import { View } from "react-native";

import { render, screen } from "@testing-library/react-native";
import { getAnimatedStyle } from "react-native-reanimated";

import { getUseInteropOptions, useInterop } from "../../runtime/pure";
import { addStyle } from "../../runtime/pure/testUtils";

const testID = "react-native-css-interop";

jest.useFakeTimers();

const { configStates, initialActions } = getUseInteropOptions({
  source: "className",
  target: "style",
});

function MyAnimatedView(props: any) {
  return useInterop({ testID, ...props }, View, configStates, initialActions);
}

test("basic transition", () => {
  addStyle("transition-width", {
    s: [0],
    t: {
      p: ["width"],
      l: [1000],
    },
  });

  addStyle("width-1", [
    {
      width: 100,
    },
  ]);

  render(<MyAnimatedView className="transition-width" />);

  expect(getAnimatedStyle(screen.getByTestId(testID))).toEqual({});

  // Nothing should happen
  jest.advanceTimersByTime(500);
  expect(getAnimatedStyle(screen.getByTestId(testID))).toEqual({});

  screen.rerender(<MyAnimatedView className="transition-width width-1" />);

  // Transitions start once the useEffect() runs
  jest.advanceTimersToNextTimer();
  expect(getAnimatedStyle(screen.getByTestId(testID))).toEqual({ width: 0 });

  // Check progress of transition
  jest.advanceTimersByTime(500);
  expect(getAnimatedStyle(screen.getByTestId(testID))).toEqual({ width: 50 });

  // Check it ends
  jest.advanceTimersByTime(500);
  expect(getAnimatedStyle(screen.getByTestId(testID))).toEqual({ width: 100 });

  // And doesn't continue
  jest.advanceTimersByTime(500);
  expect(getAnimatedStyle(screen.getByTestId(testID))).toEqual({ width: 100 });
});

test("updating transition", () => {
  addStyle("transition-width", {
    s: [0],
    t: {
      p: ["width"],
      l: [1000],
    },
  });

  addStyle("width-1", [
    {
      width: 100,
    },
  ]);

  addStyle("width-2", [
    {
      width: 200,
    },
  ]);

  render(<MyAnimatedView className="transition-width" />);
  expect(getAnimatedStyle(screen.getByTestId(testID))).toEqual({});

  screen.rerender(<MyAnimatedView className="transition-width width-1" />);
  // Transitions start once the useEffect() runs
  jest.advanceTimersToNextTimer();
  expect(getAnimatedStyle(screen.getByTestId(testID))).toEqual({ width: 0 });

  // Check progress of transition
  jest.advanceTimersByTime(1000);
  expect(getAnimatedStyle(screen.getByTestId(testID))).toEqual({ width: 100 });

  screen.rerender(<MyAnimatedView className="transition-width width-2" />);
  jest.advanceTimersToNextTimer();
  expect(getAnimatedStyle(screen.getByTestId(testID))).toEqual({ width: 100 });

  jest.advanceTimersByTime(500);
  expect(getAnimatedStyle(screen.getByTestId(testID))).toEqual({ width: 150 });
});

test("removing transition", () => {
  addStyle("transition-width", {
    s: [0],
    t: {
      p: ["width"],
      l: [1000],
    },
  });

  addStyle("width-1", [
    {
      width: 100,
    },
  ]);

  addStyle("width-2", [
    {
      width: 200,
    },
  ]);

  render(<MyAnimatedView className="transition-width" />);

  render(<MyAnimatedView className="transition-width" />);
  expect(getAnimatedStyle(screen.getByTestId(testID))).toEqual({});

  screen.rerender(<MyAnimatedView className="transition-width width-1" />);
  // Transitions start once the useEffect() runs
  jest.advanceTimersToNextTimer();
  expect(getAnimatedStyle(screen.getByTestId(testID))).toEqual({ width: 0 });

  // Check progress of transition
  jest.advanceTimersByTime(1000);
  expect(getAnimatedStyle(screen.getByTestId(testID))).toEqual({ width: 100 });

  screen.rerender(<MyAnimatedView className="transition-width" />);
  jest.advanceTimersToNextTimer();
  expect(getAnimatedStyle(screen.getByTestId(testID))).toEqual({ width: 100 });

  jest.advanceTimersByTime(500);
  expect(getAnimatedStyle(screen.getByTestId(testID))).toEqual({ width: 50 });
});
