import { render } from "@testing-library/react-native";
import { View } from "react-native";

import { StyleSheet } from "../runtime/native/stylesheet";
import { createMockComponent, registerCSS } from "../testing-library";

const testID = "react-native-css-interop";
const A = createMockComponent(View);

jest.useFakeTimers();

beforeEach(() => {
  StyleSheet.__reset();
});

test("numeric transition", () => {
  registerCSS(`
    .transition {
      transition: width 1s;
    }

    .first {
      width: 100px;
    }

    .second {
      width: 200px;
    }
`);

  const { rerender, getByTestId } = render(
    <A testID={testID} className="transition first" />,
  );

  const component = getByTestId(testID);

  // Should have a static width, no matter the time
  expect(component).toHaveAnimatedStyle({
    width: 100,
  });
  jest.advanceTimersByTime(1000);
  expect(component).toHaveAnimatedStyle({
    width: 100,
  });

  rerender(<A testID={testID} className="transition second" />);

  // Directly after rerender, should still have the old width
  expect(component).toHaveAnimatedStyle({
    width: 100,
  });

  // Width should only change after we advance time
  jest.advanceTimersByTime(500);
  expect(component).toHaveAnimatedStyle({
    width: 150,
  });

  // At the end of the transition
  jest.advanceTimersByTime(500);
  expect(component).toHaveAnimatedStyle({
    width: 200,
  });

  // Width should not change after the transition is done
  jest.advanceTimersByTime(500);
  expect(component).toHaveAnimatedStyle({
    width: 200,
  });
});

test("color transition", () => {
  registerCSS(`
    .transition {
      transition: color 1s;
    }

    .first {
      color: red;
    }

    .second {
      color: blue;
    }
`);

  const { rerender, getByTestId } = render(
    <A testID={testID} className="transition first" />,
  );

  const component = getByTestId(testID);

  // Should have a static width, no matter the time
  expect(component).toHaveAnimatedStyle({
    color: "rgba(255, 0, 0, 1)",
  });
  jest.advanceTimersByTime(1000);
  expect(component).toHaveAnimatedStyle({
    color: "rgba(255, 0, 0, 1)",
  });

  rerender(<A testID={testID} className="transition second" />);

  // Directly after rerender, should still have the old width
  expect(component).toHaveAnimatedStyle({
    color: "rgba(255, 0, 0, 1)",
  });

  // Width should only change after we advance time
  jest.advanceTimersByTime(500);
  expect(component).toHaveAnimatedStyle({
    color: "rgba(186, 0, 186, 1)",
  });

  // At the end of the transition
  jest.advanceTimersByTime(500);
  expect(component).toHaveAnimatedStyle({
    color: "rgba(0, 0, 255, 1)",
  });

  // Width should not change after the transition is done
  jest.advanceTimersByTime(500);
  expect(component).toHaveAnimatedStyle({
    color: "rgba(0, 0, 255, 1)",
  });
});
