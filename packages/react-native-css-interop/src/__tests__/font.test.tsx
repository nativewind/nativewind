import { View } from "react-native";

import {
  createMockComponent,
  registerCSS,
  resetStyles,
  render,
} from "test-utils";

const testID = "react-native-css-interop";
const A = createMockComponent(View);

beforeEach(() => resetStyles());

test("heading", () => {
  registerCSS(`.my-class { font-size: 3rem; line-height: 1; }`);

  const component = render(
    <A testID={testID} className="my-class" />,
  ).getByTestId(testID);

  expect(component).toHaveStyle({
    fontSize: 42,
    lineHeight: 42,
  });
});
