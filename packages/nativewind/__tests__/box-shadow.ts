import { testCompile } from "./utilities";

testCompile("shadow", (output) => {
  expect(output).toStrictEqual({
    shadow: {
      styles: [
        {
          shadowColor: "rgba(0, 0, 0, 0.1)",
          shadowOffset: { width: 0, height: 2 },
          shadowRadius: 6,
        },
        {
          shadowColor: "rgba(0, 0, 0, 0.1)",
          shadowOffset: { width: 0, height: 2 },
          shadowRadius: 6,
        },
      ],
      atRules: {
        0: [["platform", "android"]],
        1: [["platform", "ios"]],
      },
    },
  });
});
