import { render, screen } from "@testing-library/react-native";
import { View } from "react-native";

import {
  createMockComponent,
  registerCSS,
  resetStyles,
} from "../testing-library";
import { vars } from "../runtime/api";

const testID = "react-native-css-interop";
const A = createMockComponent(View);

beforeEach(() => resetStyles());

test("vars", () => {
  registerCSS(
    `.my-class {
        color: var(--test);
      }`,
  );

  render(
    <A testID={testID} className="my-class" style={vars({ test: "black" })} />,
  );

  const component = screen.getByTestId(testID);

  expect(component).toHaveStyle({
    color: "black",
  });

  screen.rerender(
    <A
      testID={testID + 1}
      className="my-class"
      style={vars({ test: "blue" })}
    />,
  );

  expect(component).toHaveStyle({
    color: "blue",
  });
});
