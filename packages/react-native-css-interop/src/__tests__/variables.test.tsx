import { render, screen } from "@testing-library/react-native";
import { View } from "react-native";

import {
  createMockComponent,
  registerCSS,
  resetStyles,
} from "../testing-library";
import { memo } from "react";
import { useUnstableNativeVariable } from "../runtime/api";

const testID = "react-native-css-interop";
const A = createMockComponent(View);

beforeEach(() => resetStyles());

test("inline variable", () => {
  registerCSS(`.my-class { width: var(--my-var); --my-var: 10px; }`);

  const component = render(
    <A testID={testID} className="my-class" />,
  ).getByTestId(testID);

  expect(component).toHaveStyle({
    width: 10,
  });
});

test("combined inline variable", () => {
  registerCSS(`
    .my-class-1 { width: var(--my-var); }
    .my-class-2 { --my-var: 10px; }
    .my-class-3 { --my-var: 20px; }
  `);

  const component = render(
    <A testID={testID} className="my-class-1 my-class-2" />,
  ).getByTestId(testID);

  expect(component).toHaveStyle({
    width: 10,
  });

  // Prove that the order doesn't matter
  screen.rerender(<A className="my-class-3 my-class-1" />);

  expect(component).toHaveStyle({
    width: 20,
  });
});

test("inherit variables", () => {
  const B = createMockComponent(View);

  registerCSS(`
    .my-class-1 { width: var(--my-var); }
    .my-class-2 { --my-var: 10px; }
    .my-class-3 { --my-var: 20px; }
  `);

  const { getByTestId } = render(
    <A testID="a" className="my-class-2">
      <B testID="b" className="my-class-1" />
    </A>,
  );

  const a = getByTestId("a");
  let b = getByTestId("b");

  expect(a).toHaveStyle(undefined);
  expect(b).toHaveStyle({ width: 10 });
  expect(B.mock).toHaveBeenCalledTimes(1);

  screen.rerender(
    <A testID="a" className="my-class-3">
      <B testID="b" className="my-class-1" />
    </A>,
  );

  b = getByTestId("b");

  expect(B.mock).toHaveBeenCalledTimes(2);
  expect(a).toHaveStyle(undefined);
  expect(b).toHaveStyle({ width: 20 });
});

test("inherit variables - memo", () => {
  const B = memo(createMockComponent(View));

  registerCSS(`
    .my-class-1 { width: var(--my-var); }
    .my-class-2 { --my-var: 10px; }
    .my-class-3 { --my-var: 20px; }
  `);

  const { getByTestId } = render(
    <A testID="a" className="my-class-2">
      <B testID="b" className="my-class-1" />
    </A>,
  );

  const a = getByTestId("a");
  let b = getByTestId("b");

  expect(a).toHaveStyle(undefined);
  expect(b).toHaveStyle({ width: 10 });

  screen.rerender(
    <A testID="a" className="my-class-3">
      <B testID="b" className="my-class-1" />
    </A>,
  );

  b = getByTestId("b");

  expect(a).toHaveStyle(undefined);
  expect(b).toHaveStyle({ width: 20 });
});

test(":root variables", () => {
  registerCSS(`
    :root { --my-var: red; }
    .my-class { color: var(--my-var); }
  `);

  const component = render(
    <A testID={testID} className="my-class" />,
  ).getByTestId(testID);

  expect(component).toHaveStyle({ color: "red" });
});

test("useUnsafeVariable", () => {
  registerCSS(`
    :root { --my-var: red; }
  `);

  let myVar;

  const Component = () => {
    myVar = useUnstableNativeVariable("--my-var");
    return null;
  };

  render(<Component />);

  expect(myVar).toEqual("red");
});
