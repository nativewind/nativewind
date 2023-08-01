import { render } from "@testing-library/react-native";
import { StyleSheet as RNStyleSheet, View } from "react-native";

import {
  createMockComponent,
  registerCSS,
  resetStyles,
} from "../testing-library";

const testID = "react-native-css-interop";
const A = createMockComponent(View);

beforeEach(() => resetStyles());

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
