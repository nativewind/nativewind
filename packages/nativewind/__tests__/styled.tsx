import { render, act, fireEvent, screen } from "@testing-library/react-native";
import { Pressable } from "react-native";
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

test("should render", () => {
  create("text-red-500");

  const MyComponent = jest.fn();
  const StyledComponent = styled(MyComponent);

  render(<StyledComponent className="text-red-500" />);

  expect(MyComponent).toHaveBeenCalledWith(
    {
      style: [[{ color: "#ef4444" }]],
    },
    {}
  );
});

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
      style: [[{ color: "red" }]],
    },
    {}
  );

  act(() => {
    NativeWindStyleSheet.toggleColorScheme();
  });

  expect(MyComponent).toHaveBeenCalledWith(
    {
      style: [[{ color: "blue" }]],
    },
    {}
  );

  act(() => {
    NativeWindStyleSheet.toggleColorScheme();
  });

  expect(MyComponent).toHaveBeenCalledWith(
    {
      style: [[{ color: "red" }]],
    },
    {}
  );
});

test.only("group-active", () => {
  create("group-active:text-black");

  const MyComponent = jest.fn();
  const StyledComponent = styled(MyComponent);
  const StyledPressable = styled(Pressable);

  render(
    <StyledPressable testID="button" className="group">
      <StyledComponent className="group-active:text-black" />
    </StyledPressable>
  );

  expect(MyComponent).toHaveBeenCalledWith({}, {});

  fireEvent(screen.getByTestId("button"), "pressIn");

  expect(MyComponent).toHaveBeenLastCalledWith(
    {
      style: [[{ color: "#000" }]],
    },
    {}
  );

  fireEvent(screen.getByTestId("button"), "pressOut");

  expect(MyComponent).toHaveBeenLastCalledWith({}, {});
});
