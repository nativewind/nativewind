import { View } from "react-native";

import {
  fireEvent,
  render,
  screen,
  createMockComponent,
  registerCSS,
  resetStyles,
} from "test-utils";

beforeEach(() => resetStyles());

const grouping = ["^group(/.*)?"];
const testID = "child";

test("group", async () => {
  const A = createMockComponent(View);
  const B = createMockComponent(View);

  registerCSS(
    `.group\\/item .my-class {
      color: red;
    }`,
    {
      grouping,
    },
  );

  const { rerender, getByTestId } = render(
    <A className="group/item">
      <B testID={testID} className="my-class" />
    </A>,
  );

  expect(getByTestId(testID)).toHaveStyle({ color: "rgba(255, 0, 0, 1)" });

  rerender(
    <A>
      <B testID={testID} className="my-class" />
    </A>,
  );

  expect(getByTestId(testID)).toHaveStyle(undefined);
});

test("group - active", async () => {
  const A = createMockComponent(View);
  const B = createMockComponent(View);

  const parentID = "parent";
  const childID = "child";

  registerCSS(
    `.group\\/item:active .my-class {
      color: red;
    }`,
    {
      grouping,
    },
  );

  render(
    <A testID={parentID} className="group/item">
      <B testID={childID} className="my-class" />
    </A>,
  );

  const parent = screen.getByTestId(parentID);
  const child = screen.getByTestId(childID);

  expect(child).toHaveStyle(undefined);

  fireEvent(parent, "pressIn");

  expect(child).toHaveStyle({ color: "rgba(255, 0, 0, 1)" });
});

test("invalid group", async () => {
  const A = createMockComponent(View);
  const B = createMockComponent(View);

  const testID = "b";

  registerCSS(
    `.invalid .my-class {
      color: red;
    }`,
    {
      grouping,
    },
  );

  const { rerender } = render(<B testID={testID} className="my-class" />);
  const componentB = screen.findAllByTestId(testID);

  expect(componentB).toHaveStyle(undefined);

  rerender(
    <A testID="A" className="invalid">
      <B testID={testID} className="my-class" />
    </A>,
  );

  expect(componentB).toHaveStyle(undefined);
});

test.only("group selector", async () => {
  const A = createMockComponent(View);
  const B = createMockComponent(View);

  registerCSS(
    `.group.test .my-class {
      color: red;
    }`,
    {
      grouping,
    },
  );

  const { rerender, getByTestId } = render(
    <A className="group test">
      <B testID={testID} className="my-class" />
    </A>,
  );

  expect(getByTestId(testID)).toHaveStyle({ color: "rgba(255, 0, 0, 1)" });

  rerender(
    <A>
      <B testID={testID} className="my-class" />
    </A>,
  );

  expect(getByTestId(testID)).toHaveStyle(undefined);
});
