import { expectError, tailwindRunner, spacingCases } from "./runner";
import { Text, View } from "react-native";
import { render } from "@testing-library/react-native";
import { TestProvider } from "./runner";
import { StyledComponent } from "../../src";

tailwindRunner(
  "Layout - Space between",
  expectError(["space-x-reverse", "space-y-reverse"])
);

describe("Border - Divide Width", () => {
  test.each(spacingCases)("space-x-%s", (unit) => {
    const tree = render(
      <TestProvider css={`space-x-${unit}`}>
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
      <TestProvider css={`space-y-${unit}`}>
        <StyledComponent component={View} className={`space-y-${unit}`}>
          <Text>A</Text>
          <Text>B</Text>
        </StyledComponent>
      </TestProvider>
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
