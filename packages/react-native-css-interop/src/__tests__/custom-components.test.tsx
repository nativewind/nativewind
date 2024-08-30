import { TextInput } from "react-native";
import { screen, cssInterop, registerCSS, render } from "test-utils";

const testID = "react-native-css-interop";

it("can create custom components", () => {
  registerCSS(`
    .a {
      color: red;
      text-align: center;
    }
    .b {
      color: blue;
    }
  `);

  const MyTextInput = cssInterop(TextInput, {
    className: {
      target: "style",
      nativeStyleToProp: {
        textAlign: true,
      },
    },
    placeholderClassName: {
      // This is just for a test, people should use `placeholder:`
      target: false,
      nativeStyleToProp: {
        color: "placeholderTextColor",
      },
    },
  });

  render(
    <MyTextInput testID={testID} className="a" placeholderClassName="b" />,
  );

  const comp = screen.getByTestId(testID);

  expect(comp.props).toStrictEqual({
    children: undefined,
    testID,
    placeholderTextColor: "rgba(0, 0, 255, 1)",
    textAlign: "center",
    style: {
      color: "rgba(255, 0, 0, 1)",
    },
  });
});
