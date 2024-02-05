import { View } from "react-native";
import { fireEvent, render } from "@testing-library/react-native";

import {
  createMockComponent,
  registerCSS,
  resetStyles,
} from "../testing-library";

const testID = "react-native-css-interop";
const A = createMockComponent(View);

jest.useFakeTimers();

beforeEach(() => resetStyles());

test("basic animation", () => {
  registerCSS(`
.my-class {
  animation-duration: 3s;
  animation-name: slidein;
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

  const component = render(
    <A testID={testID} className="my-class" />,
  ).getByTestId(testID);

  expect(component).toHaveAnimatedStyle({
    marginLeft: "100%",
  });

  jest.advanceTimersByTime(1501);

  expect(component).toHaveAnimatedStyle({
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
    }

    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }
`);

  const component = render(
    <A testID={testID} className="my-class" />,
  ).getByTestId(testID);

  expect(component).toHaveAnimatedStyle({
    transform: [{ rotate: "0deg" }],
  });

  jest.advanceTimersByTime(1501);

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
      transform: rotate(180deg);
    }

    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }
`);

  const component = render(
    <A testID={testID} className="my-class" />,
  ).getByTestId(testID);

  expect(component).toHaveAnimatedStyle({
    transform: [{ rotate: "180deg" }],
  });

  jest.advanceTimersByTime(1501);

  expect(component).toHaveAnimatedStyle({
    transform: [{ rotate: "270deg" }],
  });

  jest.advanceTimersByTime(1500);

  expect(component).toHaveAnimatedStyle({
    transform: [{ rotate: "360deg" }],
  });
});

test("bounce", () => {
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
    <A testID={testID} className="my-class" />,
  ).getByTestId(testID);

  // Initial frame is incorrect due to missing layout
  expect(component).toHaveAnimatedStyle({
    transform: [
      { translateY: 0 },
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

  fireEvent(component, "layout", {
    nativeEvent: {
      layout: {
        width: 200,
        height: 100,
      },
    },
  });

  jest.advanceTimersByTime(1);

  expect(component).toHaveAnimatedStyle({
    transform: [
      { translateY: -25 },
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

  expect(component).toHaveAnimatedStyle({
    transform: [
      { translateY: 0 },
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

  expect(component).toHaveAnimatedStyle({
    transform: [
      { translateY: -25 },
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
