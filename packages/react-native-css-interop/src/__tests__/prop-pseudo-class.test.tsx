import { render } from "@testing-library/react-native";

import { StyleSheet } from "../runtime/native/stylesheet";
import { createMockComponent, registerCSS } from "../testing-library";

const A = createMockComponent();

beforeEach(() => {
  StyleSheet.__reset();
});

test(":rn-prop(<prop>, <attribute>)", () => {
  registerCSS(`.my-class:rn-prop(test,color) { color: blue; }
`);

  render(<A className="my-class" />);

  expect(A).lastCalledWith(
    expect.objectContaining({ test: "rgba(0, 0, 255, 1)" }),
    null,
  );
});
