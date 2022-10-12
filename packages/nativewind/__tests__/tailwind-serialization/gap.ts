import { testCompile } from "../utilities";

testCompile("gap-2", (output) => {
  expect(output).toStrictEqual({
    "gap-2": {
      childClasses: ["gap-2:children"],
      topics: ["--rem"],
      styles: [
        {
          marginTop: { function: "rem", values: [-0.5] },
          marginLeft: { function: "rem", values: [-0.5] },
        },
      ],
    },
    "gap-2:children": {
      topics: ["--rem"],
      styles: [
        {
          marginTop: { function: "rem", values: [0.5] },
          marginLeft: { function: "rem", values: [0.5] },
        },
      ],
    },
  });
});
