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
const parentID = "parent";
const childID = "child";
setupAllComponents();

jest.useFakeTimers();

test("group", async () => {
  registerCSS(
    `.group\\/item .my-class {
      color: red;
    }`,
    {
      grouping,
    },
  );

  const { rerender, getByTestId } = render(
    <View testID={parentID} className="group/item">
      <View testID={childID} className="my-class" />
    </View>,
  );

  expect(getByTestId(childID)).toHaveStyle({ color: "#ff0000" });

  rerender(
    <View testID={parentID}>
      <View testID={childID} className="my-class" />
    </View>,
  );

  expect(getByTestId(childID)).toHaveStyle(undefined);
});

test("group - active", async () => {
  registerCSS(
    `.group\\/item:active .my-class {
      color: red;
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

  expect(child).toHaveStyle(undefined);

  fireEvent(parent, "pressIn");

  expect(child).toHaveStyle({ color: "#ff0000" });
});

test("group - active (animated)", async () => {
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
});

test("invalid group", async () => {
  registerCSS(
    `.invalid .my-class {
      color: red;
    }`,
    {
      grouping,
    },
  );

  const { rerender } = render(<View testID={childID} className="my-class" />);
  const componentB = screen.findAllByTestId(childID);

  expect(componentB).toHaveStyle(undefined);

  rerender(
    <View testID={parentID} className="invalid">
      <View testID={childID} className="my-class" />
    </View>,
  );

  expect(componentB).toHaveStyle(undefined);
});

test("group selector", async () => {
  registerCSS(
    `.group.test .my-class {
      color: red;
    }`,
    {
      grouping,
    },
  );

  const { rerender, getByTestId } = render(
    <View className="group test">
      <View testID={childID} className="my-class" />
    </View>,
  );

  expect(getByTestId(childID)).toHaveStyle({ color: "#ff0000" });

  rerender(
    <View>
      <View testID={childID} className="my-class" />
    </View>,
  );

  expect(getByTestId(childID)).toHaveStyle(undefined);
});
