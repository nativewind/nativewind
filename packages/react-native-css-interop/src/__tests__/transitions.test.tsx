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

const grouping = ["^group(/.*)?"];
const testID = "react-native-css-interop";
const parentID = "parent";
const childID = "child";
setupAllComponents();

jest.useFakeTimers();

test("numeric transition", () => {
  registerCSS(`
    .transition {
      transition: width 1s linear;
    }

    .first {
      width: 100px;
    }

    .second {
      width: 200px;
    }
`);

  render(<View testID={testID} className="transition first" />);

  let component = screen.getByTestId(testID);

  // Should have a static width, and should not animate
  expect(component).toHaveAnimatedStyle({
    width: 100,
  });
  jest.advanceTimersByTime(1000);
  expect(component).toHaveAnimatedStyle({
    width: 100,
  });

  // Rerender with a new width, triggering the animation
  screen.rerender(<View testID={testID} className="transition second" />);

  // Directly after rerender, should still have the old width
  expect(component).toHaveAnimatedStyle({
    width: 100,
  });

  // Width should only change after we advance time
  jest.advanceTimersByTime(501); // Transition half the time
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

test("transition - rerender", () => {
  registerCSS(`
    .transition {
      transition: color 1s linear;
    }

    .first {
      color: red;
    }

    .second {
      color: blue;
    }
`);

  render(<View testID={testID} className="transition first" />);

  const component = screen.getByTestId(testID);

  // Should have the initial color
  expect(component).toHaveAnimatedStyle({
    color: "#ff0000",
  });
  jest.advanceTimersByTime(1000);
  expect(component).toHaveAnimatedStyle({
    color: "#ff0000",
  });

  screen.rerender(<View testID={testID} className="transition second" />);

  // Directly after rerender, should still have the old width
  expect(component).toHaveAnimatedStyle({
    color: "#ff0000",
  });

  // Width should only change after we advance time
  jest.advanceTimersByTime(500);
  expect(component).toHaveAnimatedStyle({
    color: "rgba(186, 0, 186, 1)",
  });

  // At the end of the transition
  jest.advanceTimersByTime(501);
  expect(component).toHaveAnimatedStyle({
    color: "rgba(0, 0, 255, 1)",
  });

  // Width should not change after the transition is done
  jest.advanceTimersByTime(500);
  expect(component).toHaveAnimatedStyle({
    color: "rgba(0, 0, 255, 1)",
  });
});

test("transition - interaction", () => {
  registerCSS(`
    .transition {
      transition: color 1s linear;
    }

    .first {
      color: red;
    }

    .first:active {
      color: blue;
    }
`);

  render(<View testID={testID} className="transition first" />);

  const component = screen.getByTestId(testID);

  // Should have the initial color
  expect(component).toHaveAnimatedStyle({
    color: "#ff0000",
  });
  jest.advanceTimersByTime(1000);
  expect(component).toHaveAnimatedStyle({
    color: "#ff0000",
  });

  fireEvent(component, "pressIn");

  // Directly after rerender, should still have the old color
  expect(component).toHaveAnimatedStyle({
    color: "#ff0000",
  });

  // Color should only change after we advance time
  jest.advanceTimersByTime(500);
  expect(component).toHaveAnimatedStyle({
    color: "rgba(186, 0, 186, 1)",
  });

  // At the end of the transition
  jest.advanceTimersByTime(501);
  expect(component).toHaveAnimatedStyle({
    color: "rgba(0, 0, 255, 1)",
  });

  // Color should not change after the transition is done
  jest.advanceTimersByTime(500);
  expect(component).toHaveAnimatedStyle({
    color: "rgba(0, 0, 255, 1)",
  });
});

test("optional transitions", async () => {
  registerCSS(
    `
    .group\\/item:active .my-class {
      color: red;
      transition: color 1s;
    }`,
    {
      grouping,
    },
  );

  render(
    <View testID={parentID} className="group/item">
      <View testID={childID} className="my-class" />
    </View>,
  );

  const parent = screen.getByTestId(parentID);
  const child = screen.getByTestId(childID);

  expect(getAnimatedStyle(child)).toStrictEqual({});

  fireEvent(parent, "pressIn");

  jest.advanceTimersByTime(0);

  expect(getAnimatedStyle(child)).toStrictEqual({
    color: "black",
  });

  jest.advanceTimersByTime(500);

  expect(getAnimatedStyle(child)).toStrictEqual({
    color: "rgba(151, 0, 0, 1)",
  });

  jest.advanceTimersByTime(500);

  expect(getAnimatedStyle(child)).toStrictEqual({
    color: "rgba(255, 0, 0, 1)",
  });

  fireEvent(parent, "pressOut");

  jest.advanceTimersByTime(0);

  expect(getAnimatedStyle(child)).toStrictEqual({
    color: "black",
  });
});
