/** @jsxImportSource react-native-css-interop */
import { TextInput, View } from "react-native";

import {
  cssInterop,
  registerCSS,
  render,
  resetComponents,
  screen,
} from "test-utils";

const testID = "react-native-css-interop";

beforeEach(() => {
  resetComponents();
});

test("mapping", () => {
  cssInterop(View as any, { className: "differentStyle" });

  registerCSS(
    `.bg-black { background-color: black } .text-white { color: white }`,
  );

  render(<View testID={testID} className="bg-black text-white" />);

  const component = screen.getByTestId(testID);

  expect(component.props).toEqual({
    testID,
    differentStyle: {
      backgroundColor: "rgba(0, 0, 0, 1)",
      color: "rgba(255, 255, 255, 1)",
    },
  });
});

test("multiple mapping", () => {
  cssInterop(View as any, { a: "styleA", b: "styleB" });

  registerCSS(
    `.bg-black { background-color: black } .text-white { color: white }`,
  );

  render(<View testID={testID} {...{ a: "bg-black", b: "text-white" }} />);

  const component = screen.getByTestId(testID);

  expect(component.props).toEqual({
    testID,
    styleA: {
      backgroundColor: "rgba(0, 0, 0, 1)",
    },
    styleB: {
      color: "rgba(255, 255, 255, 1)",
    },
  });
});

test("nativeStyleToProp target:string", () => {
  cssInterop(TextInput as any, {
    fooClassName: {
      target: "fooStyle",
      nativeStyleToProp: {
        color: "barTextColor",
        backgroundColor: true,
      },
    },
  });

  registerCSS(
    `.bg-black { background-color: black } .text-white { color: white } .flex { display: flex }`,
  );

  render(
    <TextInput
      testID={testID}
      {...{ fooClassName: "flex bg-black text-white" }}
    />,
  );

  const component = screen.getByTestId(testID);

  expect(component.props).toEqual({
    testID,
    fooStyle: {
      display: "flex",
    },
    backgroundColor: "rgba(0, 0, 0, 1)",
    barTextColor: "rgba(255, 255, 255, 1)",
  });
});

test("nativeStyleToProp target:boolean", () => {
  cssInterop(TextInput as any, {
    fooClassName: {
      target: false,
      nativeStyleToProp: {
        color: "barTextColor",
        backgroundColor: true,
      },
    },
  });

  registerCSS(
    `.bg-black { background-color: black } .text-white { color: white }`,
  );

  render(
    <TextInput testID={testID} {...{ fooClassName: "bg-black text-white" }} />,
  );

  const component = screen.getByTestId(testID);

  expect(component.props).toEqual({
    testID,
    backgroundColor: "rgba(0, 0, 0, 1)",
    barTextColor: "rgba(255, 255, 255, 1)",
  });
});
