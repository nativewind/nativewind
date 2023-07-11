import { act, render } from "@testing-library/react-native";

import {
  INTERNAL_SET,
  colorScheme,
  isReduceMotionEnabled,
  vw,
} from "../runtime/native/globals";
import { StyleSheet } from "../runtime/native/stylesheet";
import { createMockComponent, registerCSS } from "../testing-library";

const A = createMockComponent();

beforeEach(() => {
  StyleSheet.__reset();
});

test("color scheme", () => {
  registerCSS(`
.my-class { color: blue; }

@media (prefers-color-scheme: dark) {
  .my-class { color: red; }
}`);

  render(<A className="my-class" />);

  expect(A).styleToEqual({
    color: "rgba(0, 0, 255, 1)",
  });

  act(() => {
    colorScheme.set("dark");
  });

  expect(A).styleToEqual({
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

  render(<A className="my-class" />);

  expect(A).styleToEqual({
    color: "rgba(0, 0, 255, 1)",
  });

  act(() => {
    isReduceMotionEnabled.set(true);
  });

  expect(A).styleToEqual({
    color: "rgba(255, 0, 0, 1)",
  });
});

test("width (plain)", () => {
  registerCSS(`
.my-class { color: blue; }

@media (width: 500px) {
  .my-class { color: red; }
}`);

  render(<A className="my-class" />);

  expect(A).styleToEqual({
    color: "rgba(0, 0, 255, 1)",
  });

  act(() => {
    vw[INTERNAL_SET](500);
  });

  expect(A).styleToEqual({
    color: "rgba(255, 0, 0, 1)",
  });
});

test("width (range)", () => {
  registerCSS(`
.my-class { color: blue; }

@media (width = 500px) {
  .my-class { color: red; }
}`);

  render(<A className="my-class" />);

  expect(A).styleToEqual({
    color: "rgba(0, 0, 255, 1)",
  });

  act(() => {
    vw[INTERNAL_SET](500);
  });

  expect(A).styleToEqual({
    color: "rgba(255, 0, 0, 1)",
  });
});

test("min-width", () => {
  registerCSS(`
.my-class { color: blue; }

@media (min-width: 500px) {
  .my-class { color: red; }
}`);

  render(<A className="my-class" />);

  expect(A).styleToEqual({
    color: "rgba(255, 0, 0, 1)",
  });

  act(() => {
    vw[INTERNAL_SET](300);
  });

  expect(A).styleToEqual({
    color: "rgba(0, 0, 255, 1)",
  });
});

test("max-width", () => {
  registerCSS(`
.my-class { color: blue; }

@media (max-width: 500px) {
  .my-class { color: red; }
}`);

  render(<A className="my-class" />);

  expect(A).styleToEqual({
    color: "rgba(0, 0, 255, 1)",
  });

  act(() => {
    vw[INTERNAL_SET](300);
  });

  expect(A).styleToEqual({
    color: "rgba(255, 0, 0, 1)",
  });
});
