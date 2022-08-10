import { View, Text } from "react-native";
import { render } from "@testing-library/react-native";

import {
  styled,
  platformSelect,
  roundToNearestPixel,
  hairlineWidth,
} from "../../src";
import { TestProvider } from "../tailwindcss/runner";

// const StyledView = styled(View);
const StyledText = styled(Text);

describe("Device functions", () => {
  test("theme functions", () => {
    const theme = {
      extend: {
        fontSize: {
          hairline: hairlineWidth(),
          custom: roundToNearestPixel(hairlineWidth()),
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
    const theme = {
      fontSize: {
        sm: platformSelect({
          ios: roundToNearestPixel(15),
          default: 10,
        }),
      },
      extend: {
        fontSize: {
          custom: platformSelect({
            ios: 16,
            android: 17,
            default: 17,
          }),
        },
      },
    };

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
