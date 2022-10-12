import { testCompile } from "../utilities";

testCompile("gap-2", (output) => {
  expect(output).toStrictEqual({
    "gap-2": {
      childClasses: ["gap-2:children"],
      styles: [
        {
          marginLeft: {
            function: "rem",
            values: [-0.5],
          },
          marginTop: {
            function: "rem",
            values: [-0.5],
          },
        },
      ],
      topics: ["--rem"],
    },
    "gap-2:children": {
      styles: [
        {
          marginLeft: {
            function: "rem",
            values: [0.5],
          },
          marginTop: {
            function: "rem",
            values: [0.5],
          },
        },
      ],
      topics: ["--rem"],
    },
  });
});
