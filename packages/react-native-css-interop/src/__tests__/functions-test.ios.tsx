import { render } from "@testing-library/react-native";
import { StyleSheet as RNStyleSheet, View } from "react-native";

import { StyleSheet } from "../runtime/native/stylesheet";
import { createMockComponent, registerCSS } from "../testing-library";

const testID = "react-native-css-interop";
const A = createMockComponent(View);

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

    const component = render(
      <A testID={testID} className="my-class" />,
    ).getByTestId(testID);

    expect(component).toHaveStyle({
      color: "black",
    });
  });

  test("hairlineWidth", () => {
    registerCSS(
      `.my-class {
        --test: hairlineWidth();
        width: var(--test);
      }`,
    );

    const component = render(
      <A testID={testID} className="my-class" />,
    ).getByTestId(testID);

    expect(component).toHaveStyle({
      width: RNStyleSheet.hairlineWidth,
    });
  });
});
