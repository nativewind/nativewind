import { renderCurrentTest, renderSimple } from "../test-utils";

describe("Border - Border Radius", () => {
  test("rounded-sm", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { borderRadius: 3.5 } },
    });
  });
  test("rounded-t-sm", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { borderTopLeftRadius: 3.5, borderTopRightRadius: 3.5 } },
    });
  });
  test("rounded-b-sm", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {
        style: { borderBottomLeftRadius: 3.5, borderBottomRightRadius: 3.5 },
      },
    });
  });
  test("rounded-full", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { borderRadius: 9999 } },
    });
  });
});

describe("Border - Border Width", () => {
  test("border-1", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { borderWidth: 1 } },
    });
  });
  test("border-x-1", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { borderRightWidth: 1, borderLeftWidth: 1 } },
    });
  });
  test("border-y-1", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { borderTopWidth: 1, borderBottomWidth: 1 } },
    });
  });
  test("border-s-1", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { borderLeftWidth: 1 } },
    });
  });
  test("border-e-1", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { borderRightWidth: 1 } },
    });
  });
  test("border-t-1", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { borderTopWidth: 1 } },
    });
  });
  test("border-r-1", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { borderRightWidth: 1 } },
    });
  });
  test("border-b-1", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { borderBottomWidth: 1 } },
    });
  });
  test("border-l-1", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { borderLeftWidth: 1 } },
    });
  });
  test("border-2", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { borderWidth: 2 } },
    });
  });
  test("border-x-2", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { borderRightWidth: 2, borderLeftWidth: 2 } },
    });
  });
  test("border-y-2", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { borderTopWidth: 2, borderBottomWidth: 2 } },
    });
  });
  test("border-s-2", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { borderLeftWidth: 2 } },
    });
  });
  test("border-e-2", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { borderRightWidth: 2 } },
    });
  });
  test("border-t-2", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { borderTopWidth: 2 } },
    });
  });
  test("border-r-2", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { borderRightWidth: 2 } },
    });
  });
  test("border-b-2", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { borderBottomWidth: 2 } },
    });
  });
  test("border-l-2", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { borderLeftWidth: 2 } },
    });
  });
});

describe("Border - Border Color", () => {
  test("border-white", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { borderColor: "#fff" } },
    });
  });
  test("border-x-white", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {
        style: {
          borderInlineColor: "#fff",
        },
      },
    });
  });
  test("border-y-white", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {
        style: {
          borderBlockColor: "#fff",
        },
      },
    });
  });
  test("border-t-white", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { borderTopColor: "#fff" } },
    });
  });
  test("border-b-white", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { borderBottomColor: "#fff" } },
    });
  });
  test("border-l-white", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { borderLeftColor: "#fff" } },
    });
  });
  test("border-r-white", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { borderRightColor: "#fff" } },
    });
  });
  test("border-current", async () => {
    expect(
      await renderSimple({ className: "border-current text-red-500" }),
    ).toStrictEqual({
      props: {
        style: {
          borderColor: "#fb2c36",
          color: "#fb2c36",
        },
      },
    });
  });
  test("border-inherit", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      warnings: { values: { "border-color": "inherit" } },
    });
  });

  test("border-x-current", async () => {
    expect(
      await renderSimple({ className: "border-x-current text-red-500" }),
    ).toStrictEqual({
      props: {
        style: {
          borderLeftColor: "#fb2c36",
          borderRightColor: "#fb2c36",
          color: "#fb2c36",
        },
      },
    });
  });

  test("border-x-inherit", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      warnings: {
        values: {
          "border-inline-color": "inherit",
        },
      },
    });
  });
  test("border-y-current", async () => {
    expect(
      await renderSimple({ className: "border-y-current text-red-500" }),
    ).toStrictEqual({
      props: {
        style: {
          borderBottomColor: "#fb2c36",
          borderTopColor: "#fb2c36",
          color: "#fb2c36",
        },
      },
    });
  });
  test("border-y-inherit", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      warnings: {
        values: {
          "border-block-color": "inherit",
        },
      },
    });
  });
  test("border-t-current", async () => {
    expect(
      await renderSimple({ className: "border-t-current text-red-500" }),
    ).toStrictEqual({
      props: {
        style: {
          borderTopColor: "#fb2c36",
          color: "#fb2c36",
        },
      },
    });
  });

  test("border-t-inherit", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      warnings: { values: { "border-top-color": "inherit" } },
    });
  });

  test("border-b-current", async () => {
    expect(
      await renderSimple({ className: "border-b-current text-red-500" }),
    ).toStrictEqual({
      props: {
        style: {
          borderBottomColor: "#fb2c36",
          color: "#fb2c36",
        },
      },
    });
  });

  test("border-b-inherit", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      warnings: { values: { "border-bottom-color": "inherit" } },
    });
  });

  test("border-l-current", async () => {
    expect(
      await renderSimple({ className: "border-l-current text-red-500" }),
    ).toStrictEqual({
      props: {
        style: {
          borderLeftColor: "#fb2c36",
          color: "#fb2c36",
        },
      },
    });
  });

  test("border-l-inherit", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      warnings: { values: { "border-left-color": "inherit" } },
    });
  });

  test("border-r-current", async () => {
    expect(
      await renderSimple({
        className: "border-r-current text-red-500",
      }),
    ).toStrictEqual({
      props: {
        style: {
          borderRightColor: "#fb2c36",
          color: "#fb2c36",
        },
      },
    });
  });

  test("border-r-inherit", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      warnings: { values: { "border-right-color": "inherit" } },
    });
  });
});

describe("Borders - Border Style", () => {
  test("border-solid", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { borderStyle: "solid" } },
    });
  });
  test("border-dashed", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { borderStyle: "dashed" } },
    });
  });
  test("border-dotted", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { borderStyle: "dotted" } },
    });
  });
  test("border-none", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      warnings: { values: { "border-style": "none" } },
    });
  });
  test("border-double", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      warnings: { values: { "border-style": "double" } },
    });
  });
  test("border-hidden", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      warnings: { values: { "border-style": "hidden" } },
    });
  });
});

describe.skip("Borders - Divide Width", () => {
  // TODO
});

describe.skip("Borders - Divide Color", () => {
  // TODO
});

describe.skip("Borders - Divide Style", () => {
  // TODO
});

describe.skip("Borders - Outline Width", () => {
  // TODO
});

describe.skip("Borders - Outline Color", () => {
  // TODO
});

describe.skip("Borders - Outline Style", () => {
  // TODO
});

describe.skip("Borders - Outline Offset", () => {
  // TODO
});

describe.skip("Borders - Ring Width", () => {
  // TODO
});

describe.skip("Borders - Ring Color", () => {
  // TODO
});

describe.skip("Borders - Ring Offset Width", () => {
  // TODO
});

describe.skip("Borders - Ring Offset Color", () => {
  // TODO
});
