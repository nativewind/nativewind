import { screen } from "@testing-library/react-native";
import { View } from "react-native-css/components";

import { render } from "../test-utils";

const testID = "react-native-css-interop";

test("platformModifiers: ios", async () => {
  await render(
    <View
      testID={testID}
      className="ios:text-white android:text-black web:text-red-500"
    />,
  );

  const component = screen.getByTestId(testID);

  expect(component).toHaveStyle({ color: "#fff" });
});

test("platformModifiers: ios native", async () => {
  await render(
    <View
      testID={testID}
      className="ios:text-white native:text-black web:text-red-500"
    />,
  );

  const component = screen.getByTestId(testID);

  expect(component).toHaveStyle({ color: "#000" });
});
