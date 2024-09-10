import { FunctionComponent } from "react";
import { TextInput, View } from "react-native";
import { screen, cssInterop, registerCSS, render } from "test";

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

it("can target deeply nested props", () => {
  registerCSS(`
    .a {
      color: red;
      background-color: blue;
    }
  `);

  const MyComp: FunctionComponent<{
    testID?: string;
    deeply?: { nested: { target: any; backgroundColor: string } };
  }> = jest.fn((props) => <View {...props} />);

  const MyStyledComp = cssInterop(MyComp, {
    className: {
      target: "deeply.nested.target",
      nativeStyleToProp: {
        backgroundColor: "deeply.nested.backgroundColor",
      },
    },
  });

  render(<MyStyledComp testID={testID} className="a" />);

  expect(screen.getByTestId(testID).props).toStrictEqual({
    testID,
    children: undefined,
    deeply: {
      nested: {
        backgroundColor: "rgba(0, 0, 255, 1)",
        target: {
          color: "rgba(255, 0, 0, 1)",
        },
      },
    },
  });
});

it("works with @rn-move", () => {
  registerCSS(`
    .a {
      @rn-move color myColor;
      color: red;
      font-size: 14px;
      background-color: blue;
    }
  `);

  const MyComp: FunctionComponent<{
    testID?: string;
    deeply?: { nested: { target: any; backgroundColor: string } };
  }> = jest.fn((props) => <View {...props} />);

  const MyStyledComp = cssInterop(MyComp, {
    className: {
      target: "deeply.nested.target",
      nativeStyleToProp: {
        backgroundColor: "deeply.nested.backgroundColor",
      },
    },
  });

  render(<MyStyledComp testID={testID} className="a" />);

  expect(screen.getByTestId(testID).props).toStrictEqual({
    testID,
    children: undefined,
    deeply: {
      nested: {
        backgroundColor: "rgba(0, 0, 255, 1)",
        myColor: "rgba(255, 0, 0, 1)",
        target: {
          fontSize: 14,
        },
      },
    },
  });
});

it("works with @rn-move and nativeStyleToProps", () => {
  registerCSS(`
    .a {
      @rn-move color myColor;
      color: red;
      font-size: 14px;
      background-color: blue;
    }
  `);

  const MyComp: FunctionComponent<{
    testID?: string;
    deeply?: {
      nested: { target: any; backgroundColor: string };
      color?: string;
    };
  }> = jest.fn((props) => <View {...props} />);

  const MyStyledComp = cssInterop(MyComp, {
    className: {
      target: "deeply.nested.target",
      nativeStyleToProp: {
        color: "deeply.color",
      },
    },
  });

  render(<MyStyledComp testID={testID} className="a" />);

  expect(screen.getByTestId(testID).props).toStrictEqual({
    testID,
    children: undefined,
    deeply: {
      color: "rgba(255, 0, 0, 1)",
      nested: {
        target: {
          backgroundColor: "rgba(0, 0, 255, 1)",
          fontSize: 14,
        },
      },
    },
  });
});
