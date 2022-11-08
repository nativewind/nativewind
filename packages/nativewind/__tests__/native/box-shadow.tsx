import { render } from "@testing-library/react-native";
import { styled } from "../../src";
import { create, testCompile } from "../test-utils";

testCompile("shadow", (output) => {
  expect(output).toStrictEqual({
    shadow: {
      styles: [
        {
          elevation: 3,
          shadowColor: "rgba(0, 0, 0, 0.1)",
          shadowOffset: { width: 0, height: 2 },
          shadowRadius: 6,
        },
        {
          shadowColor: "rgba(0, 0, 0, 0.1)",
          shadowOffset: { width: 0, height: 2 },
          shadowRadius: 6,
        },
      ],
      atRules: {
        0: [["platform", "android"]],
        1: [["platform", "ios"]],
      },
    },
  });
});

test("shadow", () => {
  create("shadow");

  const Component = jest.fn();
  const MyComponent = styled(Component);

  render(<MyComponent className="shadow" />);

  expect(Component).toHaveBeenCalledWith(
    expect.objectContaining({
      style: {
        shadowColor: "rgba(0, 0, 0, 0.1)",
        shadowOffset: { height: 2, width: 0 },
        shadowRadius: 6,
      },
    }),
    {}
  );
});
