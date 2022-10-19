import { testCompile } from "../test-utils";

testCompile("dark:text-red-500", (output) => {
  expect(output).toStrictEqual({
    "dark:text-red-500": {
      styles: [{ color: "#ef4444" }],
      atRules: { 0: [["--color-scheme", "dark"]] },
      topics: ["--color-scheme"],
    },
  });
});

testCompile(
  "dark:text-red-500",
  {
    nameSuffix: "using darkMode:class",
    config: {
      darkMode: "class",
    },
  },
  (output) => {
    expect(output).toStrictEqual({
      ":root": {
        variables: [{ "--dark-mode": "class" }],
      },
      "dark:text-red-500": {
        styles: [{ color: "#ef4444" }],
        atRules: { 0: [["--color-scheme", "dark"]] },
        topics: ["--color-scheme"],
      },
    });
  }
);
