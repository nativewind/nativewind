import { render, screen } from "@testing-library/react-native";
import Animated, { getAnimatedStyle } from "react-native-reanimated";

import { buildUseInterop } from "../../runtime/pure";
import { addKeyFrames, addStyle } from "../../runtime/pure/testUtils";

const testID = "react-native-css-interop";

jest.useFakeTimers();

const useInterop = buildUseInterop(Animated.View, {
  source: "className",
  target: "style",
});

function MyAnimatedView(props: any) {
  props = useInterop(props);
  return <Animated.View testID={testID} {...props} />;
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
