import { Text, View, ViewStyle } from "react-native";
import { render } from "@testing-library/react-native";
import { TestProvider } from "./runner";
import { StyledComponent } from "../../src";

const cases: Array<ViewStyle["borderWidth"][]> = [[0], [0.5], [2], [4], [8]];

describe("Border - Divide Width", () => {
  test("divide-x", () => {
    const tree = render(
      <TestProvider>
        <StyledComponent component={View} className="divide-x">
          <Text>A</Text>
          <Text>B</Text>
        </StyledComponent>
      </TestProvider>
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });

  test("divide-y", () => {
    const tree = render(
      <TestProvider>
        <StyledComponent component={View} className="divide-y">
          <Text>A</Text>
          <Text>B</Text>
        </StyledComponent>
      </TestProvider>
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });

  test.each(cases)("divide-x-%s", (unit) => {
    const tree = render(
      <TestProvider>
        <StyledComponent component={View} className={`divide-x-${unit}`}>
          <Text>A</Text>
          <Text>B</Text>
        </StyledComponent>
      </TestProvider>
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });

  test.each(cases)("divide-y-%s", (unit) => {
    const tree = render(
      <TestProvider>
        <StyledComponent component={View} className={`divide-y-${unit}`}>
          <Text>A</Text>
          <Text>B</Text>
        </StyledComponent>
      </TestProvider>
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
