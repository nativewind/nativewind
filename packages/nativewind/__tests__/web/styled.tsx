import { render } from "@testing-library/react-native";
import { createElement, ReactNode } from "react";
import { ViewStyle } from "react-native";
import { styled } from "../../src";

const Component = jest.fn(
  (props: { children?: ReactNode; style?: ViewStyle }) => <>{props.children}</>
);

afterEach(() => {
  jest.clearAllMocks();
});

test("styled", () => {
  const StyledComponent = styled(Component);

  render(<StyledComponent className="text-black" />);

  createElement(StyledComponent);

  expect(Component).toHaveBeenCalledWith(
    {
      style: {
        $$css: true,
        "text-black": "text-black",
      },
    },
    {}
  );
});

test.only("props", () => {
  const Component = jest.fn(
    (props: {
      children?: ReactNode;
      style?: ViewStyle;
      other?: ViewStyle;
      another?: ViewStyle;
    }) => <>{props.children}</>
  );

  const StyledComponent = styled(Component, {
    props: {
      test: true,
      alias: "other",
      classProp: {
        class: true,
      },
    },
  });

  render(
    <StyledComponent
      className="text-black"
      test="bg-red-500"
      alias="text-bold"
      classProp="underline"
    />
  );

  createElement(StyledComponent);

  expect(Component).toHaveBeenCalledWith(
    {
      style: {
        $$css: true,
        "underline text-black": "underline text-black",
      },
      test: {
        $$css: true,
        "bg-red-500": "bg-red-500",
      },
      other: {
        $$css: true,
        "text-bold": "text-bold",
      },
    },
    {}
  );
});

test("styled", () => {
  const StyledComponent = styled(Component);

  render(<StyledComponent className="text-black" />);

  createElement(StyledComponent);

  expect(Component).toHaveBeenCalledWith(
    {
      style: {
        $$css: true,
        "text-black": "text-black",
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
        "bg-white text-black": "bg-white text-black",
      },
    },
    {}
  );
});

test("variants", () => {
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
        "bg-white p-4 text-black": "bg-white p-4 text-black",
      },
    },
    {}
  );
});

test("truthy boolean variants", () => {
  const StyledComponent = styled(Component, "bg-white", {
    variants: {
      padding: {
        true: "p-4",
      },
    },
  });

  render(<StyledComponent className="text-black" padding />);

  expect(Component).toHaveBeenCalledWith(
    {
      padding: true,
      style: {
        $$css: true,
        "bg-white p-4 text-black": "bg-white p-4 text-black",
      },
    },
    {}
  );
});

test("false boolean variants", () => {
  const StyledComponent = styled(Component, "bg-white", {
    variants: {
      padding: {
        true: "p-4",
        false: "p-2",
      },
    },
  });

  render(<StyledComponent className="text-black" />);

  expect(Component).toHaveBeenCalledWith(
    {
      style: {
        $$css: true,
        "bg-white p-2 text-black": "bg-white p-2 text-black",
      },
    },
    {}
  );
});

test("truthy fallback boolean variants", () => {
  const Component = jest.fn(
    (props: {
      children?: ReactNode;
      style?: ViewStyle;
      padding?: "large" | "small";
    }) => <>{props.children}</>
  );

  const StyledComponent = styled(Component, "bg-white", {
    variants: {
      padding: {
        large: "p-8",
        true: "p-4",
        false: "p-2",
      },
    },
  });

  render(<StyledComponent className="text-black" padding="small" />);

  expect(Component).toHaveBeenCalledWith(
    {
      padding: "small",
      style: {
        $$css: true,
        "bg-white p-4 text-black": "bg-white p-4 text-black",
      },
    },
    {}
  );
});
