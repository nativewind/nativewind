import { testCompile } from "./utilities";

testCompile("space-x-2", (output) => {
  expect(output).toStrictEqual({
    "space-x-2": {
      styles: [],
      childClasses: ["space-x-2:children"],
    },
    "space-x-2:children": {
      conditions: ["not-first-child"],
      topics: ["--rem"],
      styles: [
        {
          marginLeft: { function: "rem", values: [0.5] },
        },
      ],
    },
  });
});
