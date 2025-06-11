/** @jsxImportSource test */
import { View } from "react-native";

import {
  fireEvent,
  registerCSS,
  render,
  screen,
  setupAllComponents,
} from "test";

const parentID = "parent";
const childID = "child";
setupAllComponents();

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
    <View testID={parentID} className="container">
      <View testID={childID} className="child" />
    </View>,
  );

  const parent = screen.getByTestId(parentID);
  const child = screen.getByTestId(childID);

  expect(parent).toHaveStyle({
    width: 200,
  });

  expect(child).toHaveStyle({
    color: "#ff0000",
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
    color: "#ff0000",
  });

  screen.rerender(
    <View testID={parentID} className="container" style={{ width: 500 }}>
      <View testID={childID} className="child" />
    </View>,
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
    color: "#0000ff",
  });
});
