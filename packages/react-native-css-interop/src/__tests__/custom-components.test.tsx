import { FunctionComponent } from "react";
import { TextInput, View } from "react-native";

import { cssInterop, registerCSS, render, screen } from "test";

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
    placeholderTextColor: "#0000ff",
    textAlign: "center",
    style: {
      color: "#ff0000",
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
        backgroundColor: "#0000ff",
        target: {
          color: "#ff0000",
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
        backgroundColor: "#0000ff",
        myColor: "#ff0000",
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
      nested: {
        myColor: "#ff0000",
        target: {
          backgroundColor: "#0000ff",
          fontSize: 14,
        },
      },
    },
  });
});
