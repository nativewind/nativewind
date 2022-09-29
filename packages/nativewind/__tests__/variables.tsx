import { act, render } from "@testing-library/react-native";
import { NativeWindStyleSheet, styled } from "../src";
import { extractStyles } from "../src/postcss/extract";
import nativePreset from "../src/tailwind";

afterEach(() => {
  NativeWindStyleSheet.reset();
  jest.clearAllMocks();
});

function create(className: string, css?: string) {
  return NativeWindStyleSheet.create(
    extractStyles(
      {
        content: [],
        safelist: [className],
        presets: [nativePreset],
      },
      `@tailwind components;@tailwind utilities;${css ?? ""}`
    )
  );
}

test("color scheme variables", () => {
  create(
    "text-[color:var(--test)]",
    `:root { --test: red; } .dark { --test: blue; }`
  );

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
  create("text-[color:hsl(1,2,var(--custom))]", `:root { --custom: 3; }`);

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
