/** @jsxImportSource test */
import { View } from "react-native";

import { registerCSS, screen, render, setupAllComponents } from "test";

const testID = "react-native-css-interop";
setupAllComponents();

describe("filter", () => {
  test("brightness", () => {
    registerCSS(`.my-class { filter: brightness(0.4); }`);

    render(<View testID={testID} className="my-class" />);
    const component = screen.getByTestId(testID);

    expect(component).toHaveStyle({
      filter: [{ brightness: 0.4 }],
    });
  });
});
