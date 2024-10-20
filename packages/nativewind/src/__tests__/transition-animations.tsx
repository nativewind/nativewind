/** @jsxImportSource nativewind */
import { View } from "react-native";

import { getAnimatedStyle } from "react-native-reanimated";
import { opacity } from "react-native-reanimated/lib/typescript/reanimated2/Colors";

import { render, screen } from "../test";

const testID = "test-id";

// Default transition duration is 150ms

jest.useFakeTimers();

test("transition-colors", async () => {
  await render(
    <View
      testID={testID}
      className="transition-colors ease-linear bg-red-500 border-black"
    />,
    {
      config: {
        safelist: ["bg-blue-500 border-slate-500"],
      },
    },
  );

  let component = screen.getByTestId(testID);

  // Should have a static color, and should not animate
  expect(getAnimatedStyle(component)).toStrictEqual({
    backgroundColor: "#ef4444",
    borderColor: "#000000",
  });
  jest.advanceTimersByTime(300);
  expect(getAnimatedStyle(component)).toStrictEqual({
    backgroundColor: "#ef4444",
    borderColor: "#000000",
  });

  // Rerender with a new color, triggering the animation
  screen.rerender(
    <View
      testID={testID}
      className="transition-colors ease-linear bg-blue-500 border-slate-500"
    />,
  );

  // Directly after rerender, should still have the old color
  expect(getAnimatedStyle(component)).toStrictEqual({
    backgroundColor: "#ef4444",
    borderColor: "#000000",
  });

  // Bg-Color should only change after we advance time
  jest.advanceTimersByTime(76); // Transition half the time
  expect(getAnimatedStyle(component)).toStrictEqual({
    backgroundColor: "rgba(178, 105, 184, 1)",
    borderColor: "rgba(73, 85, 101, 1)",
  });

  // At the end of the transition
  jest.advanceTimersByTime(1000);
  expect(getAnimatedStyle(component)).toStrictEqual({
    backgroundColor: "rgba(59, 130, 246, 1)",
    borderColor: "rgba(100, 116, 139, 1)",
  });

  // Bg-Color should not change after the transition is done
  jest.advanceTimersByTime(500);
  expect(getAnimatedStyle(component)).toStrictEqual({
    backgroundColor: "rgba(59, 130, 246, 1)",
    borderColor: "rgba(100, 116, 139, 1)",
  });
});

test("transition-opacity", async () => {
  await render(
    <View
      testID={testID}
      className="transition-opacity ease-linear opacity-0"
    />,
    {
      config: {
        safelist: ["opacity-100"],
      },
    },
  );

  let component = screen.getByTestId(testID);

  expect(getAnimatedStyle(component)).toStrictEqual({ opacity: 0 });
  jest.advanceTimersByTime(300);
  expect(getAnimatedStyle(component)).toStrictEqual({ opacity: 0 });

  // Rerender with a new color, triggering the animation
  screen.rerender(
    <View
      testID={testID}
      className="transition-opacity ease-linear opacity-100"
    />,
  );

  // Directly after rerender, should still have the old color
  expect(getAnimatedStyle(component)).toStrictEqual({ opacity: 0 });

  // Bg-Color should only change after we advance time
  jest.advanceTimersByTime(76); // Transition half the time
  expect(getAnimatedStyle(component)).toStrictEqual({ opacity: 0.5 });

  // At the end of the transition
  jest.advanceTimersByTime(1000);
  expect(getAnimatedStyle(component)).toStrictEqual({ opacity: 1 });

  // Bg-Color should not change after the transition is done
  jest.advanceTimersByTime(500);
  expect(getAnimatedStyle(component)).toStrictEqual({ opacity: 1 });
});

test("animate-spin", async () => {
  await render(<View testID={testID} className="animate-spin" />);

  let component = screen.getByTestId(testID);

  expect(getAnimatedStyle(component)).toStrictEqual({
    transform: [{ rotate: "0deg" }],
  });
  jest.advanceTimersByTime(500);
  expect(getAnimatedStyle(component)).toStrictEqual({
    transform: [{ rotate: "180deg" }],
  });

  jest.advanceTimersByTime(500);
  expect(getAnimatedStyle(component)).toStrictEqual({
    transform: [{ rotate: "360deg" }],
  });

  jest.advanceTimersByTime(250);
  expect(getAnimatedStyle(component)).toStrictEqual({
    transform: [{ rotate: "90deg" }],
  });
});

test("animate-pulse", async () => {
  await render(<View testID={testID} className="animate-pulse" />);

  let component = screen.getByTestId(testID);

  expect(getAnimatedStyle(component)).toStrictEqual({
    opacity: 1,
  });
  jest.advanceTimersByTime(500);
  expect(getAnimatedStyle(component)).toStrictEqual({
    opacity: 0.7500000093132256,
  });

  jest.advanceTimersByTime(500);
  expect(getAnimatedStyle(component)).toStrictEqual({
    opacity: 0.5,
  });

  jest.advanceTimersByTime(500);
  expect(getAnimatedStyle(component)).toStrictEqual({
    opacity: 0.7491666591949523,
  });

  jest.advanceTimersByTime(501);
  expect(getAnimatedStyle(component)).toStrictEqual({
    opacity: 1,
  });
});

test("changing animations", async () => {
  await render(<View testID={testID} className="animate-spin" />, {
    config: {
      safelist: ["animate-bounce"],
    },
  });

  let component = screen.getByTestId(testID);

  expect(getAnimatedStyle(component)).toStrictEqual({
    transform: [{ rotate: "0deg" }],
  });
  jest.advanceTimersByTime(500);
  expect(getAnimatedStyle(component)).toStrictEqual({
    transform: [{ rotate: "180deg" }],
  });

  screen.rerender(<View testID={testID} className="animate-bounce" />);

  // It takes 1 tick for reanimated to realize that the SharedValues have changed
  expect(getAnimatedStyle(component)).toStrictEqual({
    transform: [{ rotate: "0deg" }],
  });

  // Advance to the next tick
  jest.advanceTimersToNextTimer();

  expect(getAnimatedStyle(component)).toStrictEqual({
    transform: [
      { translateY: "-25%" },
      { perspective: 1 },
      { translateX: 0 },
      { rotate: "0deg" },
      { rotateX: "0deg" },
      { rotateY: "0deg" },
      { rotateZ: "0deg" },
      { scale: 1 },
      { scaleX: 1 },
      { scaleY: 1 },
      { skewX: "0deg" },
      { skewY: "0deg" },
    ],
  });

  jest.advanceTimersByTime(500);

  expect(getAnimatedStyle(component)).toStrictEqual({
    transform: [
      { translateY: "0%" },
      { perspective: 1 },
      { translateX: 0 },
      { rotate: "0deg" },
      { rotateX: "0deg" },
      { rotateY: "0deg" },
      { rotateZ: "0deg" },
      { scale: 1 },
      { scaleX: 1 },
      { scaleY: 1 },
      { skewX: "0deg" },
      { skewY: "0deg" },
    ],
  });

  jest.advanceTimersByTime(501);

  expect(getAnimatedStyle(component)).toStrictEqual({
    transform: [
      { translateY: "-25%" },
      { perspective: 1 },
      { translateX: 0 },
      { rotate: "0deg" },
      { rotateX: "0deg" },
      { rotateY: "0deg" },
      { rotateZ: "0deg" },
      { scale: 1 },
      { scaleX: 1 },
      { scaleY: 1 },
      { skewX: "0deg" },
      { skewY: "0deg" },
    ],
  });
});
