/** @jsxImportSource test */
import { View } from "react-native";

import { getAnimatedStyle } from "react-native-reanimated";
import {
  fireEvent,
  registerCSS,
  render,
  screen,
  setupAllComponents,
} from "test";

const testID = "react-native-css-interop";
setupAllComponents();

jest.useFakeTimers();

test("basic animation", () => {
  registerCSS(`
.my-class {
  animation-duration: 3000ms;
  animation-name: slidein;
  animation-timing-function: linear;
}

@keyframes slidein {
  from {
    margin-left: 100%;
  }

  to {
    margin-left: 0%;
  }
}
`);

  render(<View testID={testID} className="my-class" />);

  const component = screen.getByTestId(testID);

  expect(component).toHaveAnimatedStyle({
    marginLeft: "100%",
  });

  jest.advanceTimersByTime(1500);

  expect(getAnimatedStyle(component)).toEqual({
    marginLeft: "50%",
  });

  jest.advanceTimersByTime(1500);

  expect(component).toHaveAnimatedStyle({
    marginLeft: "0%",
  });
});

test("single frame", () => {
  registerCSS(`
    .my-class {
      animation-duration: 3s;
      animation-name: spin;
      animation-timing-function: linear;
    }

    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }
`);

  const component = render(
    <View testID={testID} className="my-class" />,
  ).getByTestId(testID);

  expect(component).toHaveAnimatedStyle({
    transform: [{ rotate: "0deg" }],
  });

  jest.advanceTimersByTime(1500);

  expect(component).toHaveAnimatedStyle({
    transform: [{ rotate: "180deg" }],
  });

  jest.advanceTimersByTime(1501);

  expect(component).toHaveAnimatedStyle({
    transform: [{ rotate: "360deg" }],
  });
});

test("transform - starting", () => {
  registerCSS(`
    .my-class {
      animation-duration: 3s;
      animation-name: spin;
      animation-timing-function: linear;
      transform: rotate(180deg);
    }

    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }
`);

  const component = render(
    <View testID={testID} className="my-class" />,
  ).getByTestId(testID);

  expect(component).toHaveAnimatedStyle({
    transform: [{ rotate: "180deg" }],
  });

  jest.advanceTimersByTime(1500);

  expect(component).toHaveAnimatedStyle({
    transform: [{ rotate: "270deg" }],
  });

  jest.advanceTimersByTime(1500);

  expect(component).toHaveAnimatedStyle({
    transform: [{ rotate: "360deg" }],
  });
});

test("timing functions per frame", () => {
  registerCSS(`
    .my-class {
      animation: bounce 1s infinite;
    }

    @keyframes bounce {
      0%, 100% {
        transform: translateY(-25%);
        animation-timing-function: cubic-bezier(0.8,0,1,1);
      }

      50% {
        transform: none;
        animation-timing-function: cubic-bezier(0,0,0.2,1);
      }
    }
`);

  const component = render(
    <View testID={testID} className="my-class" />,
  ).getByTestId(testID);

  // Initial frame is incorrect due to missing layout
  expect(component).toHaveAnimatedStyle({
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

  jest.advanceTimersByTime(250);

  expect(component).toHaveAnimatedStyle({
    transform: [
      { translateY: "-20.981126534630565%" },
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

  jest.advanceTimersByTime(250);

  expect(component).toHaveAnimatedStyle({
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

  jest.advanceTimersByTime(250);

  expect(component).toHaveAnimatedStyle({
    transform: [
      { translateY: "-20.944655241363616%" },
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

  jest.advanceTimersByTime(251);

  expect(component).toHaveAnimatedStyle({
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

test("per-frame timing function", () => {
  registerCSS(`
    .my-class {
      animation: spin 1s infinite linear
    }

    @keyframes spin {
      100% {
        transform: rotate(360deg);
      }
      0% {
        transform: rotate(0deg);
      }
      50% {
        transform: rotate(180deg);
        animation-timing-function: cubic-bezier(0,0,0.2,1);
      }
    }
`);

  const component = render(
    <View testID={testID} className="my-class" />,
  ).getByTestId(testID);

  fireEvent(component, "layout", {
    nativeEvent: { layout: { width: 200, height: 100 } },
  });

  jest.advanceTimersByTime(250);

  expect(getAnimatedStyle(component)).toStrictEqual({
    transform: [{ rotate: "90deg" }],
  });

  jest.advanceTimersByTime(250);

  expect(getAnimatedStyle(component)).toStrictEqual({
    transform: [{ rotate: "180deg" }],
  });

  jest.advanceTimersByTime(250);

  expect(getAnimatedStyle(component)).toStrictEqual({
    transform: [{ rotate: "330.801517737818deg" }],
  });

  jest.advanceTimersByTime(251);
  expect(getAnimatedStyle(component)).toStrictEqual({
    transform: [{ rotate: "360deg" }],
  });
});

test("work with active styles", () => {
  registerCSS(`
    .my-class:active {
      animation-duration: 3s;
      animation-name: spin;
      animation-timing-function: linear;
    }

    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }
`);

  render(<View testID={testID} className="my-class" />);
  const component = screen.getByTestId(testID);

  expect(getAnimatedStyle(component)).toStrictEqual({});

  fireEvent(component, "onPressIn");

  // Half way though the animation
  jest.advanceTimersByTime(1500);

  expect(getAnimatedStyle(component)).toStrictEqual({
    transform: [{ rotate: "180deg" }],
  });

  fireEvent(component, "onPressOut");

  jest.advanceTimersToNextTimer();

  expect(getAnimatedStyle(component)).toStrictEqual({
    transform: [{ rotate: "0deg" }],
  });
});

test("stop animating when the animation is removed", () => {
  registerCSS(`
    .my-class {
      animation-duration: 3s;
      animation-name: spin;
      animation-timing-function: linear;
    }

    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }

    .bg-white {
      background-color: white;
    }
`);

  render(<View testID={testID} className="my-class" />);

  const component = screen.getByTestId(testID);

  // Half way though the animation
  jest.advanceTimersByTime(1500);

  expect(getAnimatedStyle(component)).toStrictEqual({
    transform: [{ rotate: "180deg" }],
  });

  // Remove the animation
  screen.rerender(<View testID={testID} className="bg-white" />);

  jest.advanceTimersToNextTimer();

  // The animation should have reset
  // Reanimated is keeping the transform prop
  expect(getAnimatedStyle(component)).toStrictEqual({
    backgroundColor: "#ffffff",
    transform: [
      {
        rotate: "0deg",
      },
    ],
  });
});

test("stop animating when the animation-none is added", () => {
  registerCSS(`
    .my-class {
      animation-duration: 3s;
      animation-name: spin;
      animation-timing-function: linear;
    }

    .animate-none {
      animation-name: none;
    }

    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }
`);

  render(<View testID={testID} className="my-class" />);

  const component = screen.getByTestId(testID);

  jest.advanceTimersByTime(1500);

  expect(getAnimatedStyle(component)).toStrictEqual({
    transform: [{ rotate: "180deg" }],
  });

  screen.rerender(<View testID={testID} className="my-class animate-none" />);

  jest.advanceTimersToNextTimer();

  expect(getAnimatedStyle(component)).toStrictEqual({
    transform: [{ rotate: "0deg" }],
  });

  jest.advanceTimersByTime(1500);

  expect(getAnimatedStyle(component)).toStrictEqual({
    transform: [{ rotate: "0deg" }],
  });
});

test("can change the duration mid animation", () => {
  registerCSS(`
    .my-class {
      animation-duration: 3s;
      animation-name: spin;
      animation-timing-function: linear;
    }

    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }

    .new-duration {
      animation-duration: 1s;
    }
`);

  render(<View testID={testID} className="my-class" />);

  const component = screen.getByTestId(testID);

  // Half way though the animation
  jest.advanceTimersByTime(1500);

  expect(getAnimatedStyle(component)).toStrictEqual({
    transform: [{ rotate: "180deg" }],
  });

  // Change the duration
  screen.rerender(<View testID={testID} className="my-class new-duration" />);

  // The animation should have reset
  expect(getAnimatedStyle(component)).toStrictEqual({
    transform: [{ rotate: "0deg" }],
  });

  // Now the half-way point is at 500ms
  jest.advanceTimersByTime(500);

  expect(getAnimatedStyle(component)).toStrictEqual({
    transform: [{ rotate: "180deg" }],
  });
});
