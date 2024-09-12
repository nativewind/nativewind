/** @jsxImportSource nativewind */

/**
 * This file has some examples of unofficial plugins used by the community.
 *
 * They are not officially supported by NativeWind
 */

import { View } from "react-native";
import { render, screen } from "../test";

const testID = "nativewind";

test("tw-colors", async () => {
  const { createThemes } = require("tw-colors");

  // Render will inject data
  await render(
    <View className="theme-light">
      <View testID={testID} className="text-primary" />
    </View>,
    {
      config: {
        plugins: [
          createThemes(
            {
              light: {
                primary: "red",
              },
              dark: {
                primary: "blue",
              },
            },
            {
              produceThemeClass: (themeName: string) => `theme-${themeName}`,
            },
          ),
        ],
      },
    },
  );

  expect(screen.getByTestId(testID)).toHaveStyle({
    color: "hsla(0, 100%, 50%, 1)",
  });

  screen.rerender(
    <View className="theme-dark">
      <View testID={testID} className="text-primary" />
    </View>,
  );

  expect(screen.getByTestId(testID)).toHaveStyle({
    color: "hsla(240, 100%, 50%, 1)",
  });
});
