import { renderHook, act } from "@testing-library/react-hooks";
import { render } from "@testing-library/react-native";
import { NativeWindStyleSheet, styled, useColorScheme } from "../../src";
import { create } from "../test-utils";

afterEach(() => {
  NativeWindStyleSheet.__reset();
  jest.clearAllMocks();
});

test("useColorScheme", () => {
  create("text-black dark:text-white", {
    config: {
      darkMode: "class",
    },
  });

  const Component = jest.fn();
  const MyComponent = styled(Component);

  const { result } = renderHook(() => useColorScheme());

  render(<MyComponent className="text-black dark:text-white" />);

  expect(result.current.colorScheme).toBe("light");
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
    result.current.toggleColorScheme();
  });

  expect(result.current.colorScheme).toBe("dark");
  expect(Component).toHaveBeenCalledWith(
    expect.objectContaining({
      style: {
        color: "#fff",
      },
    }),
    {}
  );
});
