import { View } from "react-native";
import { createMockComponent, renderTailwind } from "../test-utils";
import { act, screen } from "@testing-library/react-native";
import { StyleSheet } from "react-native-css-interop";
import { resetStyles } from "react-native-css-interop/testing-library";

const testID = "react-native-css-interop";
const A = createMockComponent(View);

beforeEach(() => resetStyles());

test("darkMode: media", async () => {
  await renderTailwind(<A testID={testID} className="dark:text-black" />, {
    base: true,
    config: {
      darkMode: "media",
    },
  });

  const component = screen.getByTestId(testID);

  expect(component).toHaveStyle({});

  act(() => StyleSheet.setColorScheme("dark"));

  expect(component).toHaveStyle({ color: "rgba(0, 0, 0, 1)" });
});

test("darkMode: class", async () => {
  await renderTailwind(<A testID={testID} className="dark:text-black" />, {
    base: true,
    config: {
      darkMode: "class",
    },
  });

  const component = screen.getByTestId(testID);

  expect(component).toHaveStyle({});

  act(() => StyleSheet.setColorScheme("dark"));

  expect(component).toHaveStyle({ color: "rgba(0, 0, 0, 1)" });
});

test("darkMode: custom class", async () => {
  await renderTailwind(<A testID={testID} className="dark:text-black" />, {
    base: true,
    config: {
      darkMode: ["class", ".dark-mode"],
    },
  });

  const component = screen.getByTestId(testID);

  expect(component).toHaveStyle({});

  act(() => StyleSheet.setColorScheme("dark"));

  expect(component).toHaveStyle({ color: "rgba(0, 0, 0, 1)" });
});

test.only("darkMode: root variables", async () => {
  await renderTailwind(<A testID={testID} className="dark:text-primary" />, {
    css: `
      @tailwind base;
      @tailwind components;
      @tailwind utilities;

      @layer base {
        @media(prefers-color-scheme: dark) {
          :root {
            --color-primary: 255 115 179;
            --color-secondary: 111 114 185;
          }
        }
      }
      `,
    config: {
      theme: {
        colors: {
          primary: "rgb(var(--color-primary) / <alpha-value>)",
          secondary: "rgb(var(--color-secondary) / <alpha-value>)",
        },
      },
    },
  });

  const component = screen.getByTestId(testID);

  expect(component).toHaveStyle({});

  act(() => StyleSheet.setColorScheme("dark"));

  expect(component).toHaveStyle({ color: "rgba(0, 0, 0, 1)" });
});
