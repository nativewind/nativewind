import { View } from "react-native";
import { render, screen } from "@testing-library/react-native";

import {
  createMockComponent,
  registerCSS,
  resetComponents,
  resetStyles,
} from "../testing-library";

const testID = "react-native-css-interop";

beforeEach(() => {
  resetStyles();
  resetComponents();
});

test.only("mapping", () => {
  // @ts-expect-error - `differentStyle` is not a valid prop
  const A = createMockComponent(View, { className: "differentStyle" });

  registerCSS(
    `.bg-black { background-color: black } .text-white { color: white }`,
  );

  render(<A testID={testID} className="bg-black text-white" />);

  const component = screen.getByTestId(testID);

  expect(component.props).toEqual({
    testID,
    differentStyle: {
      backgroundColor: "rgba(0, 0, 0, 1)",
      color: "rgba(255, 255, 255, 1)",
    },
  });
});

test("multiple mapping", () => {
  // @ts-expect-error - `differentStyle` is not a valid prop
  const A = createMockComponent(View, { a: "styleA", b: "styleB" });

  registerCSS(
    `.bg-black { background-color: black } .text-white { color: white }`,
  );

  render(<A testID={testID} a="bg-black" b="text-white" />);

  const component = screen.getByTestId(testID);

  expect(component.props).toEqual({
    testID,
    styleA: {
      backgroundColor: "rgba(0, 0, 0, 1)",
    },
    styleB: {
      color: "rgba(255, 255, 255, 1)",
    },
  });
});
