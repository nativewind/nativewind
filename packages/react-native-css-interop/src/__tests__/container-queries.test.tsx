import { View } from "react-native";

import {
  fireEvent,
  render,
  screen,
  createMockComponent,
  registerCSS,
  resetStyles,
} from "test-utils";

const Parent = createMockComponent(View);
const Child = createMockComponent(View);

beforeEach(() => resetStyles());

test("container query width", () => {
  registerCSS(`
      .container {
        container-name: my-container;
        width: 200px;
      }

      .child {
        color: red;
      }

      @container (width > 400px) {
        .child {
          color: blue;
        }
      }
    `);

  render(
    <Parent testID="parent" className="container">
      <Child testID="child" className="child" />
    </Parent>,
  );

  const parent = screen.getByTestId("parent");
  const child = screen.getByTestId("child");

  expect(parent).toHaveStyle({
    width: 200,
  });

  expect(child).toHaveStyle({
    color: "rgba(255, 0, 0, 1)",
  });

  fireEvent(parent, "layout", {
    nativeEvent: {
      layout: {
        width: 200,
        height: 200,
      },
    },
  });

  expect(child).toHaveStyle({
    color: "rgba(255, 0, 0, 1)",
  });

  screen.rerender(
    <Parent testID="parent" className="container" style={{ width: 500 }}>
      <Child testID="child" className="child" />
    </Parent>,
  );

  fireEvent(parent, "layout", {
    nativeEvent: {
      layout: {
        width: 500,
        height: 200,
      },
    },
  });

  expect(parent).toHaveStyle({
    width: 500,
  });

  expect(child).toHaveStyle({
    color: "rgba(0, 0, 255, 1)",
  });
});
