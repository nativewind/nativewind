import { resetStyles } from "react-native-css-interop/testing-library";
import { testCases } from "../test-utils";

afterEach(() => resetStyles());

describe("Custom - Ripple Color", () => {
  testCases([
    "ripple-black",
    { props: { android_ripple: { color: "rgba(0, 0, 0, 1)" } } },
  ]);
});

describe("Custom - Ripple Borderless", () => {
  testCases([
    "ripple-borderless",
    { props: { android_ripple: { borderless: true } } },
  ]);
});

describe("Custom - prop/<props>", () => {
  testCases(
    ["move/^test:color-black", { props: { test: "rgba(0, 0, 0, 1)" } }],
    [
      "move/^test.nested:color-black",
      { props: { test: { nested: "rgba(0, 0, 0, 1)" } } },
    ],
  );
});

describe("Custom - prop-[attribute]", () => {
  testCases([
    "move-[test]:color-black",
    { style: { test: "rgba(0, 0, 0, 1)" } },
  ]);
});

describe("Custom - prop-[attribute]/<prop>", () => {
  testCases([
    "move-[font-size]/^test:text-base",
    { props: { test: 14 }, style: { lineHeight: 21 } },
  ]);
});
