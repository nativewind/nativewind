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
