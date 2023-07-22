import { render } from "@testing-library/react-native";

import { StyleSheet } from "../runtime/native/stylesheet";
import { createMockComponent, registerCSS } from "../testing-library";

const A = createMockComponent();

afterEach(() => {
  StyleSheet.__reset();
});

test("translateX percentage", () => {
  registerCSS(`.my-class { width: 120px; transform: translateX(10%); }`);

  render(<A className="my-class" />);

  expect(A).styleToEqual({
    width: 120,
    transform: [{ translateX: 12 }],
  });
});

test("translateY percentage", () => {
  registerCSS(`.my-class { height: 120px; transform: translateY(10%); }`);

  render(<A className="my-class" />);

  expect(A).styleToEqual({
    height: 120,
    transform: [{ translateY: 12 }],
  });
});

test("rotate-180", () => {
  registerCSS(`.rotate-180 { transform: rotate(180deg); }`);

  render(<A className="rotate-180" />);

  expect(A).styleToEqual({
    transform: [{ rotate: "180deg" }],
  });
});
