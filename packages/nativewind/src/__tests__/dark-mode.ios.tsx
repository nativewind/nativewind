/** @jsxImportSource nativewind */
import { Button, Text, View } from "react-native";

import { act, fireEvent, screen } from "@testing-library/react-native";

import { colorScheme, render, useColorScheme } from "../test";

const testID = "react-native-css-interop";

test("darkMode: media", async () => {
  await render(<View testID={testID} className="dark:text-black" />, {
    config: {
      darkMode: "media",
    },
  });

  const component = screen.getByTestId(testID);

  expect(component).toHaveStyle(undefined);

  act(() => colorScheme.set("dark"));

  expect(component).toHaveStyle({ color: "#000000" });
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
  });

  const component = screen.getByTestId(testID);

  expect(component).toHaveStyle(undefined);

  act(() => colorScheme.set("dark"));

  expect(component).toHaveStyle({ color: "#000000" });
});

test("darkMode: class - on custom prop", async () => {
  await render(<View testID={testID} className="dark:fill-black" />, {
    config: {
      darkMode: "class",
    },
  });

  const component = screen.getByTestId(testID);

  expect(component).toHaveStyle(undefined);
  expect(component.props).not.toHaveProperty("fill");

  act(() => colorScheme.set("dark"));

  expect(component).toHaveStyle(undefined);
  expect(component.props.fill).toEqual("#000000");
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

  const text = screen.getByTestId(testIds.TEXT);

  // Should render light by default
  expect(text.props.children).toStrictEqual("light");

  // Press the dark button
  act(() => fireEvent.press(screen.getByTestId(testIds.DARK_BUTTON)));
  expect(text.props.children).toStrictEqual("dark");

  // Press the light button
  act(() => fireEvent.press(screen.getByTestId(testIds.LIGHT_BUTTON)));
  expect(text.props.children).toStrictEqual("light");

  // Go back to dark
  act(() => fireEvent.press(screen.getByTestId(testIds.DARK_BUTTON)));
  expect(text.props.children).toStrictEqual("dark");

  // Press the system button (is light for the tests)
  act(() => fireEvent.press(screen.getByTestId(testIds.SYSTEM_BUTTON)));
  expect(text.props.children).toStrictEqual("light");
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
      safelist: ["dark:text-red-500"],
    },
  });

  const text = screen.getByTestId(testIds.TEXT);
  const button = screen.getByTestId(testIds.TOGGLE_BUTTON);

  expect(text.props.children).toStrictEqual("light");
  act(() => fireEvent.press(button));
  expect(text.props.children).toStrictEqual("dark");
  act(() => fireEvent.press(button));
  expect(text.props.children).toStrictEqual("light");
  act(() => fireEvent.press(button));
  expect(text.props.children).toStrictEqual("dark");
});

test("combines with other modifiers", async () => {
  act(() => colorScheme.set("dark"));

  await render(
    <View
      testID={testID}
      className="bg-green-500 active:bg-red-500 dark:active:bg-blue-500"
    >
      <Text>Press me</Text>
    </View>,
    {
      config: {
        darkMode: "class",
      },
    },
  );

  const component = screen.getByTestId(testID);
  expect(component).toHaveStyle({ backgroundColor: "#22c55e" });

  fireEvent(component, "pressIn");
  expect(component).toHaveStyle({ backgroundColor: "#3b82f6" });

  act(() => colorScheme.set("light"));

  expect(component).toHaveStyle({ backgroundColor: "#ef4444" });
});
