/** @jsxImportSource nativewind */
import { Switch, TextInput, View } from "react-native";

import { fireEvent, render, screen } from "../test";

const testID = "component";

test("hover", async () => {
  await render(<TextInput testID={testID} className="hover:text-white" />);

  const component = screen.getByTestId(testID);

  expect(component).toHaveStyle(undefined);

  fireEvent(component, "hoverIn");
  expect(component).toHaveStyle({ color: "#ffffff" });

  fireEvent(component, "hoverOut");
  expect(component).toHaveStyle(undefined);
});

test("focus", async () => {
  await render(<TextInput testID={testID} className="focus:text-white" />);

  const component = screen.getByTestId(testID);

  expect(component).toHaveStyle(undefined);

  fireEvent(component, "focus");
  expect(component).toHaveStyle({ color: "#ffffff" });

  fireEvent(component, "blur");
  expect(component).toHaveStyle(undefined);
});

test("active", async () => {
  await render(<TextInput testID={testID} className="active:text-white" />);

  const component = screen.getByTestId(testID);

  expect(component).toHaveStyle(undefined);

  fireEvent(component, "pressIn");
  expect(component).toHaveStyle({ color: "#ffffff" });

  fireEvent(component, "pressOut");
  expect(component).toHaveStyle(undefined);
});

test("mixed", async () => {
  await render(
    <TextInput testID={testID} className="active:hover:focus:text-white" />,
  );

  const component = screen.getByTestId(testID);
  expect(component).toHaveStyle(undefined);

  fireEvent(component, "pressIn");
  expect(component).toHaveStyle(undefined);

  fireEvent(component, "hoverIn");
  expect(component).toHaveStyle(undefined);

  fireEvent(component, "focus");
  expect(component).toHaveStyle({ color: "#ffffff" });
});

test("selection", async () => {
  await render(<TextInput testID={testID} className="selection:text-black" />);

  const component = screen.getByTestId(testID);
  expect(component.props).toEqual({
    testID,
    selectionColor: "#000000",
  });
});

test("ltr:", async () => {
  await render(<View testID={testID} className="ltr:text-black" />);

  const component = screen.getByTestId(testID);
  expect(component).toHaveStyle({
    color: "#000000",
  });
});

test("placeholder", async () => {
  await render(
    <TextInput testID={testID} className="placeholder:text-black" />,
  );

  const component = screen.getByTestId(testID);
  expect(component.props).toEqual({
    testID,
    placeholderTextColor: "#000000",
  });
});

test("disabled", async () => {
  const { rerender } = await render(
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

  rerender(<Switch testID={testID} disabled className="disabled:bg-black" />);

  expect(component.props).toEqual(
    expect.objectContaining({
      testID,
      style: [
        {
          height: 31,
          width: 51,
        },
        {
          backgroundColor: "#000000",
        },
      ],
    }),
  );

  rerender(
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
