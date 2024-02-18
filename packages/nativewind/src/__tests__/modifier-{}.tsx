import { resetStyles } from "react-native-css-interop/testing-library";
import { testCases } from "../test-utils";

afterEach(() => resetStyles());

describe("{}/<props>:", () => {
  testCases(
    ["{}/test:color-black", { props: { test: "rgba(0, 0, 0, 1)" } }],
    [
      "{}/test.nested:color-black",
      { props: { test: { nested: "rgba(0, 0, 0, 1)" } } },
    ],
    [
      "{}/&test:color-black",
      { props: { style: { test: "rgba(0, 0, 0, 1)" } } },
    ],
    [
      "{}/&test.nested:color-black",
      { props: { style: { test: { nested: "rgba(0, 0, 0, 1)" } } } },
    ],
  );
});

// {}-[prop] is an alias for {}/<prop>:
describe("{}-[prop]:", () => {
  testCases(
    ["{}-[test]:color-black", { props: { test: "rgba(0, 0, 0, 1)" } }],
    [
      "{}-[test.nested]:color-black",
      { props: { test: { nested: "rgba(0, 0, 0, 1)" } } },
    ],
    [
      "{}-[&test]:color-black",
      { props: { style: { test: "rgba(0, 0, 0, 1)" } } },
    ],
    [
      "{}-[&test.nested]:color-black",
      { props: { style: { test: { nested: "rgba(0, 0, 0, 1)" } } } },
    ],
  );
});

describe("{}-[props]/<attributes>:", () => {
  testCases(
    [
      "{}-[test]/fontSize:text-base",
      { props: { test: 14 }, style: { lineHeight: 21 } },
    ],
    [
      "{}-[test.nested]/fontSize:text-base",
      { props: { test: { nested: 14 } }, style: { lineHeight: 21 } },
    ],
    ["{}-[&test]/fontSize:text-base", { style: { lineHeight: 21, test: 14 } }],
    [
      "{}-[&test.nested]/fontSize:text-base",
      { style: { lineHeight: 21, test: { nested: 14 } } },
    ],
  );
});
