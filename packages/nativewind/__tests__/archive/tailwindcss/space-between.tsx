import { expectError, tailwindRunner, spacingCases } from "./runner";
import { Text, View } from "react-native";
import { render } from "@testing-library/react-native";
import { TestProvider } from "./runner";
import { StyledComponent } from "../../src";

tailwindRunner(
  "Layout - Space between",
  expectError(["space-x-reverse", "space-y-reverse"]),
  [
    [
      "space-x-2",
      {
        atRules: {
          "space-x-2.children": [[["selector", "(> *:not(:first-child))"]]],
        },
        childClasses: {
          "space-x-2": ["space-x-2.children"],
        },
        styles: {
          "space-x-2.children@0": {
            marginLeft: 8,
          },
        },
      },
    ],
  ]
);

describe("Layout - Space between", () => {
  test.each(spacingCases)("space-x-%s", (unit) => {
    const tree = render(
      <TestProvider>
        <StyledComponent component={View} className={`space-x-${unit}`}>
          <Text>A</Text>
          <Text>B</Text>
        </StyledComponent>
      </TestProvider>
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });

  test.each(spacingCases)("space-y-%s", (unit) => {
    const tree = render(
      <TestProvider>
        <StyledComponent component={View} className={`space-y-${unit}`}>
          <Text>A</Text>
          <Text>B</Text>
        </StyledComponent>
      </TestProvider>
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
