import { render } from "@testing-library/react-native";
import { styled, StyledComponent } from "../../src";

test("StyledComponent", () => {
  const MyComponent = jest.fn();

  render(<StyledComponent component={MyComponent} className="text-black" />);

  expect(MyComponent).toHaveBeenCalledWith(
    {
      style: {
        $$css: true,
        "text-black": "text-black",
      },
    },
    {}
  );
});

test("StyledComponent preserve style={}", () => {
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
          $$css: true,
          "text-black": "text-black",
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
  const MyComponent = jest.fn();
  const StyledMyComponent = styled(MyComponent, "font-bold");

  render(
    <StyledComponent component={StyledMyComponent} className="text-black" />
  );

  expect(MyComponent).toHaveBeenCalledWith(
    {
      style: [
        {
          $$css: true,
          "font-bold": "font-bold",
        },
        {
          $$css: true,
          "text-black": "text-black",
        },
      ],
    },
    {}
  );
});
