import { act, render } from "@testing-library/react-native";
import { NativeWindStyleSheet, styled } from "../../src";
import { create, testCompile } from "../test-utils";

afterEach(() => {
  NativeWindStyleSheet.__reset();
  jest.clearAllMocks();
});

testCompile("dark:text-red-500", (output) => {
  expect(output).toStrictEqual({
    "dark:text-red-500": {
      styles: [{ color: "#ef4444" }],
      atRules: { 0: [["--color-scheme", "dark"]] },
      subscriptions: ["--color-scheme"],
    },
  });
});

testCompile(
  "dark:text-red-500",
  {
    nameSuffix: "using darkMode:class",
    config: {
      darkMode: "class",
    },
  },
  (output) => {
    expect(output).toStrictEqual({
      ":root": {
        variables: [{ "--dark-mode": "class" }],
      },
      "dark:text-red-500": {
        styles: [{ color: "#ef4444" }],
        atRules: { 0: [["--color-scheme", "dark"]] },
        subscriptions: ["--color-scheme"],
      },
    });
  }
);

test("switch dark mode", () => {
  create("text-black dark:text-white", {
    config: {
      darkMode: "class",
    },
  });

  const Component = jest.fn();
  const MyComponent = styled(Component);

  render(<MyComponent className="text-black dark:text-white" />);

  expect(Component).toHaveBeenCalledWith(
    expect.objectContaining({
      style: {
        color: "#000",
      },
    }),
    {}
  );

  act(() => {
    Component.mockReset();
    NativeWindStyleSheet.toggleColorScheme();
  });

  expect(Component).toHaveBeenCalledWith(
    expect.objectContaining({
      style: {
        color: "#fff",
      },
    }),
    {}
  );
});
