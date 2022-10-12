import { testCompile } from "../utilities";

testCompile("dark:text-red-500", (output) => {
  expect(output).toStrictEqual({
    "dark:text-red-500": {
      styles: [{ color: "#ef4444" }],
      atRules: { 0: [["--color-scheme", "dark"]] },
      topics: ["--color-scheme"],
    },
  });
});

testCompile.only(
  "dark:text-red-500",
  {
    name: "using darkMode:class",
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
