import { render } from "@testing-library/react-native";
import { FunctionComponent } from "react";
import { StyleProp, ViewProps, ViewStyle } from "react-native";
import { NativeWindStyleSheet, styled } from "../../src";
import { create } from "../test-utils";

afterEach(() => {
  NativeWindStyleSheet.__reset();
  jest.clearAllMocks();
});

test("default variant", () => {
  create("bg-white p-4");

  const Component = jest.fn(
    (props) => props.children
  ) as FunctionComponent<ViewProps>;

  const StyledComponent = styled(Component, "bg-white", {
    variants: {
      size: {
        large: "p-4",
      },
    },
    defaultVariants: {
      size: "large",
    },
  });

  render(<StyledComponent />);

  expect(Component).toHaveBeenCalledWith(
    expect.objectContaining({
      style: {
        backgroundColor: "#fff",
        padding: 16,
      },
    }),
    {}
  );
});

test("with props & variant", () => {
  create("bg-white p-4 m-2");

  const OuterView = jest.fn((props) => props.children);
  const InnerView = jest.fn();

  function ViewWithInner({
    innerStyle,
    ...props
  }: ViewProps & { innerStyle?: StyleProp<ViewStyle> }) {
    return (
      <OuterView {...props}>
        <InnerView style={innerStyle} />
      </OuterView>
    );
  }

  const StyledViewWithInner = styled(ViewWithInner, "bg-white", {
    props: {
      innerStyle: true,
    },
    variants: {
      size: {
        large: "p-4",
      },
    },
  });

  render(<StyledViewWithInner innerStyle="m-2" size="large" />);

  expect(OuterView).toHaveBeenCalledWith(
    expect.objectContaining({
      style: {
        backgroundColor: "#fff",
        padding: 16,
      },
    }),
    {}
  );

  expect(InnerView).toHaveBeenCalledWith(
    expect.objectContaining({
      style: {
        margin: 8,
      },
    }),
    {}
  );
});
