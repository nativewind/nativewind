import { resetStyles } from "react-native-css-interop/testing-library";
import { testCases } from "../test-utils";

afterEach(() => resetStyles());

describe("Custom - Ripple Color", () => {
  testCases([
    "ripple-black",
    { props: { android_ripple: { color: "rgba(0, 0, 0, 1)" } } },
  ]);
});

describe("Custom - prop/<prop>", () => {
  testCases(["prop/test:color-black", { props: { test: "rgba(0, 0, 0, 1)" } }]);
});

describe("Custom - prop-[attribute]/<prop>", () => {
  testCases([
    "prop-[font-size]/test:text-base",
    { props: { test: 14 }, style: { lineHeight: 21 } },
  ]);
});

describe("Custom - move/<prop>", () => {
  testCases([
    "move/test:text-base",
    { props: { test: { fontSize: 14, lineHeight: 21 } } },
  ]);
});

describe("Custom - move-[attribute]/<prop>", () => {
  testCases([
    "move-[font-size]/test:text-base",
    { props: { test: { fontSize: 14 } }, style: { lineHeight: 21 } },
  ]);
});

describe("Custom - Ripple Borderless", () => {
  testCases([
    "ripple-borderless",
    { props: { android_ripple: { borderless: true } } },
  ]);
});
