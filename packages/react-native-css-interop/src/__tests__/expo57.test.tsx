const React = require("react");
const RN = require("react-native");
const { render, cleanup, act } = require("@testing-library/react-native");
const { cssInterop } = require("../index");
const { registerCSS, resetData } = require("../test");
const { getAnimatedStyle } = require("react-native-reanimated");
const { cssToReactNativeRuntime } = require("../css-to-rn");
const C = cssInterop(RN.View, { className: "style" });
beforeEach(() => {
  resetData();
  jest.useFakeTimers();
});
afterEach(() => {
  cleanup();
  jest.useRealTimers();
  jest.restoreAllMocks();
});
test("adding keyframes after mount preserves a valid animated host", () => {
  registerCSS(
    ".base {width:80px;} .animated {animation: grow 1s linear;} @keyframes grow {from {width:80px;} to {width:160px;}}",
  );
  const result = render(
    React.createElement(C, { testID: "subject", className: "base" }),
  );
  result.rerender(
    React.createElement(C, { testID: "subject", className: "base animated" }),
  );
  act(() => jest.advanceTimersByTime(500));
  expect(getAnimatedStyle(result.getByTestId("subject")).width).toBeGreaterThan(
    100,
  );
  result.rerender(
    React.createElement(C, { testID: "subject", className: "base" }),
  );
  expect(
    RN.StyleSheet.flatten(result.getByTestId("subject").props.style).width,
  ).toBe(80);
});
test("box shadow compilation never falls into aspect ratio parsing", () => {
  expect(() =>
    cssToReactNativeRuntime(
      Buffer.from(
        ".subject {box-shadow: 0px 2px 4px black; transition: box-shadow 1s linear;}",
      ),
    ),
  ).not.toThrow();
});
test.each(["light", "dark", "unspecified", null])(
  "initial Appearance value %s resolves to a usable scheme",
  (scheme) => {
    jest.isolateModules(() => {
      const { Appearance } = require("react-native");
      const spy = jest
        .spyOn(Appearance, "getColorScheme")
        .mockReturnValue(scheme);
      try {
        const {
          systemColorScheme,
        } = require("../runtime/native/appearance-observables");
        expect(systemColorScheme.get()).toBe(
          scheme === "dark" ? "dark" : "light",
        );
      } finally {
        spy.mockRestore();
      }
    });
  },
);
