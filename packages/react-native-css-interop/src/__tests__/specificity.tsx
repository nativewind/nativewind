import { fireEvent, render } from "@testing-library/react-native";
import { Text } from "react-native";

import {
  createMockComponent,
  createRemappedComponent,
  registerCSS,
  resetStyles,
} from "../testing-library";

const testID = "react-native-css-interop";
const A = createMockComponent(Text);

beforeEach(() => resetStyles());

test("inline styles", () => {
  registerCSS(`.red { background-color: red; }`);

  const component = render(
    <A testID={testID} className="red" style={{ backgroundColor: "blue" }} />,
  ).getByTestId(testID);

  expect(component).toHaveStyle({ backgroundColor: "blue" });
});

test("specificity order", () => {
  registerCSS(`.red { color: red; } .blue { color: blue; }`);

  const component = render(
    <A testID={testID} className="blue red" />,
  ).getByTestId(testID);

  expect(component).toHaveStyle({ color: "rgba(0, 0, 255, 1)" });
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

  expect(component).toHaveStyle({ color: "rgba(0, 0, 255, 1)" });
});

test("important - inline", () => {
  registerCSS(`
    .blue { background-color: blue !important; }
  `);

  const component = render(
    <A testID={testID} className="blue" style={{ backgroundColor: "red" }} />,
  ).getByTestId(testID);

  expect(component).toHaveStyle({ backgroundColor: "rgba(0, 0, 255, 1)" });
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

test("remapped - inline", () => {
  registerCSS(`
    .red { color: red; }
  `);

  const MyText = createRemappedComponent(
    ({ style, ...props }) => {
      return <A {...props} style={[{ color: "black" }, style]} />;
    },
    { className: "style" },
  );

  const component = render(
    <MyText testID={testID} className="red" />,
  ).getByTestId(testID);

  expect(component).toHaveStyle({ color: "rgba(255, 0, 0, 1)" });
});

test("remapped - inline overwritten", () => {
  registerCSS(`
    .red { color: red; }
  `);

  const MyText = createRemappedComponent(
    ({ style, ...props }) => {
      return <A {...props} style={[style, { color: "black" }]} />;
    },
    { className: "style" },
  );

  const component = render(
    <MyText testID={testID} className="red" />,
  ).getByTestId(testID);

  expect(component).toHaveStyle({ color: "black" });
});

test("remapped - inline important", () => {
  registerCSS(`
    .red { color: red !important; }
  `);

  const MyText = createRemappedComponent(
    ({ style, ...props }) => {
      return <A {...props} style={[style, { color: "black" }]} />;
    },
    { className: "style" },
  );

  const component = render(
    <MyText testID={testID} className="red" />,
  ).getByTestId(testID);

  expect(component).toHaveStyle({ color: "rgba(255, 0, 0, 1)" });
});

test("remapped - inline important existing", () => {
  registerCSS(`
    .red { color: red !important; }
    .blue { color: blue !important; }
  `);

  const MyText = createRemappedComponent(
    ({ style, ...props }) => {
      return (
        <A {...props} className="blue" style={[style, { color: "black" }]} />
      );
    },
    { className: "style" },
  );

  const component = render(
    <MyText testID={testID} className="red" />,
  ).getByTestId(testID);

  expect(component).toHaveStyle({ color: "rgba(0, 0, 255, 1)" });
});
