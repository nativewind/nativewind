import { act, render } from "@testing-library/react-native";
import { NativeWindStyleSheet, styled } from "../../src";
import { create, testCompile } from "../test-utils";

afterEach(() => {
  NativeWindStyleSheet.__reset();
  jest.clearAllMocks();
});

testCompile.only(
  "text-[color:var(--my-variable)]",
  {
    config: {
      darkMode: "class",
      theme: {
        variables: {
          "--my-variable": "red",
        },
        darkVariables: {
          "--my-variable": "blue",
        },
      },
    },
  },
  (output) => {
    expect(output).toStrictEqual({
      ":root": {
        variables: [
          {
            "--dark-mode": "class",
            "--my-variable": "red",
          },
        ],
      },
      ":root[dark]": {
        variables: [
          {
            "--my-variable": "blue",
          },
        ],
      },
      "text-[color:var(--my-variable)]": {
        styles: [
          {
            color: {
              function: "var",
              values: ["--my-variable"],
            },
          },
        ],
        subscriptions: ["--my-variable"],
      },
    });
  }
);

test("set via theme", () => {
  create("text-[color:var(--my-variable)]", {
    config: {
      darkMode: "class",
      theme: {
        variables: {
          "--my-variable": "red",
        },
        darkVariables: {
          "--my-variable": "blue",
        },
      },
    },
  });

  const MyComponent = jest.fn();
  const StyledComponent = styled(MyComponent);

  render(<StyledComponent className="text-[color:var(--my-variable)]" />);

  expect(MyComponent).toHaveBeenCalledWith(
    {
      style: { color: "red" },
    },
    {}
  );

  act(() => {
    MyComponent.mockReset();
    NativeWindStyleSheet.toggleColorScheme();
  });

  expect(MyComponent).toHaveBeenCalledWith(
    {
      style: { color: "blue" },
    },
    {}
  );
});

test("color scheme variables", () => {
  create("text-[color:var(--test)]", {
    css: `:root { --test: red; } .dark { --test: blue; }`,
    config: {
      darkMode: "class",
    },
  });

  const MyComponent = jest.fn();
  const StyledComponent = styled(MyComponent);

  render(<StyledComponent className="text-[color:var(--test)]" />);

  expect(MyComponent).toHaveBeenCalledWith(
    {
      style: { color: "red" },
    },
    {}
  );

  act(() => {
    NativeWindStyleSheet.toggleColorScheme();
  });

  expect(MyComponent).toHaveBeenCalledWith(
    {
      style: { color: "blue" },
    },
    {}
  );

  act(() => {
    NativeWindStyleSheet.toggleColorScheme();
  });

  expect(MyComponent).toHaveBeenLastCalledWith(
    {
      style: { color: "red" },
    },
    {}
  );
});

test("with input functions", () => {
  create("text-[color:hsl(1,2,var(--custom))]", {
    css: `:root { --custom: 3; }`,
  });

  const MyComponent = jest.fn();
  const StyledComponent = styled(MyComponent);

  render(<StyledComponent className="text-[color:hsl(1,2,var(--custom))]" />);

  expect(MyComponent).toHaveBeenCalledWith(
    {
      style: { color: "hsl(1, 2, 3)" },
    },
    {}
  );

  act(() => {
    NativeWindStyleSheet.setVariables({
      "--custom": 4,
    });
  });

  expect(MyComponent).toHaveBeenLastCalledWith(
    {
      style: { color: "hsl(1, 2, 4)" },
    },
    {}
  );
});
