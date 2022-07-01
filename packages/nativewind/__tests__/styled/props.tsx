import { render } from "@testing-library/react-native";
import { View, ViewProps, ViewStyle, Text } from "react-native";
import { styled } from "../../src";
import { TestProvider } from "../tailwindcss/runner";

const StyledView = styled(View);
const Row = styled(View, "flex-row");
const StyledText = styled(Text);
StyledText.defaultProps = {
  accessibilityRole: "header",
};

const TestPropsComponent = styled(
  ({ style, style2 }: ViewProps & { style2: ViewStyle }) => {
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

const TestClassPropsComponent = styled(
  (props: ViewProps & { style2?: ViewStyle }) => <View {...props} />,
  {
    classProps: ["style2"],
  }
);

describe("Styled", () => {
  test("can render components", () => {
    const tree = render(
      <TestProvider>
        <StyledView className="m-1" />
        <StyledView className="p-2" />
      </TestProvider>
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });

  test("can style custom props", () => {
    const tree = render(
      <TestProvider>
        <TestPropsComponent className="m-1" style2="p-2" />
      </TestProvider>
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });

  test("can set base classNames", () => {
    const tree = render(
      <TestProvider>
        <Row />
      </TestProvider>
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });

  test("can add new classNames", () => {
    const tree = render(
      <TestProvider>
        <Row className="p-4" />
      </TestProvider>
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });

  test("can render with default props", () => {
    const tree = render(
      <TestProvider>
        <StyledText className="p-4" />
      </TestProvider>
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });

  test("classProps on native", () => {
    const tree = render(
      <TestProvider>
        <TestClassPropsComponent className="p-4" style2="m-1" />
      </TestProvider>
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });

  test("classProps on css", () => {
    const tree = render(
      <TestProvider preprocessed>
        <TestClassPropsComponent className="p-4" style2="m-1" />
      </TestProvider>
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
