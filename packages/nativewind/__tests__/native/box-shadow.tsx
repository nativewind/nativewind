import { render } from "@testing-library/react-native";
import { styled } from "../../src";
import { create, testCompile } from "../test-utils";

testCompile("shadow", (output) => {
  expect(output).toStrictEqual({
    shadow: {
      styles: [
        {
          elevation: 3,
          shadowColor: {
            function: "toRGB",
            values: ["rgba(0, 0, 0, 0.1)"],
          },
          shadowOffset: { width: 0, height: 2 },
          shadowRadius: 6,
          shadowOpacity: {
            function: "rgbOpacity",
            values: ["rgba(0, 0, 0, 0.1)"],
          },
        },
        {
          shadowColor: {
            function: "toRGB",
            values: ["rgba(0, 0, 0, 0.1)"],
          },
          shadowOffset: { width: 0, height: 2 },
          shadowRadius: 6,
          shadowOpacity: {
            function: "rgbOpacity",
            values: ["rgba(0, 0, 0, 0.1)"],
          },
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
        shadowColor: "rgb(0, 0, 0)",
        shadowOffset: { height: 2, width: 0 },
        shadowRadius: 6,
        shadowOpacity: 0.1,
      },
    }),
    {}
  );
});
