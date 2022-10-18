import plugin from "tailwindcss/plugin";
import { CaseOutput, testSerialization } from "./__runner__";

const cases: Record<string, CaseOutput> = {
  "text-apply": {
    config: {
      plugins: [
        plugin(function ({ addUtilities }) {
          addUtilities({
            ".text-apply": {
              "@apply text-[black] dark:text-[white]": {},
            },
          });
        }),
      ],
    },
    output: {
      "text-apply": {
        styles: [{ color: "black" }, { color: "white" }],
        atRules: {
          1: [["prefers-color-scheme", "dark"]],
        },
        topics: ["--color-scheme"],
      },
    },
  },
  "text-media-query": {
    config: {
      plugins: [
        plugin(function ({ addUtilities }) {
          addUtilities({
            ".text-media-query": {
              color: "black",
            },
            "@media(prefers-color-scheme: dark)": {
              ".text-media-query": {
                color: "white",
              },
            },
          });
        }),
      ],
    },
    output: {
      "text-media-query": {
        styles: [{ color: "black" }, { color: "white" }],
        atRules: {
          1: [["prefers-color-scheme", "dark"]],
        },
        topics: ["--color-scheme"],
      },
    },
  },
};

testEachCase(cases);
