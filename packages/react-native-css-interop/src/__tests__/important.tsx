import { render } from "@testing-library/react-native";
import { View } from "react-native";

import {
  createMockComponent,
  registerCSS,
  resetStyles,
} from "../testing-library";

const testID = "react-native-css-interop";
const A = createMockComponent(View);

beforeEach(() => resetStyles());

test("important", () => {
  registerCSS(`
    .red { color: red; }
    .blue { color: blue !important; }
  `);

  const component = render(
    <A testID={testID} className="blue red" />,
  ).getByTestId(testID);

  expect(component).toHaveStyle({
    color: "rgba(0, 0, 255, 1)",
  });
});
