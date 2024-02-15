import {
  TextInput as RNTextInput,
  Switch as RNSwitch,
  View as RNView,
} from "react-native";
import { createMockComponent, renderTailwind } from "../test-utils";
import { fireEvent, screen } from "@testing-library/react-native";
import { resetStyles } from "react-native-css-interop/testing-library";

const View = createMockComponent(RNView);
const TextInput = createMockComponent(RNTextInput);
const Switch = createMockComponent(RNSwitch);
const testID = "component";

beforeEach(() => resetStyles());

test("hover", async () => {
  await renderTailwind(
    <TextInput testID={testID} className="hover:text-white" />,
  );

  const component = screen.getByTestId(testID);

  expect(component).toHaveStyle(undefined);

  fireEvent(component, "hoverIn");
  expect(component).toHaveStyle({ color: "rgba(255, 255, 255, 1)" });

  fireEvent(component, "hoverOut");
  expect(component).toHaveStyle(undefined);
});

test("focus", async () => {
  await renderTailwind(
    <TextInput testID={testID} className="focus:text-white" />,
  );

  const component = screen.getByTestId(testID);

  expect(component).toHaveStyle(undefined);

  fireEvent(component, "focus");
  expect(component).toHaveStyle({ color: "rgba(255, 255, 255, 1)" });

  fireEvent(component, "blur");
  expect(component).toHaveStyle(undefined);
});

test("active", async () => {
  await renderTailwind(
    <TextInput testID={testID} className="active:text-white" />,
  );

  const component = screen.getByTestId(testID);

  expect(component).toHaveStyle(undefined);

  fireEvent(component, "pressIn");
  expect(component).toHaveStyle({ color: "rgba(255, 255, 255, 1)" });

  fireEvent(component, "pressOut");
  expect(component).toHaveStyle(undefined);
});

test("mixed", async () => {
  await renderTailwind(
    <TextInput testID={testID} className="active:hover:focus:text-white" />,
  );

  const component = screen.getByTestId(testID);
  expect(component).toHaveStyle(undefined);

  fireEvent(component, "pressIn");
  expect(component).toHaveStyle(undefined);

  fireEvent(component, "hoverIn");
  expect(component).toHaveStyle(undefined);

  fireEvent(component, "focus");
  expect(component).toHaveStyle({ color: "rgba(255, 255, 255, 1)" });
});

test("selection", async () => {
  await renderTailwind(
    <TextInput testID={testID} className="selection:text-black" />,
  );

  const component = screen.getByTestId(testID);
  expect(component.props).toEqual(
    expect.objectContaining({
      testID,
      selectionColor: "rgba(0, 0, 0, 1)",
      children: undefined,
      style: undefined,
    }),
  );
});

test("ltr:", async () => {
  await renderTailwind(<View testID={testID} className="ltr:text-black" />);

  const component = screen.getByTestId(testID);
  expect(component).toHaveStyle({
    color: "rgba(0, 0, 0, 1)",
  });
});

test("placeholder", async () => {
  await renderTailwind(
    <TextInput testID={testID} className="placeholder:text-black" />,
  );

  const component = screen.getByTestId(testID);
  expect(component.props).toEqual(
    expect.objectContaining({
      testID,
      placeholderTextColor: "rgba(0, 0, 0, 1)",
      children: undefined,
      style: undefined,
    }),
  );
});

test("disabled", async () => {
  const { rerender } = await renderTailwind(
    <Switch testID={testID} className="disabled:bg-black" />,
  );

  const component = screen.getByTestId(testID);
  expect(component.props).toEqual(
    expect.objectContaining({
      testID,
      style: {
        height: 31,
        width: 51,
      },
    }),
  );

  await rerender(
    <Switch testID={testID} disabled className="disabled:bg-black" />,
  );

  expect(component.props).toEqual(
    expect.objectContaining({
      testID,
      style: [
        {
          height: 31,
          width: 51,
        },
        {
          backgroundColor: "rgba(0, 0, 0, 1)",
        },
      ],
    }),
  );

  await rerender(
    <Switch testID={testID} disabled={false} className="disabled:bg-black" />,
  );

  expect(component.props).toEqual(
    expect.objectContaining({
      testID,
      style: {
        height: 31,
        width: 51,
      },
    }),
  );
});
