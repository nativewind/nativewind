import { testCompile } from "../utilities";

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
