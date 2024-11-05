import { render, screen } from "@testing-library/react-native";
import Animated, { getAnimatedStyle } from "react-native-reanimated";

import { buildUseInterop } from "../../runtime/pure";
import { addStyle } from "../../runtime/pure/testUtils";

const testID = "react-native-css-interop";

jest.useFakeTimers();

const useInterop = buildUseInterop(Animated.View, {
  source: "className",
  target: "style",
});

function MyAnimatedView(props: any) {
  const interopProps = useInterop(props);
  return <Animated.View testID={testID} {...interopProps} />;
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
  expect(getAnimatedStyle(screen.getByTestId(testID))).toEqual({});

  jest.advanceTimersToNextTimer();
  expect(getAnimatedStyle(screen.getByTestId(testID))).toEqual({
    width: 0,
  });

  jest.advanceTimersByTime(501);
  expect(getAnimatedStyle(screen.getByTestId(testID))).toEqual({
    width: 50,
  });

  jest.advanceTimersByTime(501);
  expect(getAnimatedStyle(screen.getByTestId(testID))).toEqual({
    width: 100,
  });
});
