import { testCompile } from "../test-utils";

testCompile("divide-x-2", (output) => {
  expect(output).toStrictEqual({
    "divide-x-2": {
      styles: [],
      childClasses: ["divide-x-2:children"],
    },
    "divide-x-2:children": {
      conditions: ["not-first-child"],
      styles: [
        {
          borderLeftWidth: 2,
          borderRightWidth: 0,
        },
      ],
    },
  });
});

testCompile("sm:divide-x-2", (output) => {
  expect(output).toStrictEqual({
    "sm:divide-x-2": {
      styles: [],
      childClasses: ["sm:divide-x-2:children"],
    },
    "sm:divide-x-2:children": {
      conditions: ["not-first-child"],
      subscriptions: ["--window-width"],
      atRules: {
        "0": [["min-width", 640]],
      },
      styles: [
        {
          borderLeftWidth: 2,
          borderRightWidth: 0,
        },
      ],
    },
  });
});
