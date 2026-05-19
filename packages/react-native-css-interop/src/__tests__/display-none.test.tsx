/** @jsxImportSource test */
import { Text, View } from "react-native";

import { registerCSS, render, screen, setupAllComponents } from "test";

const testID = "react-native-css-interop";
setupAllComponents();

describe("display: none", () => {
  test("returns null for display: none", () => {
    registerCSS(`.hidden { display: none }`);

    render(<View testID={testID} className="hidden" />);

    // Element should not be in the tree
    expect(screen.queryByTestId(testID)).toBeNull();
  });

  test("returns null for hidden class (NativeWind)", () => {
    registerCSS(`.hidden { display: none }`);

    render(
      <View testID="parent">
        <View testID={testID} className="hidden">
          <Text>Should not render</Text>
        </View>
      </View>,
    );

    expect(screen.queryByTestId(testID)).toBeNull();
    expect(screen.getByTestId("parent")).toBeTruthy();
  });

  test("renders when display is not none", () => {
    registerCSS(`.flex { display: flex }`);

    render(<View testID={testID} className="flex" />);

    expect(screen.getByTestId(testID)).toBeTruthy();
  });

  test("handles style arrays with display: none", () => {
    registerCSS(`
      .bg-red { background-color: red }
      .hidden { display: none }
    `);

    render(<View testID={testID} className="bg-red hidden" />);

    expect(screen.queryByTestId(testID)).toBeNull();
  });

  test("re-renders when display changes from none", () => {
    registerCSS(`
      .hidden { display: none }
      .flex { display: flex }
    `);

    const { rerender } = render(<View testID={testID} className="hidden" />);
    expect(screen.queryByTestId(testID)).toBeNull();

    rerender(<View testID={testID} className="flex" />);
    expect(screen.getByTestId(testID)).toBeTruthy();
  });

  test("does not render children when parent has display: none", () => {
    registerCSS(`.hidden { display: none }`);

    render(
      <View testID="parent" className="hidden">
        <View testID="child">
          <Text testID="grandchild">Should not render</Text>
        </View>
      </View>,
    );

    expect(screen.queryByTestId("parent")).toBeNull();
    expect(screen.queryByTestId("child")).toBeNull();
    expect(screen.queryByTestId("grandchild")).toBeNull();
  });
});
