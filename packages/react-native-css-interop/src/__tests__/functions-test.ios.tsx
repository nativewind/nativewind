import { render } from "@testing-library/react-native";

import { StyleSheet } from "../runtime/native/stylesheet";
import { createMockComponent, registerCSS } from "../testing-library";

const A = createMockComponent();

afterEach(() => {
  StyleSheet.__reset();
});

describe.skip("functions - ios", () => {
  test("platformSelect", () => {
    registerCSS(
      `.my-class { color: platformSelect(ios/red android/blue default/green); }`,
    );

    render(<A className="my-class" />);

    expect(A).styleToEqual({ color: "rgba(255, 0, 0, 1)" });
  });
});
