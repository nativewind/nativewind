import { View } from "react-native";
import { createMockComponent, renderTailwind } from "../test-utils";
import { screen } from "@testing-library/react-native";
import { resetStyles } from "react-native-css-interop/testing-library";

const testID = "react-native-css-interop";
const A = createMockComponent(View);

beforeEach(() => resetStyles());

test("platformModifiers: ios", async () => {
  await renderTailwind(
    <A
      testID={testID}
      className="ios:text-white android:text-black web:text-red-500"
    />,
  );

  const component = screen.getByTestId(testID);

  expect(component).toHaveStyle({ color: "rgba(255, 255, 255, 1)" });
});

test("platformModifiers: ios native", async () => {
  await renderTailwind(
    <A
      testID={testID}
      className="ios:text-white native:text-black web:text-red-500"
    />,
  );

  const component = screen.getByTestId(testID);

  expect(component).toHaveStyle({ color: "rgba(0, 0, 0, 1)" });
});
