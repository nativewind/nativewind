/** @jsxImportSource test */
import { View } from "react-native";

import { registerCSS, render, screen, setupAllComponents } from "test";

const testID = "react-native-css-interop";
setupAllComponents();

test("heading", () => {
  registerCSS(`.my-class { font-size: 3rem; line-height: 1; }`);

  render(<View testID={testID} className="my-class" />);
  const component = screen.getByTestId(testID);

  expect(component).toHaveStyle({
    fontSize: 42,
    lineHeight: 42,
  });
});

describe("can override the rem value", () => {
  test("using :root", () => {
    registerCSS(`:root { font-size: 10px } .my-class { font-size: 3rem; }`);

    render(<View testID={testID} className="my-class" />);
    const component = screen.getByTestId(testID);

    expect(component).toHaveStyle({
      fontSize: 30,
    });
  });

  test("using :root (inlineRem)", () => {
    registerCSS(`:root { font-size: 10px } .my-class { font-size: 3rem; }`, {
      inlineRem: false,
    });

    render(<View testID={testID} className="my-class" />);
    const component = screen.getByTestId(testID);

    expect(component).toHaveStyle({
      fontSize: 30,
    });
  });

  test("using universal selector", () => {
    registerCSS(`* { font-size: 20px } .my-class { font-size: 3rem; }`, {
      inlineRem: false,
    });

    render(<View testID={testID} className="my-class" />);
    const component = screen.getByTestId(testID);

    expect(component).toHaveStyle({
      fontSize: 60,
    });
  });

  test("using inlineRem", () => {
    registerCSS(`* { font-size: 20px } .my-class { font-size: 3rem; }`, {
      inlineRem: 15,
    });

    render(<View testID={testID} className="my-class" />);
    const component = screen.getByTestId(testID);

    expect(component).toHaveStyle({
      fontSize: 45,
    });
  });
});
