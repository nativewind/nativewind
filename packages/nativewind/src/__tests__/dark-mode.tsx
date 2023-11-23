import { View } from "react-native";
import { createMockComponent, renderTailwind } from "../test-utils";
import { act, screen } from "@testing-library/react-native";
import { resetStyles } from "react-native-css-interop/testing-library";
import { colorScheme } from "react-native-css-interop";

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

  expect(component).toHaveStyle(undefined);

  act(() => colorScheme.set("dark"));

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

  expect(component).toHaveStyle({ color: "rgb(255, 115, 179)" });

  // You cannot manually set the color scheme when using media queries, so we fake it
  act(() => colorScheme.set("dark"));

  expect(component).toHaveStyle({ color: "rgb(155, 100, 255)" });
});

test("darkMode: class", async () => {
  await renderTailwind(<A testID={testID} className="dark:text-black" />, {
    base: true,
    config: {
      darkMode: "class",
    },
  });

  const component = screen.getByTestId(testID);

  expect(component).toHaveStyle(undefined);

  act(() => colorScheme.set("dark"));

  expect(component).toHaveStyle({ color: "rgba(0, 0, 0, 1)" });
});

test("darkMode: class - on custom prop", async () => {
  await renderTailwind(<A testID={testID} className="dark:fill-black" />, {
    base: true,
    config: {
      darkMode: "class",
    },
  });

  const component = screen.getByTestId(testID);

  expect(component).toHaveStyle(undefined);
  expect(component.props).not.toHaveProperty("fill");

  act(() => colorScheme.set("dark"));

  expect(component).toHaveStyle(undefined);
  expect(component.props.fill).toEqual("rgba(0, 0, 0, 1)");
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

            .dark:root {
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

  expect(component).toHaveStyle({ color: "rgb(255, 115, 179)" });

  act(() => colorScheme.set("dark"));

  expect(component).toHaveStyle({ color: "rgb(155, 100, 255)" });
});
