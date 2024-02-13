import { View } from "react-native";
import { createMockComponent, renderTailwind } from "../test-utils";
import { fireEvent, screen } from "@testing-library/react-native";
import { resetStyles } from "react-native-css-interop/testing-library";

const Grandparent = createMockComponent(View);
const Parent = createMockComponent(View);
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
  const child = screen.getByTestId(childID);

  expect(parent).toHaveStyle(undefined);
  expect(child).toHaveStyle(undefined);

  fireEvent(parent, "hoverIn");

  expect(child).toHaveStyle({ color: "rgba(255, 255, 255, 1)" });
});

test("Differentiating nested groups", async () => {
  await renderTailwind(
    <Grandparent testID={grandparentID} className="group/grandparent">
      <Parent testID={parentID} className="group/parent">
        <Child className="group-hover/grandparent:text-white" />
        <Child testID={childID} className="group-hover/parent:text-white" />
      </Parent>
    </Grandparent>,
  );

  const grandparent = screen.getByTestId(grandparentID);
  const parent = screen.getByTestId(parentID);
  const child = screen.getByTestId(childID);

  expect(grandparent).toHaveStyle(undefined);
  expect(parent).toHaveStyle(undefined);
  expect(child).toHaveStyle(undefined);

  fireEvent(grandparent, "hoverIn");

  expect(child).toHaveStyle(undefined);

  fireEvent(parent, "hoverIn");

  expect(child).toHaveStyle({ color: "rgba(255, 255, 255, 1)" });
});

test("arbitrary groups - single className", async () => {
  const { rerender } = await renderTailwind(
    <Parent testID={parentID} className="group">
      <Child testID={childID} className="group-[.test]:text-white" />
    </Parent>,
  );

  const parent = screen.getByTestId(parentID);
  const child = screen.getByTestId(childID);

  expect(parent).toHaveStyle(undefined);
  expect(child).toHaveStyle(undefined);

  await rerender(
    <Parent testID={parentID} className="group test">
      <Child testID={childID} className="group-[.test]:text-white" />
    </Parent>,
  );

  expect(child).toHaveStyle({ color: "rgba(255, 255, 255, 1)" });
});

test("arbitrary groups - multiple className", async () => {
  const { rerender } = await renderTailwind(
    <Parent testID={parentID} className="group">
      <Child testID={childID} className="group-[.test.test2]:text-white" />
    </Parent>,
  );

  const parent = screen.getByTestId(parentID);
  const child = screen.getByTestId(childID);

  expect(parent).toHaveStyle(undefined);
  expect(child).toHaveStyle(undefined);

  await rerender(
    <Parent testID={parentID} className="group test">
      <Child testID={childID} className="group-[.test.test2]:text-white" />
    </Parent>,
  );

  expect(parent).toHaveStyle(undefined);
  expect(child).toHaveStyle(undefined);

  await rerender(
    <Parent testID={parentID} className="group test test2">
      <Child testID={childID} className="group-[.test.test2]:text-white" />
    </Parent>,
  );

  expect(child).toHaveStyle({ color: "rgba(255, 255, 255, 1)" });
});

test("arbitrary groups - props", async () => {
  const { rerender } = await renderTailwind(
    <Parent testID={parentID} className="group" accessibilityLabel="test">
      <Child
        testID={childID}
        className="group-[[accessibilityLabel=works]]:text-white"
      />
    </Parent>,
  );

  const parent = screen.getByTestId(parentID);
  const child = screen.getByTestId(childID);

  expect(parent).toHaveStyle(undefined);
  expect(child).toHaveStyle(undefined);

  await rerender(
    <Parent testID={parentID} className="group" accessibilityLabel="works">
      <Child
        testID={childID}
        className="group-[[accessibilityLabel=works]]:text-white"
      />
    </Parent>,
  );

  expect(child).toHaveStyle({ color: "rgba(255, 255, 255, 1)" });
});
