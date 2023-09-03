import { render, screen } from "@testing-library/react-native";
import { View } from "react-native";

import {
  createMockComponent,
  registerCSS,
  resetStyles,
} from "../testing-library";

beforeEach(() => resetStyles());

test("group", async () => {
  const A = createMockComponent(View);
  const B = createMockComponent(View);

  const testID = "a";

  registerCSS(
    `.group\\/item .my-class {
      color: red;
    }`,
    {
      grouping: ["^group\\/.*"],
    },
  );

  const { rerender, getByTestId } = render(
    <A>
      <B testID={testID} className="my-class" />
    </A>,
  );

  expect(getByTestId(testID)).toHaveStyle({});

  rerender(
    <A className="group/item">
      <B testID={testID} className="my-class" />
    </A>,
  );

  expect(getByTestId(testID)).toHaveStyle({ color: "rgba(255, 0, 0, 1)" });
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
      grouping: ["^group\\/.*"],
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
