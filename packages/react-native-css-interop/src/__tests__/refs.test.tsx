/** @jsxImportSource test */
import {
  createRef,
  forwardRef,
  PureComponent,
  useImperativeHandle,
} from "react";
import { ViewProps } from "react-native";

import { createMockComponent, registerCSS, render } from "test";

const testID = "react-native-css-interop";
const mapping = { className: "style" } as const;

const FunctionComponent = createMockComponent((_: ViewProps) => null, mapping);

const ForwardRef = createMockComponent(
  forwardRef((props: ViewProps, ref: any) => {
    useImperativeHandle(ref, () => ({
      getProps: () => props,
    }));

    return null;
  }),
  mapping,
);

const ClassComponent = createMockComponent(
  class MyComponent extends PureComponent<ViewProps> {
    getProps = () => {
      return this.props;
    };
    render() {
      return null;
    }
  },
  mapping,
);

const ChildComponent = createMockComponent(
  forwardRef((props: ViewProps, ref: any) => {
    return <ClassComponent ref={ref} {...props} />;
  }),
  mapping,
);

test("FunctionComponent", () => {
  registerCSS(`.my-class { color: red; }`);
  const ref = createRef<any>();

  const originalError = console.error;
  const mockError = jest.fn();
  console.error = mockError;

  render(
    <FunctionComponent ref={ref as any} testID={testID} className="my-class" />,
  );

  expect(mockError.mock.lastCall?.[0]).toMatch(
    /Warning: Function components cannot be given refs\. Attempts to access this ref will fail\. Did you mean to use React\.forwardRef()?/,
  );

  console.error = originalError;
});

test("ForwardRef", () => {
  registerCSS(`.my-class { color: red; }`);
  const ref = createRef<any>();

  render(<ForwardRef ref={ref} testID={testID} className="my-class" />);

  expect(ref.current?.getProps().style).toEqual({
    color: "#ff0000",
  });
});

test("ClassComponent", () => {
  registerCSS(`.my-class { color: red; }`);
  const ref = createRef<any>();

  render(<ClassComponent ref={ref} testID={testID} className="my-class" />);

  expect(ref.current?.getProps().style).toEqual({
    color: "#ff0000",
  });
});

test("ChildComponent", () => {
  registerCSS(`.my-class { color: red; }`);
  const ref = createRef<any>();

  render(<ChildComponent ref={ref} testID={testID} className="my-class" />);

  expect(ref.current?.getProps().style).toEqual({
    color: "#ff0000",
  });
});
