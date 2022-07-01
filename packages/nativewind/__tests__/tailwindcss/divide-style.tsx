import { expectError, tailwindRunner } from "./runner";
import { Text, View, ViewStyle } from "react-native";
import { render } from "@testing-library/react-native";
import { TestProvider } from "./runner";
import { StyledComponent } from "../../src";

const cases: Array<ViewStyle["borderStyle"][]> = [
  ["solid"],
  ["dashed"],
  ["dotted"],
];

describe("Border - Divide Style", () => {
  test.each(cases)("divide-%s", (unit) => {
    const tree = render(
      <TestProvider>
        <StyledComponent component={View} className={`divide-${unit}`}>
          <Text>A</Text>
          <Text>B</Text>
        </StyledComponent>
      </TestProvider>
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });
});

tailwindRunner(
  "Border - Divide Style",
  expectError(["divide-double", "divide-none"])
);
