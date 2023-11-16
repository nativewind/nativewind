import { View } from "react-native";
import { createMockComponent, renderTailwind } from "../test-utils";
import { resetStyles } from "react-native-css-interop/testing-library";
import { fireEvent, screen } from "@testing-library/react-native";

const A = createMockComponent(View);
const parentID = "parent";
const childID = "child";

beforeEach(() => resetStyles());

test("Unnamed containers", async () => {
  await renderTailwind(
    <A testID={parentID} className="@container">
      <A testID={childID} className="@sm:text-white" />
    </A>,
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

  expect(child).toHaveStyle({ color: "rgba(255, 255, 255, 1)" });
});

test("Named containers", async () => {
  await renderTailwind(
    <A testID={parentID} className="@container/main">
      <A testID={childID} className="@sm/main:text-white" />
    </A>,
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

  expect(child).toHaveStyle({ color: "rgba(255, 255, 255, 1)" });
});
