import { Svg, Circle } from "react-native-svg";
import { render } from "@testing-library/react-native";
import { TestProvider } from "./runner";
import { styled } from "../../src";

const cases: Array<[string, string]> = [
  ["transparent", "transparent"],
  ["black", "#000"],
  ["white", "#fff"],
  ["slate-50", "#f8fafc"],
  ["gray-50", "#f9fafb"],
  ["zinc-50", "#fafafa"],
  ["neutral-50", "#fafafa"],
  ["stone-50", "#fafaf9"],
  ["red-50", "#fef2f2"],
  ["orange-50", "#fff7ed"],
  ["amber-50", "#fffbeb"],
  ["yellow-50", "#fefce8"],
  ["lime-50", "#f7fee7"],
  ["green-50", "#f0fdf4"],
  ["emerald-50", "#ecfdf5"],
  ["teal-50", "#f0fdfa"],
  ["cyan-50", "#ecfeff"],
  ["sky-50", "#f0f9ff"],
  ["blue-50", "#eff6ff"],
  ["indigo-50", "#eef2ff"],
  ["violet-50", "#f5f3ff"],
  ["purple-50", "#faf5ff"],
  ["fuchsia-50", "#fdf4ff"],
  ["pink-50", "#fdf2f8"],
  ["rose-50", "#fff1f2"],
];

const StyledCircle = styled(Circle, { cssProps: ["fill", "stroke"] });

describe("Svg - Stroke", () => {
  test.each(cases)("stroke-%s", (unit) => {
    const tree = render(
      <TestProvider css={`stroke-${unit}`}>
        <Svg>
          <StyledCircle stroke={`stroke-${unit}`} />
        </Svg>
      </TestProvider>
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });

  test("works with stroke width", () => {
    const tree = render(
      <TestProvider css="stroke-white stroke-1">
        <Svg>
          <StyledCircle stroke="stroke-white stroke-1" />
        </Svg>
      </TestProvider>
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
