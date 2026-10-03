/** @jsxImportSource test */
import { memo, useEffect } from "react";
import { View, ViewProps } from "react-native";

import {
  act,
  cssInterop,
  registerCSS,
  render,
  screen,
  setupAllComponents,
  useUnstableNativeVariable,
  VariableContext,
  vars,
} from "test";

import { cssVariableObservable } from "../runtime/native/appearance-observables";

const testID = "react-native-css-interop";
setupAllComponents();

test("inline variable", () => {
  registerCSS(`.my-class { width: var(--my-var); --my-var: 10px; }`);

  render(<View testID={testID} className="my-class" />);
  const component = screen.getByTestId(testID);

  expect(component).toHaveStyle({
    width: 10,
  });
});

test("combined inline variable", () => {
  registerCSS(`
    .my-class-1 { width: var(--my-var); }
    .my-class-2 { --my-var: 10px; }
    .my-class-3 { --my-var: 20px; }
  `);

  render(<View testID={testID} className="my-class-1 my-class-2" />);
  const component = screen.getByTestId(testID);

  expect(component).toHaveStyle({
    width: 10,
  });

  // Prove that the order doesn't matter
  screen.rerender(<View testID={testID} className="my-class-1 my-class-3" />);

  expect(component).toHaveStyle({
    width: 20,
  });
});

test("inherit variables", () => {
  registerCSS(`
    .my-class-1 { width: var(--my-var); }
    .my-class-2 { --my-var: 10px; }
    .my-class-3 { --my-var: 20px; }
  `);

  const effect = jest.fn();
  const Child = (props: ViewProps) => {
    useEffect(effect);
    return <View {...props} />;
  };

  cssInterop(Child, {
    className: "style",
  });

  const { getByTestId } = render(
    <View testID="a" className="my-class-2">
      <Child testID="b" className="my-class-1" />
    </View>,
  );

  const a = getByTestId("a");
  let b = getByTestId("b");

  expect(a).toHaveStyle(undefined);
  expect(b).toHaveStyle({ width: 10 });
  expect(effect).toHaveBeenCalledTimes(1);

  screen.rerender(
    <View testID="a" className="my-class-3">
      <View testID="b" className="my-class-1" />
    </View>,
  );

  b = getByTestId("b");

  // expect(B.mock).toHaveBeenCalledTimes(2);
  expect(a).toHaveStyle(undefined);
  expect(b).toHaveStyle({ width: 20 });
});

test("inherit variables - memo", () => {
  const effect = jest.fn();
  const Child = memo((props: ViewProps) => {
    useEffect(effect);
    return <View {...props} />;
  });

  cssInterop(Child, {
    className: "style",
  });

  registerCSS(`
    .my-class-1 { width: var(--my-var); }
    .my-class-2 { --my-var: 10px; }
    .my-class-3 { --my-var: 20px; }
  `);

  const { getByTestId } = render(
    <View testID="a" className="my-class-2">
      <Child testID="b" className="my-class-1" />
    </View>,
  );

  const a = getByTestId("a");
  let b = getByTestId("b");

  expect(a).toHaveStyle(undefined);
  expect(b).toHaveStyle({ width: 10 });

  screen.rerender(
    <View testID="a" className="my-class-3">
      <Child testID="b" className="my-class-1" />
    </View>,
  );

  b = getByTestId("b");

  expect(a).toHaveStyle(undefined);
  expect(b).toHaveStyle({ width: 20 });
});

test("inheriting variables does not enumerate or read unused variables", () => {
  registerCSS(`.width { width: var(--width); }`);
  const unused = jest.fn(() => 20);
  const ownKeys = jest.fn(Reflect.ownKeys);
  const variables = new Proxy(
    {
      "--width": 10,
      get "--unused"() {
        return unused();
      },
    },
    { ownKeys },
  );

  render(
    <VariableContext.Provider value={variables}>
      <View className="width">
        <View testID={testID} className="width" />
      </View>
    </VariableContext.Provider>,
  );

  expect(screen.getByTestId(testID)).toHaveStyle({ width: 10 });
  expect([ownKeys.mock.calls.length, unused.mock.calls.length]).toEqual([0, 0]);
});

test("inherited variables follow a replacement parent scope", () => {
  registerCSS(`.width { width: var(--width); }`);
  const child = <View testID={testID} className="width" />;

  render(
    <VariableContext.Provider value={{ "--width": 10 }}>
      {child}
    </VariableContext.Provider>,
  );
  expect(screen.getByTestId(testID)).toHaveStyle({ width: 10 });

  screen.rerender(
    <VariableContext.Provider value={{ "--width": 20 }}>
      {child}
    </VariableContext.Provider>,
  );
  expect(screen.getByTestId(testID)).toHaveStyle({ width: 20 });
});

test("inherited observable variables stay subscribed", () => {
  registerCSS(`.width { width: var(--width); }`);
  const width = cssVariableObservable({ light: 10 });

  render(
    <VariableContext.Provider value={{ "--width": width }}>
      <View className="width">
        <View testID={testID} className="width" />
      </View>
    </VariableContext.Provider>,
  );
  expect(screen.getByTestId(testID)).toHaveStyle({ width: 10 });

  act(() => width.set({ light: 20 }));
  expect(screen.getByTestId(testID)).toHaveStyle({ width: 20 });
});

test("local variables can be removed without changing siblings or their parent", () => {
  registerCSS(`.width { width: var(--width); }`);
  const parent = Object.freeze({ "--width": 10 });
  const tree = (
    style?: ReturnType<typeof vars>,
    scope: Record<string, number> = parent,
  ) => (
    <VariableContext.Provider value={scope}>
      <View>
        <View testID="local" className="width" style={style}>
          <View testID="descendant" className="width" />
        </View>
        <View testID="sibling" className="width" />
      </View>
    </VariableContext.Provider>
  );

  render(tree(vars({ width: 20 })));
  expect(screen.getByTestId("local")).toHaveStyle({ width: 20 });
  expect(screen.getByTestId("descendant")).toHaveStyle({ width: 20 });
  expect(screen.getByTestId("sibling")).toHaveStyle({ width: 10 });

  screen.rerender(tree());
  expect(screen.getByTestId("local")).toHaveStyle({ width: 10 });
  expect(screen.getByTestId("descendant")).toHaveStyle({ width: 10 });
  expect(screen.getByTestId("sibling")).toHaveStyle({ width: 10 });

  screen.rerender(tree(undefined, Object.freeze({ "--width": 30 })));
  expect(screen.getByTestId("local")).toHaveStyle({ width: 30 });
  expect(screen.getByTestId("descendant")).toHaveStyle({ width: 30 });
  expect(screen.getByTestId("sibling")).toHaveStyle({ width: 30 });
  expect(parent).toEqual({ "--width": 10 });
});

test("root variables remain reactive after removing a local override", () => {
  registerCSS(`
    :root { --width: 10px; }
    .width { width: var(--width); }
  `);
  const tree = (style?: ReturnType<typeof vars>) => (
    <View style={style}>
      <View testID={testID} className="width" />
    </View>
  );

  render(tree(vars({ width: 20 })));
  expect(screen.getByTestId(testID)).toHaveStyle({ width: 20 });

  screen.rerender(tree());
  expect(screen.getByTestId(testID)).toHaveStyle({ width: 10 });

  act(() =>
    registerCSS(`
      :root { --width: 30px; }
      .width { width: var(--width); }
    `),
  );
  expect(screen.getByTestId(testID)).toHaveStyle({ width: 30 });
});

test(":root variables", () => {
  registerCSS(`
    :root { --my-var: red; }
    .my-class { color: var(--my-var); }
  `);

  const component = render(
    <View testID={testID} className="my-class" />,
  ).getByTestId(testID);

  expect(component).toHaveStyle({ color: "red" });
});

test("can apply and set new variables", () => {
  registerCSS(`
    :root { --my-var: red; }
    .my-class { color: var(--my-var); --another-var: green; }
    .another-class { color: var(--another-var); }
  `);

  const testIDs = {
    one: "one",
    two: "two",
    three: "three",
  };

  render(
    <View testID={testIDs.one} className="my-class">
      <View testID={testIDs.two} className="my-class" />
      <View testID={testIDs.three} className="another-class" />
    </View>,
  );

  expect(screen.getByTestId(testIDs.one)).toHaveStyle({ color: "red" });
  expect(screen.getByTestId(testIDs.two)).toHaveStyle({ color: "red" });
  expect(screen.getByTestId(testIDs.three)).toHaveStyle({ color: "green" });
});

test("variables will be collected", () => {
  registerCSS(`
    :root { --my-var: red; }
    .green { --var-2: green; }
    .blue { --var-3: blue; }
    .color { color: var(--var-2); }
    .background { background-color: var(--var-3); }
  `);

  const testIDs = {
    one: "one",
    two: "two",
    three: "three",
  };

  render(
    <View testID={testIDs.one} className="green">
      <View testID={testIDs.two} className="blue">
        <View testID={testIDs.three} className="color background" />
      </View>
    </View>,
  );

  expect(screen.getByTestId(testIDs.three)).toHaveStyle({
    color: "green",
    backgroundColor: "blue",
  });
});

test("useUnsafeVariable", () => {
  registerCSS(`
    :root { --my-var: red; }
    .test { color: var(--my-var); }
  `);

  let myVar;

  const Component = () => {
    myVar = useUnstableNativeVariable("--my-var");
    return null;
  };

  render(<Component />);

  expect(myVar).toEqual("red");
});
