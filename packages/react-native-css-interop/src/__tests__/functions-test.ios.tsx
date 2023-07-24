import { render } from "@testing-library/react-native";

import { StyleSheet } from "../runtime/native/stylesheet";
import { createMockComponent, registerCSS } from "../testing-library";

const A = createMockComponent();

afterEach(() => {
  StyleSheet.__reset();
});

describe("functions - ios", () => {
  test("platformSelect", () => {
    registerCSS(
      `.my-class {
        --test: black;
        color: green;
        color: platformSelect(ios/var(--test), android/blue);
      }`,
    );

    render(<A className="my-class" />);

    expect(A).styleToEqual({ color: "black" });
  });
});
