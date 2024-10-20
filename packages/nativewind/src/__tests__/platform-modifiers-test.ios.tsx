/** @jsxImportSource nativewind */
import { View } from "react-native";

import { screen } from "@testing-library/react-native";

import { render } from "../test";

const testID = "react-native-css-interop";

test("platformModifiers: ios", async () => {
  await render(
    <View
      testID={testID}
      className="ios:text-white android:text-black web:text-red-500"
    />,
  );

  const component = screen.getByTestId(testID);

  expect(component).toHaveStyle({ color: "#ffffff" });
});

test("platformModifiers: ios native", async () => {
  await render(
    <View
      testID={testID}
      className="ios:text-white native:text-black web:text-red-500"
    />,
  );

  const component = screen.getByTestId(testID);

  expect(component).toHaveStyle({ color: "#000000" });
});
