import { render, fireEvent, screen } from "@testing-library/react-native";
import { Pressable } from "react-native";
import { NativeWindStyleSheet, StyledComponent } from "../../src";
import { create, testCompile } from "../test-utils";

afterEach(() => {
  NativeWindStyleSheet.__reset();
  jest.clearAllMocks();
});

testCompile("group-hover:text-black", (output) => {
  expect(output).toStrictEqual({
    group: {
      meta: {
        group: "group",
      },
    },
    "group-hover:text-black": {
      conditions: ["group:hover"],
      meta: {
        groups: ["group"],
      },
      styles: [
        {
          color: "#000",
        },
      ],
    },
  });
});

testCompile("group-hover/sidebar:text-black", (output) => {
  expect(output).toStrictEqual({
    "group/sidebar": {
      meta: {
        group: "group/sidebar",
      },
    },
    "group-hover/sidebar:text-black": {
      conditions: ["group/sidebar:hover"],
      meta: {
        groups: ["group/sidebar"],
      },
      styles: [
        {
          color: "#000",
        },
      ],
    },
  });
});

test("group-{modifier}", () => {
  create("group-active:text-black");

  const MyComponent = jest.fn();

  render(
    <StyledComponent component={Pressable} testID="button" className="group">
      <StyledComponent
        component={MyComponent}
        className="group-active:text-black"
      />
    </StyledComponent>
  );

  expect(MyComponent).toHaveBeenCalledWith({}, {});

  fireEvent(screen.getByTestId("button"), "pressIn");

  expect(MyComponent).toHaveBeenLastCalledWith(
    {
      style: { color: "#000" },
    },
    {}
  );

  fireEvent(screen.getByTestId("button"), "pressOut");

  expect(MyComponent).toHaveBeenLastCalledWith({}, {});
});

test("group-{modifier}/named", () => {
  create("group-active/named:text-black");

  const MyComponent = jest.fn();

  render(
    <StyledComponent
      component={Pressable}
      testID="button"
      className="group/named"
    >
      <StyledComponent
        component={MyComponent}
        className="group-active/named:text-black"
      />
    </StyledComponent>
  );

  expect(MyComponent).toHaveBeenCalledWith({}, {});

  fireEvent(screen.getByTestId("button"), "pressIn");

  expect(MyComponent).toHaveBeenLastCalledWith(
    {
      style: { color: "#000" },
    },
    {}
  );

  fireEvent(screen.getByTestId("button"), "pressOut");

  expect(MyComponent).toHaveBeenLastCalledWith({}, {});
});
