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

test("darkMode: media variable switching", async () => {
  await renderTailwind(
    <A testID={testID} className="text-[color:rgb(var(--color))]" />,
    {
      css: `
          @tailwind base;
          @tailwind components;
          @tailwind utilities;

          @layer base {
            :root {
              --color: 255 115 179;
            }
            @media (prefers-color-scheme: dark) {
              :root {
                --color: 155 100 255;
              }
            }
          }`,
    },
  );

  const component = screen.getByTestId(testID);

  expect(component).toHaveStyle({ color: "rgb(255,115,179)" });

  act(() => StyleSheet.setColorScheme("dark"));

  expect(component).toHaveStyle({ color: "rgb(155,100,255)" });
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

test("darkMode: class variable switching", async () => {
  await renderTailwind(
    <A testID={testID} className="text-[color:rgb(var(--color))]" />,
    {
      css: `
          @tailwind base;
          @tailwind components;
          @tailwind utilities;

          @layer base {
            :root {
              --color: 255 115 179;
            }

            .dark {
              --color: 155 100 255;
            }
          }
          `,
      config: {
        darkMode: "class",
      },
    },
  );

  const component = screen.getByTestId(testID);

  expect(component).toHaveStyle({ color: "rgb(255,115,179)" });

  act(() => StyleSheet.setColorScheme("dark"));

  expect(component).toHaveStyle({ color: "rgb(155,100,255)" });
});
