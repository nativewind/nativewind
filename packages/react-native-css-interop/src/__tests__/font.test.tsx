import { render } from "@testing-library/react-native";

import { StyleSheet } from "../runtime/native/stylesheet";
import { createMockComponent, registerCSS } from "../testing-library";

const A = createMockComponent();

afterEach(() => {
  StyleSheet.__reset();
});

test("heading", () => {
  registerCSS(`.my-class { 
font-size: 3rem;
line-height: 1;
}`);

  render(<A className="my-class" />);

  expect(A).styleToEqual({
    fontSize: 42,
    lineHeight: 42,
  });
});
