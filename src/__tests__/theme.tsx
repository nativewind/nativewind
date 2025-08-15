import { PixelRatio, PlatformColor, StyleSheet } from "react-native";

import { screen } from "@testing-library/react-native";
import { View } from "react-native-css/components";

import { render } from "../test-utils";

const testA = "a";

test("hairlineWidth()", async () => {
  await render(
    <View testID={testA} className="border-[length:hairlineWidth()]" />,
  );

  const component = screen.getByTestId(testA);

  expect(component).toHaveStyle({ borderWidth: StyleSheet.hairlineWidth });
});

test("roundToNearestPixel()", async () => {
  await render(
    <View
      testID={testA}
      className="border-[length:roundToNearestPixel(2.5)]"
    />,
  );

  expect(screen.getByTestId(testA)).toHaveStyle({
    borderWidth: PixelRatio.roundToNearestPixel(2.5),
  });
});

test("getPixelSizeForLayoutSize()", async () => {
  await render(
    <View
      testID={testA}
      className="border-[length:getPixelSizeForLayoutSize(2)]"
    />,
  );

  expect(screen.getByTestId(testA)).toHaveStyle({
    borderWidth: PixelRatio.getPixelSizeForLayoutSize(2),
  });
});

test("platformColor()", async () => {
  await render(<View testID={testA} className="text-custom" />, {
    extraCss: `
    @theme {
      --color-custom: platformColor(
        "systemTealColor",
        "?android:attr/textColor",
        "blue"
      );
    }
    `,
  });

  expect(screen.getByTestId(testA)).toHaveStyle({
    color: PlatformColor("systemTealColor", "?android:attr/textColor", "blue"),
  });
});
