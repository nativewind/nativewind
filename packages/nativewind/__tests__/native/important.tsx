import { render } from "@testing-library/react-native";
import { styled } from "../../src";
import { create, testCompile } from "../test-utils";

testCompile("!text-black dark:!text-white", (output) => {
  expect(output).toStrictEqual({
    "!text-black": {
      styles: [
        {
          color: "#000",
        },
      ],
    },
    "dark:!text-white": {
      atRules: {
        "0": [["--color-scheme", "dark"]],
      },
      styles: [
        {
          color: "#fff",
        },
      ],
      subscriptions: ["--color-scheme"],
    },
  });
});

test.only("!text-black text-white", () => {
  create("!text-black text-white");

  const Component = jest.fn();
  const MyComponent = styled(Component);

  render(<MyComponent className="!text-black text-white" />);

  expect(Component).toHaveBeenCalledWith(
    expect.objectContaining({
      style: {
        color: "#000",
      },
    }),
    {}
  );
});
