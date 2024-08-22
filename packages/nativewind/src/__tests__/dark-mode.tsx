/** @jsxImportSource nativewind */
import { View, Text, Button } from "react-native";
import { colorScheme, render, useColorScheme } from "../test-utils";
import { act, screen, within } from "@testing-library/react-native";

const testID = "react-native-css-interop";

test("darkMode: media", async () => {
  await render(<View testID={testID} className="dark:text-black" />, {
    config: {
      darkMode: "media",
    },
    layers: {
      base: true,
    },
  });

  const component = screen.getByTestId(testID);

  expect(component).toHaveStyle(undefined);

  act(() => colorScheme.set("dark"));

  expect(component).toHaveStyle({ color: "rgba(0, 0, 0, 1)" });
});

test("darkMode: media variable switching", async () => {
  await render(
    <View testID={testID} className="text-[color:rgb(var(--color))]" />,
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
  await render(<View testID={testID} className="dark:text-black" />, {
    config: {
      darkMode: "class",
    },
    layers: {
      base: true,
    },
  });

  const component = screen.getByTestId(testID);

  expect(component).toHaveStyle(undefined);

  act(() => colorScheme.set("dark"));

  expect(component).toHaveStyle({ color: "rgba(0, 0, 0, 1)" });
});

test("darkMode: class - on custom prop", async () => {
  await render(<View testID={testID} className="dark:fill-black" />, {
    config: {
      darkMode: "class",
    },
    layers: {
      base: true,
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
  await render(
    <View testID={testID} className="text-[color:rgb(var(--color))]" />,
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

test("useColorScheme().setColorScheme() with darkMode: class", async () => {
  const testIds = {
    TEXT: "useColorScheme",
    DARK_BUTTON: "dark_button",
    LIGHT_BUTTON: "light_button",
    SYSTEM_BUTTON: "system_button",
  };

  function UseColorScheme() {
    const { colorScheme, setColorScheme } = useColorScheme();

    return (
      <View>
        <Text testID={testIds.TEXT}>{colorScheme}</Text>
        <Button
          testID={testIds.DARK_BUTTON}
          title="Dark"
          onPress={() => setColorScheme("dark")}
        />
        <Button
          testID={testIds.LIGHT_BUTTON}
          title="Light"
          onPress={() => setColorScheme("light")}
        />
        <Button
          testID={testIds.SYSTEM_BUTTON}
          title="System"
          onPress={() => setColorScheme("system")}
        />
      </View>
    );
  }
  await render(<UseColorScheme />, {
    config: {
      darkMode: "class",
    },
  });

  const { getByText } = within(screen.getByTestId(testIds.TEXT));

  // Should render light by default
  expect(getByText("light")).toBeTruthy();

  // Press the dark button
  act(() => screen.getByTestId(testIds.DARK_BUTTON).props.onClick());
  expect(getByText("dark")).toBeTruthy();

  // Press the light button
  act(() => screen.getByTestId(testIds.LIGHT_BUTTON).props.onClick());
  expect(getByText("light")).toBeTruthy();

  // Press the system button
  act(() => screen.getByTestId(testIds.SYSTEM_BUTTON).props.onClick());
  expect(getByText("light")).toBeTruthy();
});

test("useColorScheme().toggleColorScheme() with darkMode: class", async () => {
  const testIds = {
    TEXT: "useColorScheme",
    TOGGLE_BUTTON: "toggle_button",
  };

  function UseColorScheme() {
    const { colorScheme, toggleColorScheme } = useColorScheme();

    return (
      <View>
        <Text testID={testIds.TEXT}>{colorScheme}</Text>
        <Button
          testID={testIds.TOGGLE_BUTTON}
          title="toggle"
          onPress={toggleColorScheme}
        />
      </View>
    );
  }
  await render(<UseColorScheme />, {
    config: {
      darkMode: "class",
    },
  });

  const { getByText } = within(screen.getByTestId(testIds.TEXT));

  expect(getByText("light")).toBeTruthy();
  act(() => screen.getByTestId(testIds.TOGGLE_BUTTON).props.onClick());
  expect(getByText("dark")).toBeTruthy();
  act(() => screen.getByTestId(testIds.TOGGLE_BUTTON).props.onClick());
  expect(getByText("light")).toBeTruthy();
  act(() => screen.getByTestId(testIds.TOGGLE_BUTTON).props.onClick());
  expect(getByText("dark")).toBeTruthy();
});
