import { act, render } from "@testing-library/react-native";

import {
  colorScheme,
  isReduceMotionEnabled,
  vw,
} from "../runtime/native/globals";
import {
  createMockComponent,
  registerCSS,
  resetStyles,
} from "../testing-library";
import { INTERNAL_SET } from "../shared";
import { View } from "react-native";

const testID = "react-native-css-interop";
const A = createMockComponent(View);

beforeEach(() => resetStyles());

test("color scheme", () => {
  registerCSS(`
.my-class { color: blue; }

@media (prefers-color-scheme: dark) {
  .my-class { color: red; }
}`);

  const component = render(
    <A testID={testID} className="my-class" />,
  ).getByTestId(testID);

  expect(component).toHaveStyle({
    color: "rgba(0, 0, 255, 1)",
  });

  act(() => {
    colorScheme.set("dark");
  });

  expect(component).toHaveStyle({
    color: "rgba(255, 0, 0, 1)",
  });
});

test("prefers-reduced-motion", () => {
  registerCSS(`
    .my-class { color: blue; }

    @media (prefers-reduced-motion) {
      .my-class { color: red; }
    }
  `);

  const component = render(
    <A testID={testID} className="my-class" />,
  ).getByTestId(testID);

  expect(component).toHaveStyle({
    color: "rgba(0, 0, 255, 1)",
  });

  act(() => {
    isReduceMotionEnabled.set(true);
  });

  expect(component).toHaveStyle({
    color: "rgba(255, 0, 0, 1)",
  });
});

test("width (plain)", () => {
  registerCSS(`
.my-class { color: blue; }

@media (width: 500px) {
  .my-class { color: red; }
}`);

  const component = render(
    <A testID={testID} className="my-class" />,
  ).getByTestId(testID);

  expect(component).toHaveStyle({
    color: "rgba(0, 0, 255, 1)",
  });

  act(() => {
    vw[INTERNAL_SET](500);
  });

  expect(component).toHaveStyle({
    color: "rgba(255, 0, 0, 1)",
  });
});

test("width (range)", () => {
  registerCSS(`
.my-class { color: blue; }

@media (width = 500px) {
  .my-class { color: red; }
}`);

  const component = render(
    <A testID={testID} className="my-class" />,
  ).getByTestId(testID);

  expect(component).toHaveStyle({
    color: "rgba(0, 0, 255, 1)",
  });

  act(() => {
    vw[INTERNAL_SET](500);
  });

  expect(component).toHaveStyle({
    color: "rgba(255, 0, 0, 1)",
  });
});

test("min-width", () => {
  registerCSS(`
.my-class { color: blue; }

@media (min-width: 500px) {
  .my-class { color: red; }
}`);

  const component = render(
    <A testID={testID} className="my-class" />,
  ).getByTestId(testID);

  expect(component).toHaveStyle({
    color: "rgba(255, 0, 0, 1)",
  });

  act(() => {
    vw[INTERNAL_SET](300);
  });

  expect(component).toHaveStyle({
    color: "rgba(0, 0, 255, 1)",
  });
});

test("max-width", () => {
  registerCSS(`
.my-class { color: blue; }

@media (max-width: 500px) {
  .my-class { color: red; }
}`);

  const component = render(
    <A testID={testID} className="my-class" />,
  ).getByTestId(testID);

  expect(component).toHaveStyle({
    color: "rgba(0, 0, 255, 1)",
  });

  act(() => {
    vw[INTERNAL_SET](300);
  });

  expect(component).toHaveStyle({
    color: "rgba(255, 0, 0, 1)",
  });
});
