import { fireEvent, screen } from "@testing-library/react-native";
import { View } from "react-native-css/components";

import { render } from "../test-utils";

const parentID = "parent";
const childID = "child";

test("Unnamed containers", async () => {
  await render(
    <View testID={parentID} className="@container">
      <View testID={childID} className="@sm:text-white" />
    </View>,
  );

  let parent = screen.getByTestId(parentID);
  let child = screen.getByTestId(childID);

  expect(child).toHaveStyle(undefined);

  // Jest does not fire layout events, so we need to manually
  fireEvent(parent, "layout", {
    nativeEvent: {
      layout: {
        width: 500,
        height: 200,
      },
    },
  });

  expect(child).toHaveStyle({ color: "#fff" });
});

test("Named containers", async () => {
  await render(
    <View testID={parentID} className="@container/main">
      <View testID={childID} className="@sm/main:text-white" />
    </View>,
  );

  let parent = screen.getByTestId(parentID);
  let child = screen.getByTestId(childID);

  expect(child).toHaveStyle(undefined);

  // Jest does not fire layout events, so we need to manually
  fireEvent(parent, "layout", {
    nativeEvent: {
      layout: {
        width: 500,
        height: 200,
      },
    },
  });

  expect(child).toHaveStyle({ color: "#fff" });
});
