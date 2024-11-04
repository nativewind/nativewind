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
  const interopProps = useInterop(props);
  return <Animated.View testID={testID} {...interopProps} />;
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

  expect(getAnimatedStyle(screen.getByTestId(testID))).toEqual({
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
