import plugin from "tailwindcss/plugin";
import { testCompile } from "../test-utils";

testCompile(
  "text-apply",
  {
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
  },
  (output) => {
    expect(output).toStrictEqual({
      "text-apply": {
        styles: [{ color: "black" }, { color: "white" }],
        atRules: {
          1: [["--color-scheme", "dark"]],
        },
        subscriptions: ["--color-scheme"],
      },
    });
  }
);

testCompile(
  "text-media-query",
  {
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
  },
  (output) => {
    expect(output).toStrictEqual({
      "text-media-query": {
        styles: [{ color: "black" }, { color: "white" }],
        atRules: {
          1: [["--color-scheme", "dark"]],
        },
        subscriptions: ["--color-scheme"],
      },
    });
  }
);

testCompile(
  "css-apply",
  {
    css: `
    .css-apply {
      @apply text-black
    }
    `,
  },
  (output) => {
    expect(output).toStrictEqual({
      "css-apply": {
        styles: [{ color: "#000" }],
      },
    });
  }
);
