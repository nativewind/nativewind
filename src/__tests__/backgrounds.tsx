import { renderCurrentTest, renderSimple } from "../test-utils";

describe("Backgrounds - Background Attachment", () => {
  test("bg-fixed", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      warnings: { properties: ["background-attachment"] },
    });
  });
  test("bg-local", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      warnings: { properties: ["background-attachment"] },
    });
  });
  test("bg-scroll", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      warnings: { properties: ["background-attachment"] },
    });
  });
});

describe("Backgrounds - Background Clip", () => {
  test("bg-clip-border", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      warnings: { properties: ["background-clip"] },
    });
  });
  test("bg-clip-padding", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      warnings: { properties: ["background-clip"] },
    });
  });
  test("bg-clip-content", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      warnings: { properties: ["background-clip"] },
    });
  });
  test("bg-clip-text", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      warnings: { properties: ["background-clip"] },
    });
  });
});

describe("Backgrounds - Background Color", () => {
  test("bg-current", async () => {
    expect(
      await renderSimple({ className: "bg-current text-red-500" }),
    ).toStrictEqual({
      props: {
        style: {
          color: "#fb2c36",
          backgroundColor: "#fb2c36",
        },
      },
    });
  });

  test("bg-transparent", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { backgroundColor: "#0000" } },
    });
  });

  test("bg-white", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { backgroundColor: "#fff" } },
    });
  });
});

describe("Backgrounds - Background Origin", () => {
  test("bg-origin-border", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      warnings: { properties: ["background-origin"] },
    });
  });
  test("bg-origin-padding", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      warnings: { properties: ["background-origin"] },
    });
  });
  test("bg-origin-content", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      warnings: { properties: ["background-origin"] },
    });
  });
});

describe("Backgrounds - Background Position", () => {
  test("bg-bottom", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      warnings: { properties: ["background-position"] },
    });
  });
  test("bg-center", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      warnings: { properties: ["background-position"] },
    });
  });
  test("bg-left", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      warnings: { properties: ["background-position"] },
    });
  });
  test("bg-left-bottom", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      warnings: { properties: ["background-position"] },
    });
  });
  test("bg-left-top", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      warnings: { properties: ["background-position"] },
    });
  });
  test("bg-right", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      warnings: { properties: ["background-position"] },
    });
  });
  test("bg-right-bottom", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      warnings: { properties: ["background-position"] },
    });
  });
  test("bg-right-top", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      warnings: { properties: ["background-position"] },
    });
  });
  test("bg-top", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      warnings: { properties: ["background-position"] },
    });
  });
});

describe("Backgrounds - Background Repeat", () => {
  test("bg-repeat", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      warnings: { properties: ["background-repeat"] },
    });
  });
});

describe("Backgrounds - Background Size", () => {
  test("bg-auto", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      warnings: { properties: ["background-size"] },
    });
  });
  test("bg-cover", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      warnings: { properties: ["background-size"] },
    });
  });
  test("bg-contain", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      warnings: { properties: ["background-size"] },
    });
  });
});

describe("Backgrounds - Background Image", () => {
  test("bg-none", async () => {
    expect(
      await renderSimple({
        className: "bg-none",
      }),
    ).toStrictEqual({
      props: {
        style: {
          experimental_backgroundImage: ["none"],
        },
      },
    });
  });
  test("bg-gradient-to-t", async () => {
    expect(
      await renderSimple({
        className: "bg-gradient-to-t from-red-500 to-blue-500",
      }),
    ).toStrictEqual({
      props: {
        style: {
          experimental_backgroundImage:
            "linear-gradient(to top in oklab, #fb2c36, #2b7fff)",
        },
      },
    });
  });
  test("bg-gradient-to-tr", async () => {
    expect(
      await renderSimple({
        className: "bg-gradient-to-tr from-red-500 to-blue-500",
      }),
    ).toStrictEqual({
      props: {
        style: {
          experimental_backgroundImage:
            "linear-gradient(to top right in oklab, #fb2c36, #2b7fff)",
        },
      },
    });
  });
  test("bg-gradient-to-r", async () => {
    expect(
      await renderSimple({
        className: "bg-gradient-to-r from-red-500 to-blue-500",
      }),
    ).toStrictEqual({
      props: {
        style: {
          experimental_backgroundImage:
            "linear-gradient(to right in oklab, #fb2c36, #2b7fff)",
        },
      },
    });
  });
  test("bg-gradient-to-br", async () => {
    expect(
      await renderSimple({
        className: "bg-gradient-to-br from-red-500 to-blue-500",
      }),
    ).toStrictEqual({
      props: {
        style: {
          experimental_backgroundImage:
            "linear-gradient(to bottom right in oklab, #fb2c36, #2b7fff)",
        },
      },
    });
  });
  test("bg-gradient-to-b", async () => {
    expect(
      await renderSimple({
        className: "bg-gradient-to-b from-red-500 to-blue-500",
      }),
    ).toStrictEqual({
      props: {
        style: {
          experimental_backgroundImage:
            "linear-gradient(to bottom in oklab, #fb2c36, #2b7fff)",
        },
      },
    });
  });
  test("bg-gradient-to-bl", async () => {
    expect(
      await renderSimple({
        className: "bg-gradient-to-bl from-red-500 to-blue-500",
      }),
    ).toStrictEqual({
      props: {
        style: {
          experimental_backgroundImage:
            "linear-gradient(to bottom left in oklab, #fb2c36, #2b7fff)",
        },
      },
    });
  });
  test("bg-gradient-to-l", async () => {
    expect(
      await renderSimple({
        className: "bg-gradient-to-l from-red-500 to-blue-500",
      }),
    ).toStrictEqual({
      props: {
        style: {
          experimental_backgroundImage:
            "linear-gradient(to left in oklab, #fb2c36, #2b7fff)",
        },
      },
    });
  });
  test("bg-gradient-to-tl", async () => {
    expect(
      await renderSimple({
        className: "bg-gradient-to-tl from-red-500 to-blue-500",
      }),
    ).toStrictEqual({
      props: {
        style: {
          experimental_backgroundImage:
            "linear-gradient(to top left in oklab, #fb2c36, #2b7fff)",
        },
      },
    });
  });
});

describe.skip("Backgrounds - Gradient Color Stops", () => {
  // TODO
});
