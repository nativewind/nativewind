import { View, Text } from "react-native";
import { render } from "@testing-library/react-native";

import { styled, withPlatformTheme } from "../../src";
import { TestProvider } from "../tailwindcss/runner";

// const StyledView = styled(View);
const StyledText = styled(Text);

describe("Device functions", () => {
  test("theme functions", () => {
    const theme = {
      extend: {
        fontSize: {
          hairline: "hairlineWidth()",
          custom: "roundToNearestPixel(hairlineWidth())",
        },
      },
    };

    const tree = render(
      <TestProvider theme={theme}>
        <View>
          <StyledText className="text-custom">Test</StyledText>
        </View>
      </TestProvider>
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });

  test("withPlatformTheme", () => {
    const theme = withPlatformTheme({
      content: [],
      theme: {
        fontSize: {
          sm: {
            ios: "roundToNearestPixel(15)",
            default: 10,
          },
        },
        extend: {
          fontSize: {
            custom: {
              ios: 16,
              android: 17,
              default: 17,
            },
          },
        },
      },
    }).theme;

    const tree = render(
      <TestProvider theme={theme}>
        <View>
          <StyledText className="text-custom text-sm">Test</StyledText>
        </View>
      </TestProvider>
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
