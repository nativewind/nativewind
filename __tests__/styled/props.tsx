import { render } from "@testing-library/react-native";
import { View, ViewProps, ViewStyle } from "react-native";
import { styled } from "../../src";
import { TestProvider } from "../tailwindcss/runner";

export interface StyledTestComponentProps extends ViewProps {
  style2: ViewStyle;
}

const StyledTestComponent = styled(
  ({ style, style2 }: StyledTestComponentProps) => {
    return (
      <>
        <View style={style} />
        <View style={style2} />
      </>
    );
  },
  {
    props: ["style2"],
  }
);

describe("Styled - Custom Props", () => {
  test("can style custom props", () => {
    const tree = render(
      <TestProvider css="m-1 p-2">
        <StyledTestComponent className="m-1" style2="p-2" />
      </TestProvider>
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
