import { Text, View } from "react-native";
import { render } from "@testing-library/react-native";
import { TestProvider } from "../tailwindcss/runner";
import { StyledComponent } from "../../src";
import { tailwindRunner } from "../tailwindcss/runner";
import { PARENT_HOVER } from "../../src/utils/selector";

tailwindRunner("Custom - Parent", [
  [
    "parent:text-white",
    {
      styles: {
        "parent:text-white.children@0": {
          color: "#fff",
        },
      },
      childClasses: {
        "parent:text-white": ["parent:text-white.children"],
      },
      atRules: {
        "parent:text-white.children": [[["selector", "(> *)"]]],
      },
    },
  ],
]);

tailwindRunner("Custom - Parent State Variants", [
  [
    "parent-hover:text-white",
    {
      styles: {
        "parent-hover:text-white": {
          color: "#fff",
        },
      },
      masks: {
        "parent-hover:text-white": PARENT_HOVER,
      },
    },
  ],
]);

describe("Custom - Parent Variant Snapshots", () => {
  test("parent:text-white", () => {
    const tree = render(
      <TestProvider>
        <StyledComponent component={View} className="parent:text-white">
          <Text>A</Text>
          <Text>B</Text>
        </StyledComponent>
      </TestProvider>
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
