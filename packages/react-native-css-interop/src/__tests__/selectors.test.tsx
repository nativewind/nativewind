/** @jsxImportSource test */
import { View } from "react-native";

import {
  act,
  colorScheme,
  registerCSS,
  render,
  screen,
  setupAllComponents,
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

  expect(component).toHaveStyle({ color: "#ff0000" });
});

test(':root[class="dark"]', () => {
  registerCSS(`@cssInterop set darkMode class dark;
:root[class="dark"] {
  --my-var: red;
}
.my-class { 
  color: var(--my-var); 
}`);

  render(<View testID={testID} className="my-class" />);

  const component = screen.getByTestId(testID);

  expect(component).toHaveStyle({ color: undefined });

  act(() => colorScheme.set("dark"));

  expect(component).toHaveStyle({ color: "red" });
});

test(':root[class~="dark"]', () => {
  registerCSS(`@cssInterop set darkMode class dark;
:root[class~="dark"] {
  --my-var: red;
}
.my-class { 
  color: var(--my-var); 
}`);

  render(<View testID={testID} className="my-class" />);

  const component = screen.getByTestId(testID);

  expect(component).toHaveStyle({ color: undefined });

  act(() => colorScheme.set("dark"));

  expect(component).toHaveStyle({ color: "red" });
});
