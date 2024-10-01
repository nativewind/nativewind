/** @jsxImportSource test */
import { View } from "react-native";

import {
  render,
  registerCSS,
  setupAllComponents,
  screen,
  colorScheme,
  act,
} from "test";

const testID = "react-native-css-interop";
setupAllComponents();

test(":is(.dark *)", () => {
  registerCSS(`@cssInterop set darkMode class dark;
.my-class:is(.dark *) { color: red; }`);

  render(<View testID={testID} className="my-class" />);

  const component = screen.getByTestId(testID);

  expect(component).toHaveStyle(undefined);

  act(() => colorScheme.set("dark"));

  expect(component).toHaveStyle({ color: "rgba(255, 0, 0, 1)" });
});
