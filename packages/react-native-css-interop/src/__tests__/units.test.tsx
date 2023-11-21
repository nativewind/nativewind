import { act, render } from "@testing-library/react-native";
import { View } from "react-native";

import { rem, vh, vw } from "../runtime/native/misc";
import { INTERNAL_SET } from "../shared";
import {
  createMockComponent,
  registerCSS,
  resetStyles,
} from "../testing-library";

const testID = "react-native-css-interop";
const A = createMockComponent(View);

beforeEach(() => resetStyles());

test("px", () => {
  registerCSS(`.my-class { width: 10px; }`);

  const component = render(
    <A testID={testID} className="my-class" />,
  ).getByTestId(testID);

  expect(component).toHaveStyle({
    width: 10,
  });
});

test("%", () => {
  registerCSS(`.my-class { width: 10%; }`);

  const component = render(
    <A testID={testID} className="my-class" />,
  ).getByTestId(testID);

  expect(component).toHaveStyle({
    width: "10%",
  });
});

test("vw", () => {
  registerCSS(`.my-class { width: 10vw; }`);

  const component = render(
    <A testID={testID} className="my-class" />,
  ).getByTestId(testID);

  expect(vw.get()).toEqual(750);
  expect(component).toHaveStyle({ width: 75 });

  act(() => {
    vw[INTERNAL_SET](100);
  });

  expect(vw.get()).toEqual(100);
  expect(component).toHaveStyle({ width: 10 });
});

test("vh", () => {
  registerCSS(`.my-class { height: 10vh; }`);

  const component = render(
    <A testID={testID} className="my-class" />,
  ).getByTestId(testID);

  expect(vh.get()).toEqual(1334);
  expect(component).toHaveStyle({ height: 133.4 });

  act(() => {
    vh[INTERNAL_SET](100);
  });

  expect(vh.get()).toEqual(100);
  expect(component).toHaveStyle({ height: 10 });
});

test("rem - default", () => {
  registerCSS(`.my-class { font-size: 10rem; }`);

  const component = render(
    <A testID={testID} className="my-class" />,
  ).getByTestId(testID);

  expect(component).toHaveStyle({ fontSize: 140 });
});

test("rem - override", () => {
  registerCSS(`.my-class { font-size: 10rem; }`, {
    inlineRem: 10,
  });

  const component = render(
    <A testID={testID} className="my-class" />,
  ).getByTestId(testID);

  expect(component).toHaveStyle({ fontSize: 100 });
});

test("rem - dynamic", () => {
  registerCSS(`.my-class { font-size: 10rem; }`, {
    inlineRem: false,
  });

  const component = render(
    <A testID={testID} className="my-class" />,
  ).getByTestId(testID);

  expect(rem.get()).toEqual(14);
  expect(component).toHaveStyle({ fontSize: 140 });

  act(() => {
    rem.set(10);
  });

  expect(rem.get()).toEqual(10);
  expect(component).toHaveStyle({ fontSize: 100 });
});

test.only("hsl", () => {
  registerCSS(`.my-class { 
    --primary: 0 84.2% 60.2%;
    color: hsl(var(--primary)); 
  }`);

  const component = render(
    <A testID={testID} className="my-class" />,
  ).getByTestId(testID);

  expect(component).toHaveStyle({ color: "hsl(0 84.2% 60.2%)" });
});
