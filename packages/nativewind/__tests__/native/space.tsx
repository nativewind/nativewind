import { render } from "@testing-library/react-native";
import { PropsWithChildren } from "react";
import { StyledComponent } from "../../src";
import { create, testCompile } from "../test-utils";

testCompile("space-x-2", (output) => {
  expect(output).toStrictEqual({
    "space-x-2": {
      styles: [],
      childClasses: ["space-x-2:children"],
    },
    "space-x-2:children": {
      conditions: ["not-first-child"],
      subscriptions: ["--rem"],
      styles: [
        {
          marginLeft: { function: "rem", values: [0.5] },
        },
      ],
    },
  });
});

test("space-x-2", () => {
  create("space-x-2");

  const Parent = jest.fn(({ children }: PropsWithChildren) => {
    return <>{children}</>;
  });

  const Child1 = jest.fn();
  const Child2 = jest.fn();

  render(
    <StyledComponent component={Parent} className="space-x-2">
      <Child1 />
      <Child2 />
    </StyledComponent>
  );

  expect(Child1).toHaveBeenCalledWith(
    expect.objectContaining({
      style: undefined,
    }),
    {}
  );

  expect(Child2).toHaveBeenCalledWith(
    expect.objectContaining({
      style: {
        marginLeft: 8,
      },
    }),
    {}
  );
});

test("preserve children", () => {
  create("space-x-2 text-black");

  const Parent = jest.fn(({ children }: PropsWithChildren) => {
    return <>{children}</>;
  });

  const Child1 = jest.fn();
  const Child2 = jest.fn();

  render(
    <StyledComponent component={Parent} className="space-x-2">
      <Child1 />
      <StyledComponent component={Child2} className="text-black" />
    </StyledComponent>
  );

  expect(Child1).toHaveBeenCalledWith(
    expect.objectContaining({
      style: undefined,
    }),
    {}
  );

  expect(Child2).toHaveBeenCalledWith(
    expect.objectContaining({
      style: {
        marginLeft: 8,
        color: "#000",
      },
    }),
    {}
  );
});
