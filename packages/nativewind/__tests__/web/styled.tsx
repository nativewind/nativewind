import { render } from "@testing-library/react-native";
import { FunctionComponent } from "react";
import { ViewProps } from "react-native";
import { styled } from "../../src";

const Component = jest.fn(
  (props) => props.children
) as FunctionComponent<ViewProps>;

afterEach(() => {
  jest.clearAllMocks();
});

test("styled", () => {
  const StyledComponent = styled(Component);

  render(<StyledComponent className="text-black" />);

  expect(Component).toHaveBeenCalledWith(
    {
      style: {
        $$css: true,
        tailwind: "text-black",
      },
    },
    {}
  );
});

test("default styles", () => {
  const StyledComponent = styled(Component, "bg-white");

  render(<StyledComponent className="text-black" />);

  expect(Component).toHaveBeenCalledWith(
    {
      style: {
        $$css: true,
        tailwind: "bg-white text-black",
      },
    },
    {}
  );
});

test("cva options", () => {
  const StyledComponent = styled(Component, "bg-white", {
    variants: {
      size: {
        large: "p-4",
      },
    },
  });

  render(<StyledComponent className="text-black" size="large" />);

  expect(Component).toHaveBeenCalledWith(
    {
      size: "large",
      style: {
        $$css: true,
        tailwind: "bg-white p-4 text-black",
      },
    },
    {}
  );
});
