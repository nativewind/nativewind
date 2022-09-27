import { View, Text } from "react-native";
import { render } from "@testing-library/react-native";

import { styled } from "../../src";
import { TestProvider } from "../tailwindcss/runner";

const StyledText = styled(Text);

describe("transforms", () => {
  test("transforms", () => {
    const tree = render(
      <TestProvider>
        <View>
          <StyledText className="font-bold rotate-45 translate-x-px">
            Test
          </StyledText>
        </View>
      </TestProvider>
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
