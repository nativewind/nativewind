import { Text, View } from "react-native";
import { render } from "@testing-library/react-native";
import { TestProvider } from "./runner";
import { StyledComponent } from "../../src";

// These are half the TailwindCSS gap values due the use of margins
// const cases = [["0"], ["px"], ["0.5"], ["1"]];

describe("Flexbox & Grid - Gap", () => {
  test.each([["0"]])("gap-%s", (unit) => {
    const tree = render(
      <TestProvider>
        <StyledComponent component={View} className={`gap-${unit}`}>
          <Text>A</Text>
          <Text>B</Text>
        </StyledComponent>
      </TestProvider>
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });

  // test.each(cases)("gap-x-%s", (unit) => {
  //   const tree = render(
  //     <TestProvider css={`gap-x-${unit}`}>
  //       <StyledComponent component={View} className={`gap-x-${unit}`}>
  //         <Text>A</Text>
  //         <Text>B</Text>
  //       </StyledComponent>
  //     </TestProvider>
  //   ).toJSON();

  //   expect(tree).toMatchSnapshot();
  // });

  // test.each(cases)("gap-y-%s", (unit) => {
  //   const tree = render(
  //     <TestProvider css={`gap-y-${unit}`}>
  //       <StyledComponent component={View} className={`gap-y-${unit}`}>
  //         <Text>A</Text>
  //         <Text>B</Text>
  //       </StyledComponent>
  //     </TestProvider>
  //   ).toJSON();

  //   expect(tree).toMatchSnapshot();
  // });
});
