import { render } from "@testing-library/react-native";
import { NativeWindStyleSheet, styled } from "../src";
import { extractStyles } from "../src/postcss/extract";
import nativePreset from "../src/tailwind";

afterEach(() => {
  NativeWindStyleSheet.reset();
  jest.clearAllMocks();
});

function create(className: string) {
  return NativeWindStyleSheet.create(
    extractStyles({
      content: [],
      safelist: [className],
      presets: [nativePreset],
    })
  );
}

test("should render", () => {
  create("text-red-500");

  const MyComponent = jest.fn();
  const StyledComponent = styled(MyComponent);

  render(<StyledComponent className="text-red-500" />);

  expect(MyComponent).toHaveBeenCalledWith(
    {
      children: undefined,
      style: [[{ color: "#ef4444" }]],
    },
    {}
  );
});
