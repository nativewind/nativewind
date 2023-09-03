import { fireEvent, render } from "@testing-library/react-native";
import { View } from "react-native";

import {
  createMockComponent,
  registerCSS,
  resetStyles,
} from "../testing-library";

const testID = "react-native-css-interop";
const A = createMockComponent(View);

beforeEach(() => resetStyles());

test("inline styles", () => {
  registerCSS(`.red { background-color: red; }`);

  const component = render(
    <A testID={testID} className="red" style={{ backgroundColor: "blue" }} />,
  ).getByTestId(testID);

  // RN merges styles RTL, so we need to make sure the array is in
  // Ascending specificity order
  expect(component).toHaveStyle([
    { backgroundColor: "rgba(255, 0, 0, 1)" },
    { backgroundColor: "blue" }, // .blue
  ]);
});

test("specificity order", () => {
  registerCSS(`.red { color: red; } .blue { color: blue; }`);

  const component = render(
    <A testID={testID} className="blue red" />,
  ).getByTestId(testID);

  // RN merges styles RTL, so we need to make sure the array is in
  // Ascending specificity order
  expect(component).toHaveStyle([
    { color: "rgba(255, 0, 0, 1)" }, // .red
    { color: "rgba(0, 0, 255, 1)" }, // .blue
  ]);
});

test("specificity modifiers", () => {
  registerCSS(
    `.redOrGreen:hover { color: green; } .redOrGreen { color: red; } .blue { color: blue; }`,
  );

  const component = render(
    <A testID={testID} className="blue redOrGreen " />,
  ).getByTestId(testID);

  expect(component).toHaveStyle(
    { color: "rgba(0, 0, 255, 1)" }, // .blue
  );

  fireEvent(component, "hoverIn");

  expect(component).toHaveStyle({ color: "rgba(0, 128, 0, 1)" }); // Green
});

test("important - no wrapper", () => {
  registerCSS(`
    .red { color: red; }
    .blue { color: blue !important; }
  `);

  const component = render(
    <A testID={testID} className="blue red" />,
  ).getByTestId(testID);

  expect(component).toHaveStyle([
    { color: "rgba(255, 0, 0, 1)" }, // Red
    { color: "rgba(0, 0, 255, 1)" }, // Blue
  ]);
});

test("important - modifiers", () => {
  registerCSS(`
    .red { color: red; }
    .red:hover { color: green; }
    .blue { color: blue !important; }
  `);

  const component = render(
    <A testID={testID} className="blue red" />,
  ).getByTestId(testID);

  expect(component).toHaveStyle(
    { color: "rgba(0, 0, 255, 1)" }, // Blue
  );

  fireEvent(component, "hoverIn");

  expect(component).toHaveStyle(
    { color: "rgba(0, 0, 255, 1)" }, // Blue
  );
});
