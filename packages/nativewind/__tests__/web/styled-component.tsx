import { render } from "@testing-library/react-native";
import { NativeWindStyleSheet, styled, StyledComponent } from "../../src";

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

test("style merging", () => {
  const MyComponent = jest.fn();

  render(<StyledComponent component={MyComponent} className="p-5 p-2 p-4" />);

  expect(MyComponent).toHaveBeenCalledWith(
    {
      style: {
        $$css: true,
        "p-4": "p-4",
      },
    },
    {}
  );

  MyComponent.mockReset();
  NativeWindStyleSheet.setWebClassNameMergeStrategy((className) => className);
  render(<StyledComponent component={MyComponent} className="p-5 p-2 p-4" />);

  expect(MyComponent).toHaveBeenCalledWith(
    {
      style: {
        $$css: true,
        "p-5 p-2 p-4": "p-5 p-2 p-4",
      },
    },
    {}
  );
});
