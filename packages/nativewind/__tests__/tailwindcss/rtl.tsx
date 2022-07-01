import { View } from "react-native";
import { render } from "@testing-library/react-native";
import { TestProvider } from "./runner";
import { StyledComponent } from "../../src";

describe("RTL", () => {
  test("left", () => {
    const tree = render(
      <TestProvider>
        <StyledComponent component={View} className="ltr:p-4" />
        <StyledComponent component={View} className="rtl:p-4" />
      </TestProvider>
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });

  test.only("right", () => {
    const tree = render(
      <TestProvider>
        <StyledComponent component={View} className="ltr:p-4" />
        <StyledComponent component={View} className="rtl:p-4" />
      </TestProvider>
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
