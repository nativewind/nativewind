import { render } from "@testing-library/react-native";
import { styled, StyledComponent } from "../../src";
import { create } from "../test-utils";

test("className", () => {
  create("text-black");

  const MyComponent = jest.fn();

  render(<StyledComponent component={MyComponent} className="text-black" />);

  expect(MyComponent).toHaveBeenCalledWith(
    {
      style: {
        color: "#000",
      },
    },
    {}
  );
});

test("tw", () => {
  create("text-black");

  const MyComponent = jest.fn();

  render(<StyledComponent component={MyComponent} tw="text-black" />);

  expect(MyComponent).toHaveBeenCalledWith(
    {
      style: {
        color: "#000",
      },
    },
    {}
  );
});

test("StyledComponent preserve style={}", () => {
  create("text-black");

  const MyComponent = jest.fn();

  render(
    <StyledComponent
      component={MyComponent}
      className="text-black"
      style={{ background: "red" }}
    />
  );

  expect(MyComponent).toHaveBeenCalledWith(
    {
      style: [
        {
          color: "#000",
        },
        {
          background: "red",
        },
      ],
    },
    {}
  );
});

test("StyledComponent styled()", () => {
  create("text-black font-bold");

  const MyComponent = jest.fn();
  const StyledMyComponent = styled(MyComponent, "font-bold");

  render(
    <StyledComponent component={StyledMyComponent} className="text-black" />
  );

  expect(MyComponent).toHaveBeenCalledWith(
    {
      style: [
        {
          fontWeight: "700",
        },
        {
          color: "#000",
        },
      ],
    },
    {}
  );
});
