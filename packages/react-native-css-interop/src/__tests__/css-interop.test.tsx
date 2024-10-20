/** @jsxImportSource test */
import { View } from "react-native";

import { cssInterop, registerCSS, render, resetComponents, screen } from "test";

const testID = "react-native-css-interop";

beforeEach(() => {
  resetComponents();
});

test("mapping", () => {
  cssInterop(View as any, { className: "differentStyle" });

  registerCSS(
    `.bg-black { background-color: black } .text-white { color: white }`,
  );

  render(<View testID={testID} className="bg-black text-white" />);

  const component = screen.getByTestId(testID);

  expect(component.props).toEqual({
    testID,
    differentStyle: {
      backgroundColor: "#000000",
      color: "#ffffff",
    },
  });
});

test("multiple mapping", () => {
  cssInterop(View as any, { a: "styleA", b: "styleB" });

  registerCSS(
    `.bg-black { background-color: black } .text-white { color: white }`,
  );

  render(<View testID={testID} {...{ a: "bg-black", b: "text-white" }} />);

  const component = screen.getByTestId(testID);

  expect(component.props).toEqual({
    testID,
    styleA: {
      backgroundColor: "#000000",
    },
    styleB: {
      color: "#ffffff",
    },
  });
});
