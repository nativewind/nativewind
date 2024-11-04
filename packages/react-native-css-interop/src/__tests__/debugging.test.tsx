/** @jsxImportSource test */
import { View } from "react-native";

import { registerCSS, render, screen, setupAllComponents } from "test";

setupAllComponents();

describe("debugging", () => {
  const originalLog = console.log;

  beforeEach(() => {
    console.log = jest.fn();
  });

  afterEach(() => {
    console.log = originalLog;
  });

  test("static props", () => {
    registerCSS(`.my-class {
    color: hsl(0 84.2% 60.2%);
    padding: 10px;
  }`);

    const testID = "debugClassName";

    render(<View testID={testID} className="my-class" />);
    const component = screen.getByTestId(testID);

    expect(component).toHaveStyle({
      color: "#ef4444",
      padding: 10,
    });

    expect(console.log)
      .toHaveBeenCalledWith(`Debugging component.testID 'debugClassName'

{
  "originalProps": {
    "testID": "debugClassName",
    "className": "my-class"
  },
  "props": {
    "testID": "debugClassName",
    "ref": null,
    "style": {
      "color": "#ef4444",
      "padding": 10
    }
  },
  "variables": {},
  "containers": {}
}`);
  });

  test("animated props", () => {
    registerCSS(`.my-class {
    color: hsl(0 84.2% 60.2%);
    padding: 10px;
    transition: color;
  }`);

    const testID = "debugClassName";

    render(<View testID={testID} className="my-class" />);
    const component = screen.getByTestId(testID);

    expect(component).toHaveStyle({
      color: "#ef4444",
      padding: 10,
    });

    expect(console.log)
      .toHaveBeenCalledWith(`Debugging component.testID 'debugClassName'

{
  "originalProps": {
    "testID": "debugClassName",
    "className": "my-class"
  },
  "props": {
    "testID": "debugClassName",
    "ref": null,
    "style": {
      "color": "#ef4444 (animated value)",
      "padding": 10
    }
  },
  "variables": {},
  "containers": {}
}`);
  });

  test("variables", () => {
    registerCSS(`.my-class {
    color: hsl(0 84.2% var(--test));
    --test: 50%
  }`);

    const testID = "debugClassName";

    render(<View testID={testID} className="my-class" />);
    const component = screen.getByTestId(testID);

    expect(component).toHaveStyle({
      color: "hsl(0, 84.2%, 50%)",
    });

    expect(console.log)
      .toHaveBeenCalledWith(`Debugging component.testID 'debugClassName'

{
  "originalProps": {
    "testID": "debugClassName",
    "className": "my-class"
  },
  "props": {
    "testID": "debugClassName",
    "ref": null,
    "style": {
      "color": "hsl(0, 84.2%, 50%)"
    }
  },
  "variables": {
    "--test": "50%"
  },
  "containers": {}
}`);
  });

  test("containers", () => {
    registerCSS(`.my-class {
    color: hsl(0 84.2% 60.2%);
    container-name: test;
  }`);

    const testID = "debugClassName";

    render(<View testID={testID} className="my-class" />);
    const component = screen.getByTestId(testID);

    expect(component).toHaveStyle({
      color: "#ef4444",
    });

    expect(console.log).toHaveBeenCalledTimes(1);
    expect(console.log)
      .toHaveBeenCalledWith(`Debugging component.testID 'debugClassName'

{
  "originalProps": {
    "testID": "debugClassName",
    "className": "my-class"
  },
  "props": {
    "testID": "debugClassName",
    "onPressIn": "[Function]",
    "onPressOut": "[Function]",
    "onHoverIn": "[Function]",
    "onHoverOut": "[Function]",
    "onFocus": "[Function]",
    "onBlur": "[Function]",
    "onPress": "[Function]",
    "onLayout": "[Function]",
    "ref": null,
    "style": {
      "color": "#ef4444"
    }
  },
  "variables": {},
  "containers": {
    "test": {
      "initialRender": false,
      "originalProps": "[Circular]",
      "props": {},
      "canUpgradeWarn": false,
      "animated": 0,
      "containers": 1,
      "variables": 0,
      "pressable": 1,
      "active": false,
      "hover": false,
      "focus": false,
      "layout": [
        0,
        0
      ]
    },
    "@__": "[Circular]"
  }
}`);
  });
});
