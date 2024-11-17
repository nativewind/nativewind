/** @jsxImportSource test */
import { View } from "react-native";

import { render, screen } from "@testing-library/react-native";
import { getAnimatedStyle } from "react-native-reanimated";
import { registerCSS, setupAllComponents } from "test";

const testID = "react-native-css-interop";

jest.useFakeTimers();

setupAllComponents();

test("basic transition", () => {
  registerCSS(`
    .transition-width {
      transition-property: width;
      transition-duration: 1s;
    }

    .width-1 {
      width: 100;
    }
  `);

  render(<View testID={testID} className="transition-width" />);

  expect(getAnimatedStyle(screen.getByTestId(testID))).toEqual({});

  // Nothing should happen
  jest.advanceTimersByTime(500);
  expect(getAnimatedStyle(screen.getByTestId(testID))).toEqual({});

  screen.rerender(
    <View testID={testID} className="transition-width width-1" />,
  );

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
  registerCSS(`
    .transition-width {
      transition-property: width;
      transition-duration: 1s;
    }

    .width-1 {
      width: 100;
    }

    .width-2 {
      width: 200;
    }
  `);

  render(<View testID={testID} className="transition-width" />);
  expect(getAnimatedStyle(screen.getByTestId(testID))).toEqual({});

  screen.rerender(
    <View testID={testID} className="transition-width width-1" />,
  );
  // Transitions start once the useEffect() runs
  jest.advanceTimersToNextTimer();
  expect(getAnimatedStyle(screen.getByTestId(testID))).toEqual({ width: 0 });

  // Check progress of transition
  jest.advanceTimersByTime(1000);
  expect(getAnimatedStyle(screen.getByTestId(testID))).toEqual({ width: 100 });

  screen.rerender(
    <View testID={testID} className="transition-width width-2" />,
  );
  jest.advanceTimersToNextTimer();
  expect(getAnimatedStyle(screen.getByTestId(testID))).toEqual({ width: 100 });

  jest.advanceTimersByTime(500);
  expect(getAnimatedStyle(screen.getByTestId(testID))).toEqual({ width: 150 });
});

test("removing transition", () => {
  registerCSS(`
    .transition-width {
      transition-property: width;
      transition-duration: 1s;
    }

    .width-1 {
      width: 100;
    }

    .width-2 {
      width: 200;
    }
  `);

  render(<View testID={testID} className="transition-width" />);

  render(<View testID={testID} className="transition-width" />);
  expect(getAnimatedStyle(screen.getByTestId(testID))).toEqual({});

  screen.rerender(
    <View testID={testID} className="transition-width width-1" />,
  );
  // Transitions start once the useEffect() runs
  jest.advanceTimersToNextTimer();
  expect(getAnimatedStyle(screen.getByTestId(testID))).toEqual({ width: 0 });

  // Check progress of transition
  jest.advanceTimersByTime(1000);
  expect(getAnimatedStyle(screen.getByTestId(testID))).toEqual({ width: 100 });

  screen.rerender(<View testID={testID} className="transition-width" />);
  jest.advanceTimersToNextTimer();
  expect(getAnimatedStyle(screen.getByTestId(testID))).toEqual({ width: 100 });

  jest.advanceTimersByTime(500);
  expect(getAnimatedStyle(screen.getByTestId(testID))).toEqual({ width: 50 });
});
