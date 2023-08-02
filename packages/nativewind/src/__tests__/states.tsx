import { TextInput } from "react-native";
import { createMockComponent, renderTailwind } from "../test-utils";
import { fireEvent, screen } from "@testing-library/react-native";
import { resetStyles } from "react-native-css-interop/testing-library";

const A = createMockComponent(TextInput);
const testID = "component";

beforeEach(() => resetStyles());

test("hover", async () => {
  await renderTailwind(<A testID={testID} className="hover:text-white" />);

  const component = screen.getByTestId(testID);

  expect(component).toHaveStyle({});

  fireEvent(component, "hoverIn");
  expect(component).toHaveStyle({ color: "rgba(255, 255, 255, 1)" });

  fireEvent(component, "hoverOut");
  expect(component).toHaveStyle({});
});

test("focus", async () => {
  await renderTailwind(<A testID={testID} className="focus:text-white" />);

  const component = screen.getByTestId(testID);

  expect(component).toHaveStyle({});

  fireEvent(component, "focus");
  expect(component).toHaveStyle({ color: "rgba(255, 255, 255, 1)" });

  fireEvent(component, "blur");
  expect(component).toHaveStyle({});
});

test("active", async () => {
  await renderTailwind(<A testID={testID} className="active:text-white" />);

  const component = screen.getByTestId(testID);

  expect(component).toHaveStyle({});

  fireEvent(component, "pressIn");
  expect(component).toHaveStyle({ color: "rgba(255, 255, 255, 1)" });

  fireEvent(component, "pressOut");
  expect(component).toHaveStyle({});
});

test("mixed", async () => {
  await renderTailwind(
    <A testID={testID} className="active:hover:focus:text-white" />,
  );

  const component = screen.getByTestId(testID);
  expect(component).toHaveStyle({});

  fireEvent(component, "pressIn");
  expect(component).toHaveStyle({});

  fireEvent(component, "hoverIn");
  expect(component).toHaveStyle({});

  fireEvent(component, "focus");
  expect(component).toHaveStyle({ color: "rgba(255, 255, 255, 1)" });
});
