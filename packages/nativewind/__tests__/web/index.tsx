import { render } from "@testing-library/react-native";
import { StyledComponent } from "../../src";

test("StyledComponent", () => {
  const MyComponent = jest.fn();

  render(<StyledComponent component={MyComponent} className="text-black" />);

  expect(MyComponent).toHaveBeenCalledWith(
    {
      style: {
        $$css: true,
        tailwind: "text-black",
      },
    },
    {}
  );
});
