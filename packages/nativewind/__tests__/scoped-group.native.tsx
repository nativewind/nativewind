import { render, fireEvent, screen } from "@testing-library/react-native";
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

test("scoped-group-active", () => {
  create("scoped-group-active:text-black");

  const MyComponent = jest.fn();
  const StyledComponent = styled(MyComponent);
  const StyledPressable = styled(Pressable);

  render(
    <StyledPressable testID="button" className="scoped-group">
      <StyledComponent className="scoped-group-active:text-black" />
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

test("scoped-group-hover", () => {
  create("scoped-group-hover:text-black");

  const MyComponent = jest.fn();
  const StyledComponent = styled(MyComponent);
  const StyledPressable = styled(Pressable);

  render(
    <StyledPressable testID="button" className="scoped-group">
      <StyledComponent className="scoped-group-hover:text-black" />
    </StyledPressable>
  );

  expect(MyComponent).toHaveBeenCalledWith({}, {});

  fireEvent(screen.getByTestId("button"), "hoverIn");

  expect(MyComponent).toHaveBeenLastCalledWith(
    {
      style: [[{ color: "#000" }]],
    },
    {}
  );

  fireEvent(screen.getByTestId("button"), "hoverOut");

  expect(MyComponent).toHaveBeenLastCalledWith({}, {});
});

test.skip("scoped-group-focus", () => {
  /*
   * Skipping this test as onFocus doesn't work on React Native
   */
  create("scoped-group-focus:text-black");

  const MyComponent = jest.fn();
  const StyledComponent = styled(MyComponent);
  const StyledPressable = styled(Pressable);

  render(
    <StyledPressable testID="button" className="scoped-group">
      <StyledComponent className="scoped-group-focus:text-black" />
    </StyledPressable>
  );

  expect(MyComponent).toHaveBeenCalledWith({}, {});

  fireEvent(screen.getByTestId("button"), "focus", {});

  expect(MyComponent).toHaveBeenLastCalledWith(
    {
      style: [[{ color: "#000" }]],
    },
    {}
  );

  fireEvent(screen.getByTestId("button"), "blur");

  expect(MyComponent).toHaveBeenLastCalledWith({}, {});
});
