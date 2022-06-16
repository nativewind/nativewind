import { Text, View } from "react-native";
import { render } from "@testing-library/react-native";
import { TestProvider } from "../tailwindcss/runner";
import { StyledComponent } from "../../src";
import { tailwindRunner, css as a } from "../tailwindcss/runner";

tailwindRunner("Custom - Parent", [
  [
    "parent:text-white",
    {
      [a`parent:text-white`]: [
        {
          atRules: [["selector", "(> *)"]],
          color: "#fff",
        },
      ],
    },
  ],
]);

tailwindRunner("Custom - Parent State Variants", [
  [
    "parent-hover:text-white",
    {
      [a`parent-hover:text-white::parent-hover`]: [
        {
          color: "#fff",
        },
      ],
    },
  ],
]);

describe("Custom - Parent Variant Snapshots", () => {
  test("parent:text-white", () => {
    const tree = render(
      <TestProvider css="parent:text-white">
        <StyledComponent component={View} className="parent:text-white">
          <Text>A</Text>
          <Text>B</Text>
        </StyledComponent>
      </TestProvider>
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
