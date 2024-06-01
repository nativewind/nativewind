import { SafeAreaProvider } from "react-native-safe-area-context";
import { View, ViewProps } from "react-native";

import {
  createMockComponent,
  registerCSS,
  resetStyles,
  render,
} from "test-utils";
import { useSafeAreaEnv } from "../runtime";

const testID = "react-native-css-interop";
const A = createMockComponent(View);

beforeEach(() => resetStyles());

test("safe-area-inset-*", () => {
  registerCSS(`.my-class {
    margin-top: env(safe-area-inset-top);
    margin-bottom: env(safe-area-inset-bottom);
    margin-left: env(safe-area-inset-left);
    margin-right: env(safe-area-inset-right);
  }`);

  const SafeView = (props: ViewProps) => {
    const safeAreaEnv = useSafeAreaEnv();
    return <A testID={testID} {...props} style={safeAreaEnv} />;
  };

  const component = render(
    <SafeAreaProvider
      initialMetrics={{
        insets: { top: 1, bottom: 2, left: 3, right: 4 },
        frame: { x: 0, y: 0, width: 0, height: 0 },
      }}
    >
      <SafeView className="my-class" />,
    </SafeAreaProvider>,
  ).getByTestId(testID);

  expect(component).toHaveStyle({
    marginTop: 1,
    marginBottom: 2,
    marginLeft: 3,
    marginRight: 4,
  });
});
