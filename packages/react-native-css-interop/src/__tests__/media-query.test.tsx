/** @jsxImportSource test */
import { View } from "react-native";

import {
  act,
  screen,
  render,
  registerCSS,
  INTERNAL_SET,
  colorScheme,
  native,
  setupAllComponents,
} from "test";

const { isReduceMotionEnabled, vw } = native;

const testID = "react-native-css-interop";
setupAllComponents();

test("color scheme", () => {
  registerCSS(`
.my-class { color: blue; }

@media (prefers-color-scheme: dark) {
  .my-class { color: red; }
}`);

  render(<View testID={testID} className="my-class" />);
  const component = screen.getByTestId(testID);

  expect(component).toHaveStyle({
    color: "#0000ff",
  });

  act(() => {
    colorScheme.set("dark");
  });

  expect(component).toHaveStyle({
    color: "#ff0000",
  });
});

test("prefers-reduced-motion", () => {
  registerCSS(`
    .my-class { color: blue; }

    @media (prefers-reduced-motion) {
      .my-class { color: red; }
    }
  `);

  render(<View testID={testID} className="my-class" />);
  const component = screen.getByTestId(testID);

  expect(component).toHaveStyle({
    color: "#0000ff",
  });

  act(() => {
    isReduceMotionEnabled.set(true);
  });

  expect(component).toHaveStyle({
    color: "#ff0000",
  });
});

test("width (plain)", () => {
  registerCSS(`
.my-class { color: blue; }

@media (width: 500px) {
  .my-class { color: red; }
}`);

  render(<View testID={testID} className="my-class" />);
  const component = screen.getByTestId(testID);

  expect(component).toHaveStyle({
    color: "#0000ff",
  });

  act(() => {
    vw[INTERNAL_SET](500);
  });

  expect(component).toHaveStyle({
    color: "#ff0000",
  });
});

test("width (range)", () => {
  registerCSS(`
.my-class { color: blue; }

@media (width = 500px) {
  .my-class { color: red; }
}`);

  render(<View testID={testID} className="my-class" />);
  const component = screen.getByTestId(testID);

  expect(component).toHaveStyle({
    color: "#0000ff",
  });

  act(() => {
    vw[INTERNAL_SET](500);
  });

  expect(component).toHaveStyle({
    color: "#ff0000",
  });
});

test("min-width", () => {
  registerCSS(`
.my-class { color: blue; }

@media (min-width: 500px) {
  .my-class { color: red; }
}`);

  render(<View testID={testID} className="my-class" />);
  const component = screen.getByTestId(testID);

  expect(component).toHaveStyle({
    color: "#ff0000",
  });

  act(() => {
    vw[INTERNAL_SET](300);
  });

  expect(component).toHaveStyle({
    color: "#0000ff",
  });
});

test("max-width", () => {
  registerCSS(`
.my-class { color: blue; }

@media (max-width: 500px) {
  .my-class { color: red; }
}`);

  render(<View testID={testID} className="my-class" />);
  const component = screen.getByTestId(testID);

  expect(component).toHaveStyle({
    color: "#0000ff",
  });

  act(() => {
    vw[INTERNAL_SET](300);
  });

  expect(component).toHaveStyle({
    color: "#ff0000",
  });
});

test("not all", () => {
  // This reads not (all and min-width: 640px)
  // It is the same as max-width: 639px
  registerCSS(`
@media not all and (min-width: 640px) {
  .my-class { color: red; }
}`);
  // Make larger than 640
  act(() => vw[INTERNAL_SET](1000));

  render(<View testID={testID} className="my-class" />);
  const component = screen.getByTestId(testID);

  expect(component).toHaveStyle(undefined);

  // Make smaller than 640
  act(() => vw[INTERNAL_SET](300));

  expect(component).toHaveStyle({
    color: "#ff0000",
  });
});
