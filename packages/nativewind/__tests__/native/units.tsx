/* eslint-disable unicorn/no-useless-undefined */
import { act, render } from "@testing-library/react-native";
import { NativeWindStyleSheet, styled } from "../../src";
import { create, setDimensions } from "../test-utils";

afterEach(() => {
  NativeWindStyleSheet.__reset();
  jest.clearAllMocks();
});

test("px", () => {
  create("w-[1px]");

  const MyComponent = jest.fn();
  const StyledComponent = styled(MyComponent);

  render(<StyledComponent className="w-[1px]" />);

  expect(MyComponent).toHaveBeenCalledWith(
    {
      style: { width: 1 },
      children: undefined,
    },
    {}
  );
});

test("%", () => {
  create("w-[1%]");

  const MyComponent = jest.fn();
  const StyledComponent = styled(MyComponent);

  render(<StyledComponent className="w-[1%]" />);

  expect(MyComponent).toHaveBeenCalledWith(
    {
      style: { width: "1%" },
    },
    {}
  );
});

test("vw", () => {
  create("w-[1vw]");

  setDimensions({ width: 100, height: 100 });

  const MyComponent = jest.fn();
  const StyledComponent = styled(MyComponent);

  render(<StyledComponent className="w-[1vw]" />);

  expect(MyComponent).toHaveBeenCalledWith(
    {
      style: { width: 1 },
    },
    {}
  );

  act(() => {
    setDimensions({ width: 50, height: 100 });
  });

  expect(MyComponent).toHaveBeenCalledWith(
    {
      style: { width: 1 },
    },
    {}
  );
});

test("vh", () => {
  create("h-[1vh]");

  setDimensions({ width: 100, height: 100 });

  const MyComponent = jest.fn();
  const StyledComponent = styled(MyComponent);

  render(<StyledComponent className="h-[1vh]" />);

  expect(MyComponent).toHaveBeenCalledTimes(1);
  expect(MyComponent).toHaveBeenCalledWith(
    {
      style: { height: 1 },
    },
    {}
  );

  act(() => {
    MyComponent.mockReset();
    setDimensions({ width: 100, height: 50 });
  });

  expect(MyComponent).toHaveBeenCalledTimes(1);
  expect(MyComponent).toHaveBeenCalledWith(
    {
      style: { height: 0.5 },
    },
    {}
  );
});

test("rem", () => {
  create("text-[1rem]");

  NativeWindStyleSheet.setVariables({
    "--rem": 100,
  });

  const MyComponent = jest.fn();
  const StyledComponent = styled(MyComponent);

  render(<StyledComponent className="text-[1rem]" />);

  expect(MyComponent).toHaveBeenCalledWith(
    {
      style: { fontSize: 100 },
    },
    {}
  );

  act(() => {
    MyComponent.mockReset();
    NativeWindStyleSheet.setVariables({
      "--rem": 50,
    });
  });

  expect(MyComponent).toHaveBeenCalledTimes(1);
  expect(MyComponent).toHaveBeenCalledWith(
    {
      style: { fontSize: 50 },
    },
    {}
  );
});
