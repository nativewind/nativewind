import { render } from "@testing-library/react-native";
import { View } from "react-native";

import {
  createMockComponent,
  registerCSS,
  resetStyles,
} from "../testing-library";

const testID = "react-native-css-interop";
const A = createMockComponent(View);

beforeEach(() => resetStyles());

describe("hsl", () => {
  test("inline with slash", () => {
    registerCSS(`.my-class { 
    color: hsl(0 84.2% 60.2%); 
  }`);

    const component = render(
      <A testID={testID} className="my-class" />,
    ).getByTestId(testID);

    expect(component).toHaveStyle({
      color: "rgba(239, 68, 68, 1)",
    });
  });

  test("inline with comma", () => {
    registerCSS(`.my-class { 
    color: hsl(0, 84.2%, 60.2%); 
  }`);

    const component = render(
      <A testID={testID} className="my-class" />,
    ).getByTestId(testID);

    expect(component).toHaveStyle({
      color: "rgba(239, 68, 68, 1)",
    });
  });

  test("function with slash", () => {
    registerCSS(`.my-class { 
    --primary: 0 84.2% 60.2%;
    color: hsl(var(--primary)); 
  }`);

    const component = render(
      <A testID={testID} className="my-class" />,
    ).getByTestId(testID);

    expect(component).toHaveStyle({ color: "hsl(0 84.2% 60.2%)" });
  });

  test("function with comma", () => {
    registerCSS(`.my-class { 
    --primary: 0, 84.2%, 60.2%;
    color: hsl(var(--primary)); 
  }`);

    const component = render(
      <A testID={testID} className="my-class" />,
    ).getByTestId(testID);

    expect(component).toHaveStyle({ color: "hsl(0 84.2% 60.2%)" });
  });
});

describe("hsla", () => {
  test("inline with slash", () => {
    registerCSS(`.my-class { 
    color: hsla(0 84.2% 60.2% / 60%); 
  }`);

    const component = render(
      <A testID={testID} className="my-class" />,
    ).getByTestId(testID);

    expect(component).toHaveStyle({
      color: "rgba(239, 68, 68, 0.6000000238418579)",
    });
  });

  test("inline with comma", () => {
    registerCSS(`.my-class { 
    color: hsla(0, 84.2%, 60.2%, 60%); 
  }`);

    const component = render(
      <A testID={testID} className="my-class" />,
    ).getByTestId(testID);

    expect(component).toHaveStyle({
      color: "rgba(239, 68, 68, 0.6000000238418579)",
    });
  });

  test("function with slash", () => {
    registerCSS(`.my-class { 
    --primary: 0 84.2% 60.2% / 60%;
    color: hsla(var(--primary)); 
  }`);

    const component = render(
      <A testID={testID} className="my-class" />,
    ).getByTestId(testID);

    expect(component).toHaveStyle({ color: "hsla(0 84.2% 60.2% / 60%)" });
  });

  test("function with comma", () => {
    registerCSS(`.my-class { 
    --primary: 0, 84.2%, 60.2%, 60%;
    color: hsla(var(--primary)); 
  }`);

    const component = render(
      <A testID={testID} className="my-class" />,
    ).getByTestId(testID);

    expect(component).toHaveStyle({ color: "hsla(0 84.2% 60.2% / 60%)" });
  });
});
