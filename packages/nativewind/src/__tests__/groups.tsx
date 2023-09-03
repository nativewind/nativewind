import { View, Pressable } from "react-native";
import { createMockComponent, renderTailwind } from "../test-utils";
import { fireEvent, screen } from "@testing-library/react-native";
import { resetStyles } from "react-native-css-interop/testing-library";

const Grandparent = createMockComponent(Pressable);
const Parent = createMockComponent(Pressable);
const Child = createMockComponent(View);
const grandparentID = "grandparentID";
const parentID = "parent";
const childID = "child";

beforeEach(() => resetStyles());

test("Styling based on parent state (group-{modifier})", async () => {
  await renderTailwind(
    <Parent testID={parentID} className="group">
      <Child testID={childID} className="group-hover:text-white" />
    </Parent>,
  );

  const parent = screen.getByTestId(parentID);
  let child = screen.getByTestId(childID);

  expect(parent).toHaveStyle({});
  expect(child).toHaveStyle({});

  fireEvent(parent, "hoverIn");

  expect(child).toHaveStyle({ color: "rgba(255, 255, 255, 1)" });
});

test("Differentiating nested groups", async () => {
  await renderTailwind(
    <Grandparent testID={grandparentID} className="group/grandparent">
      <Parent testID={parentID} className="group/parent">
        {/* Make sure grandparent styles are generated */}
        <Child className="group-hover/grandparent:text-white" />
        <Child testID={childID} className="group-hover/parent:text-white" />
      </Parent>
    </Grandparent>,
  );

  const grandparent = screen.getByTestId(grandparentID);
  const parent = screen.getByTestId(parentID);
  const child = screen.getByTestId(childID);

  expect(grandparent).toHaveStyle({});
  expect(parent).toHaveStyle({});
  expect(child).toHaveStyle({});

  fireEvent(grandparent, "hoverIn");

  expect(child).toHaveStyle({});

  fireEvent(parent, "hoverIn");

  expect(child).toHaveStyle({ color: "rgba(255, 255, 255, 1)" });
});
