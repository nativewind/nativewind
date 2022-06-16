import { tailwindRunner, $ } from "./runner";

tailwindRunner("Layout - Container", [
  [
    "container",
    {
      [$`container`()]: [
        {
          width: "100%",
        },
        {
          atRules: [["media", "(min-width: 640px)"]],
          maxWidth: 640,
        },
        {
          atRules: [["media", "(min-width: 768px)"]],
          maxWidth: 768,
        },
        {
          atRules: [["media", "(min-width: 1024px)"]],
          maxWidth: 1024,
        },
        {
          atRules: [["media", "(min-width: 1280px)"]],
          maxWidth: 1280,
        },
        {
          atRules: [["media", "(min-width: 1536px)"]],
          maxWidth: 1536,
        },
      ],
    },
  ],
  [
    "sm:container",
    {
      [$`sm:container`()]: [
        {
          atRules: [["media", "(min-width: 640px)"]],
          width: "100%",
        },
        {
          atRules: [
            ["media", "(min-width: 640px)"],
            ["media", "(min-width: 640px)"],
          ],
          maxWidth: 640,
        },
        {
          atRules: [
            ["media", "(min-width: 640px)"],
            ["media", "(min-width: 768px)"],
          ],
          maxWidth: 768,
        },
        {
          atRules: [
            ["media", "(min-width: 640px)"],
            ["media", "(min-width: 1024px)"],
          ],
          maxWidth: 1024,
        },
        {
          atRules: [
            ["media", "(min-width: 640px)"],
            ["media", "(min-width: 1280px)"],
          ],
          maxWidth: 1280,
        },
        {
          atRules: [
            ["media", "(min-width: 640px)"],
            ["media", "(min-width: 1536px)"],
          ],
          maxWidth: 1536,
        },
      ],
    },
  ],
]);
