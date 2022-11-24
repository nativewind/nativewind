import { act, render } from "@testing-library/react-native";
import { styled } from "../../src";
import { create, setDimensions } from "../test-utils";

test("responsive styles", () => {
  /**
   * sm	640px	@media (min-width: 640px) { ... }
   * md	768px	@media (min-width: 768px) { ... }
   */
  create("sm:text-black md:text-white");
  setDimensions({ width: 700, height: 100 });

  const MyComponent = jest.fn();
  const StyledComponent = styled(MyComponent);

  render(<StyledComponent className="sm:text-black md:text-white" />);

  expect(MyComponent).toHaveBeenCalledWith(
    {
      style: { color: "#000" },
    },
    {}
  );

  act(() => {
    MyComponent.mockReset();
    setDimensions({ width: 800, height: 100 });
  });

  expect(MyComponent).toHaveBeenCalledWith(
    {
      style: { color: "#fff" },
    },
    {}
  );
});
