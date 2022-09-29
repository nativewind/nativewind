import { render } from "@testing-library/react-native";
import { Config } from "tailwindcss";
import { NativeWindStyleSheet, platformSelect, styled } from "../src";
import { extractStyles } from "../src/postcss/extract";
import nativePreset from "../src/tailwind";

afterEach(() => {
  NativeWindStyleSheet.reset();
  jest.clearAllMocks();
});

function create(
  className: string,
  css: string | undefined = undefined,
  config?: Partial<Config>
) {
  return NativeWindStyleSheet.create(
    extractStyles(
      {
        content: [],
        safelist: [className],
        presets: [nativePreset],
        ...config,
      },
      `@tailwind components;@tailwind utilities;${css ?? ""}`
    )
  );
}

test("platformSelect", () => {
  create("text-test", "", {
    theme: {
      fontSize: {
        test: platformSelect({
          ios: 1, // These tests run as ios
          default: 2,
        }),
      },
    },
  });

  const MyComponent = jest.fn();
  const StyledComponent = styled(MyComponent);

  render(<StyledComponent className="text-test" />);

  expect(MyComponent).toHaveBeenCalledWith(
    {
      style: { fontSize: 1 },
    },
    {}
  );
});

test("platformSelect - units", () => {
  create("text-test", "", {
    theme: {
      fontSize: {
        test: platformSelect({
          ios: "1rem", // These tests run as ios
          default: 2,
        }),
      },
    },
  });

  const MyComponent = jest.fn();
  const StyledComponent = styled(MyComponent);

  render(<StyledComponent className="text-test" />);

  expect(MyComponent).toHaveBeenCalledWith(
    {
      style: { fontSize: 16 },
    },
    {}
  );
});
