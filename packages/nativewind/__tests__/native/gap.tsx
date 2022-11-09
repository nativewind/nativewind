import { render } from "@testing-library/react-native";
import { PropsWithChildren } from "react";
import { NativeWindStyleSheet, styled } from "../../src";
import { create, testCompile } from "../test-utils";

afterEach(() => {
  NativeWindStyleSheet.__reset();
  jest.clearAllMocks();
});

testCompile("gap-2", (output) => {
  expect(output).toStrictEqual({
    "gap-2": {
      childClasses: ["gap-2:children"],
      subscriptions: ["--rem"],
      styles: [
        {
          marginTop: { function: "rem", values: [-0.5] },
          marginLeft: { function: "rem", values: [-0.5] },
        },
      ],
    },
    "gap-2:children": {
      subscriptions: ["--rem"],
      styles: [
        {
          marginTop: { function: "rem", values: [0.5] },
          marginLeft: { function: "rem", values: [0.5] },
        },
      ],
    },
  });
});

testCompile("sm:gap-2", (output) => {
  expect(output).toStrictEqual({
    "sm:gap-2": {
      childClasses: ["sm:gap-2:children"],
      subscriptions: ["--device-width", "--rem"],
      atRules: {
        0: [["min-width", 640]],
      },
      styles: [
        {
          marginTop: { function: "rem", values: [-0.5] },
          marginLeft: { function: "rem", values: [-0.5] },
        },
      ],
    },
    "sm:gap-2:children": {
      subscriptions: ["--device-width", "--rem"],
      atRules: {
        0: [["min-width", 640]],
      },
      styles: [
        {
          marginTop: { function: "rem", values: [0.5] },
          marginLeft: { function: "rem", values: [0.5] },
        },
      ],
    },
  });
});

test("gap", () => {
  create("gap-2");

  const Parent = jest.fn(({ children }: PropsWithChildren) => {
    return <>{children}</>;
  });
  const Child1 = jest.fn();
  const Child2 = jest.fn();
  const StyledParent = styled(Parent);

  render(
    <StyledParent className="gap-2">
      <Child1 />
      <Child2 />
    </StyledParent>
  );

  expect(Parent).toHaveBeenCalledWith(
    expect.objectContaining({
      style: {
        marginLeft: -7,
        marginTop: -7,
      },
    }),
    {}
  );

  expect(Child1).toHaveBeenCalledWith(
    expect.objectContaining({
      style: {
        marginLeft: 7,
        marginTop: 7,
      },
    }),
    {}
  );

  expect(Child2).toHaveBeenCalledWith(
    expect.objectContaining({
      style: {
        marginLeft: 7,
        marginTop: 7,
      },
    }),
    {}
  );
});
