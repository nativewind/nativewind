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

testCompile("sm:gap-2", (output) => {
  expect(output).toStrictEqual({
    "sm:gap-2": {
      childClasses: ["sm:gap-2:children"],
      topics: ["--device-width", "--rem"],
      atRules: {
        0: [["min-width", 640]],
      },
      styles: [
        {
          marginTop: { function: "rem", values: [-0.5] },
          marginLeft: { function: "rem", values: [-0.5] },
        },
      ],
    },
    "sm:gap-2:children": {
      topics: ["--device-width", "--rem"],
      atRules: {
        0: [["min-width", 640]],
      },
      styles: [
        {
          marginTop: { function: "rem", values: [0.5] },
          marginLeft: { function: "rem", values: [0.5] },
        },
      ],
    },
  });
});
