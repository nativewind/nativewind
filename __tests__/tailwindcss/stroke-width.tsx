import { Svg, Circle } from "react-native-svg";
import { render } from "@testing-library/react-native";
import { TestProvider } from "./runner";
import { StyledComponent } from "../../src";

const cases: Array<[string, string]> = [
  ["0", "0"],
  ["1", "1"],
  ["2", "2"],
];

describe("Svg - Stroke Width", () => {
  test.each(cases)("stroke-%s", (unit) => {
    const tree = render(
      <TestProvider css={`stroke-${unit}`}>
        <Svg>
          <StyledComponent component={Circle} stroke={`stroke-${unit}`} />
        </Svg>
      </TestProvider>
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
