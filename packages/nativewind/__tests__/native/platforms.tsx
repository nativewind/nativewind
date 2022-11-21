import { render } from "@testing-library/react-native";
import { styled } from "../../src";
import { create } from "../test-utils";

test("platformSelect", () => {
  create("ios:text-red-500 android:text-blue-500");

  const MyComponent = jest.fn();
  const StyledComponent = styled(MyComponent);

  render(
    <StyledComponent className="ios:text-red-500 android:text-blue-500" />
  );

  // Tests run as ios
  expect(MyComponent).toHaveBeenCalledWith(
    {
      style: { color: "#3b82f6" },
    },
    {}
  );
});
