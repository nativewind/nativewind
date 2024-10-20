/** @jsxImportSource test */
import { View } from "react-native";

import { registerCSS, render, screen, setupAllComponents, vars } from "test";

const testID = "react-native-css-interop";
setupAllComponents();

test("vars", () => {
  registerCSS(
    `.my-class {
        color: var(--test);
      }`,
  );

  render(
    <View
      testID={testID}
      className="my-class"
      style={vars({ test: "black" })}
    />,
  );

  const component = screen.getByTestId(testID);

  expect(component).toHaveStyle({
    color: "black",
  });

  screen.rerender(
    <View
      testID={testID + 1}
      className="my-class"
      style={vars({ test: "blue" })}
    />,
  );

  expect(component).toHaveStyle({
    color: "blue",
  });
});
