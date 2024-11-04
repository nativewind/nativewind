/** @jsxImportSource nativewind */

/**
 * This file has some examples of unofficial plugins used by the community.
 *
 * They are not officially supported by NativeWind
 */

import { Text, View } from "react-native";

import flattenColorPalette from "tailwindcss/lib/util/flattenColorPalette";
import plugin from "tailwindcss/plugin";

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

test("text-shadow", async () => {
  const textShadowPlugin = plugin(
    function ({ addBase, matchUtilities, matchComponents, theme }: any) {
      addBase({
        ":root": {
          "--ts-text-shadow-color": "rgba(0, 0,0,0.50)",
          "--ts-text-shadow-x": "1px",
          "--ts-text-shadow-y": "1px",
          "--ts-text-shadow-blur": "2px",
        },
      });

      matchUtilities(
        {
          [`text-shadow-x`]: (value: Record<string, string>) => ({
            "--ts-text-shadow-x": value,
          }),
          [`text-shadow-y`]: (value: Record<string, string>) => ({
            "--ts-text-shadow-y": value,
          }),
          [`text-shadow-blur`]: (value: Record<string, string>) => ({
            "--ts-text-shadow-blur": value,
          }),
        },
        {
          values: theme("textShadowSteps"),
          type: "length",
          supportsNegativeValues: true,
        },
      );

      matchUtilities(
        {
          [`text-shadow`]: (value: Record<string, string>) => ({
            "--ts-text-shadow-color": value,
          }),
        },
        {
          values: flattenColorPalette(theme("colors")),
          type: "color",
        },
      );

      matchComponents(
        {
          [`text-shadow`]: (value: number) => ({
            textShadow:
              value === 1
                ? `var(--ts-text-shadow-x) var(--ts-text-shadow-y) var(--ts-text-shadow-blur) var(--ts-text-shadow-color)`
                : `calc(var(--ts-text-shadow-x) * ${value}) calc(var(--ts-text-shadow-y) * ${value}) var(--ts-text-shadow-blur) var(--ts-text-shadow-color)`,
          }),
        },
        {
          type: "number",
          values: theme("textShadowMultiplier"),
        },
      );
    },
    {
      theme: {
        experimental: false,
        textShadowMultiplier: {
          DEFAULT: 1,
          sm: 4,
          md: 8,
          lg: 12,
          xl: 16,
        },
        textShadowSteps: {
          xs: "1px",
          sm: "2px",
          md: "3px",
          lg: "4px",
          xl: "5px",
          0: "0",
          1: "1px",
          2: "2px",
          3: "3px",
          4: "4px",
          5: "5px",
          6: "6px",
          7: "7px",
          8: "8px",
          9: "9px",
          10: "10px",
        },
      },
    },
  );

  await render(
    <Text testID={testID} className="text-shadow-lg text-shadow-red-500" />,
    {
      config: {
        plugins: [textShadowPlugin],
      },
    },
  );

  const text = screen.getByTestId(testID);

  expect(text).toHaveStyle({
    textShadowColor: "#ef4444",
    textShadowOffset: {
      height: 12,
      width: 12,
    },
    textShadowRadius: 2,
  });
});
