import { render } from "@testing-library/react-native";
import { View } from "react-native";

import {
  createMockComponent,
  registerCSS,
  resetStyles,
} from "../testing-library";
import { vars } from "../runtime/native/variables";

const testID = "react-native-css-interop";
const A = createMockComponent(View);

beforeEach(() => resetStyles());

test("vars", () => {
  registerCSS(
    `.my-class {
        color: var(--test);
      }`,
  );

  const component = render(
    <A testID={testID} className="my-class" style={vars({ test: "black" })} />,
  ).getByTestId(testID);

  expect(component).toHaveStyle({
    color: "black",
  });
});
