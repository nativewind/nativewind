/** @jsxImportSource test */
import { View } from "react-native";

import { render, screen } from "@testing-library/react-native";
import { getAnimatedStyle } from "react-native-reanimated";
import { registerCSS, setupAllComponents } from "test";

const testID = "react-native-css-interop";
setupAllComponents();

jest.useFakeTimers();

test("basic animation", () => {
  registerCSS(`
    .animation-slide-in {
      animation-name: slide-in;
      animation-duration: 1s;
    }

    @keyframes slide-in {
      from {
        margin-left: 100%;
      }

      to {
        margin-left: 0%;
      }
    }
  `);

  render(<View testID={testID} className="animation-slide-in" />);

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
  registerCSS(`
    .animation-slide-in {
      animation-name: slide-in;
      animation-duration: 1s;
    }

    .animation-slide-down {
      animation-name: slide-down;
      animation-duration: 1s;
    }

    @keyframes slide-in {
      from {
        margin-left: 100%;
      }

      to {
        margin-left: 0%;
      }
    }

    @keyframes slide-down {
      from {
        margin-top: 0%;
      }

      to {
        margin-top: 50%;
      }
    }
  `);

  render(<View testID={testID} className="animation-slide-in" />);

  expect(screen.getByTestId(testID)).toHaveAnimatedStyle({
    marginLeft: "100%",
  });

  screen.rerender(<View testID={testID} className="animation-slide-down" />);

  expect(screen.getByTestId(testID)).toHaveAnimatedStyle({
    marginLeft: "100%",
  });

  jest.advanceTimersByTime(500);

  expect(getAnimatedStyle(screen.getByTestId(testID))).toEqual({
    marginLeft: 0,
    marginTop: "25%",
  });
});

test("parsable shorthand animation", () => {
  registerCSS(`
    .animation-slide-in {
      animation: slide-in 1s;
    }

    @keyframes slide-in {
      from {
        margin-left: 100%;
      }

      to {
        margin-left: 0%;
      }
    }
  `);

  render(<View testID={testID} className="animation-slide-in" />);

  expect(screen.getByTestId(testID)).toHaveAnimatedStyle({
    marginLeft: "100%",
  });

  jest.advanceTimersByTime(1000);

  expect(getAnimatedStyle(screen.getByTestId(testID))).toEqual({
    marginLeft: "0%",
  });
});

test("unparsable shorthand animation", () => {
  registerCSS(`
    .animation-slide-in {
      --animation-name: slide-in;
      animation: var(--animation-name) 1s;
    }

    @keyframes slide-in {
      from {
        margin-left: 100%;
      }

      to {
        margin-left: 0%;
      }
    }
  `);

  render(<View testID={testID} className="animation-slide-in" />);

  expect(screen.getByTestId(testID)).toHaveAnimatedStyle({
    marginLeft: "100%",
  });

  jest.advanceTimersByTime(1000);

  expect(getAnimatedStyle(screen.getByTestId(testID))).toEqual({
    marginLeft: "0%",
  });
});
