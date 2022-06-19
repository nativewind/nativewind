import { tailwindRunner } from "./runner";

tailwindRunner("Layout - Container", [
  [
    "container",
    {
      styles: {
        container: {
          width: "100%",
        },
        "container@0": {
          maxWidth: 640,
        },
        "container@1": {
          maxWidth: 768,
        },
        "container@2": {
          maxWidth: 1024,
        },
        "container@3": {
          maxWidth: 1280,
        },
        "container@4": {
          maxWidth: 1536,
        },
      },
      topics: {
        container: ["width"],
      },
      atRules: {
        container: [
          [["media", "(min-width: 640px)"]],
          [["media", "(min-width: 768px)"]],
          [["media", "(min-width: 1024px)"]],
          [["media", "(min-width: 1280px)"]],
          [["media", "(min-width: 1536px)"]],
        ],
      },
    },
  ],
  [
    "sm:container",
    {
      styles: {
        "sm:container@0": {
          width: "100%",
        },
        "sm:container@1": {
          maxWidth: 640,
        },
        "sm:container@2": {
          maxWidth: 768,
        },
        "sm:container@3": {
          maxWidth: 1024,
        },
        "sm:container@4": {
          maxWidth: 1280,
        },
        "sm:container@5": {
          maxWidth: 1536,
        },
      },
      topics: {
        "sm:container": ["width"],
      },
      atRules: {
        "sm:container": [
          [["media", "(min-width: 640px)"]],
          [
            ["media", "(min-width: 640px)"],
            ["media", "(min-width: 640px)"],
          ],
          [
            ["media", "(min-width: 640px)"],
            ["media", "(min-width: 768px)"],
          ],
          [
            ["media", "(min-width: 640px)"],
            ["media", "(min-width: 1024px)"],
          ],
          [
            ["media", "(min-width: 640px)"],
            ["media", "(min-width: 1280px)"],
          ],
          [
            ["media", "(min-width: 640px)"],
            ["media", "(min-width: 1536px)"],
          ],
        ],
      },
    },
  ],
]);
