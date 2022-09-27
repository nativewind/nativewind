import { createTests, tailwindRunner, spacing } from "./runner";

tailwindRunner(
  "Layout - Margin",
  createTests("m", spacing, (n) => ({
    marginBottom: n,
    marginLeft: n,
    marginRight: n,
    marginTop: n,
  })),

  createTests("mx", spacing, (n) => ({
    marginLeft: n,
    marginRight: n,
  })),

  createTests("my", spacing, (n) => ({
    marginTop: n,
    marginBottom: n,
  })),

  createTests("mt", spacing, (n) => ({
    marginTop: n,
  })),

  createTests("mr", spacing, (n) => ({
    marginRight: n,
  })),

  createTests("mb", spacing, (n) => ({
    marginBottom: n,
  })),

  createTests("ml", spacing, (n) => ({
    marginLeft: n,
  })),
  [
    [
      "m-auto",
      {
        styles: {
          "m-auto": {
            marginBottom: "auto",
            marginLeft: "auto",
            marginRight: "auto",
            marginTop: "auto",
          },
        },
      },
    ],
    [
      "mx-auto",
      {
        styles: {
          "mx-auto": {
            marginLeft: "auto",
            marginRight: "auto",
          },
        },
      },
    ],
    [
      "my-auto",
      {
        styles: {
          "my-auto": {
            marginBottom: "auto",
            marginTop: "auto",
          },
        },
      },
    ],
    [
      "mt-auto",
      {
        styles: {
          "mt-auto": {
            marginTop: "auto",
          },
        },
      },
    ],
    [
      "mr-auto",
      {
        styles: {
          "mr-auto": {
            marginRight: "auto",
          },
        },
      },
    ],
    [
      "mb-auto",
      {
        styles: {
          "mb-auto": {
            marginBottom: "auto",
          },
        },
      },
    ],
    [
      "ml-auto",
      {
        styles: {
          "ml-auto": {
            marginLeft: "auto",
          },
        },
      },
    ],
  ]
);
