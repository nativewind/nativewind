import { renderCurrentTest } from "../test";

describe("Border - Border Radius", () => {
  test("rounded", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { borderRadius: 3.5 } },
    });
  });
  test("rounded-t", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { borderTopLeftRadius: 3.5, borderTopRightRadius: 3.5 } },
    });
  });
  test("rounded-b", async () => {
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
  test("border-0", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { borderWidth: 0 } },
    });
  });
  test("border-x-0", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { borderRightWidth: 0, borderLeftWidth: 0 } },
    });
  });
  test("border-y-0", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { borderTopWidth: 0, borderBottomWidth: 0 } },
    });
  });
  test("border-s-0", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { borderLeftWidth: 0 } },
    });
  });
  test("border-e-0", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { borderRightWidth: 0 } },
    });
  });
  test("border-t-0", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { borderTopWidth: 0 } },
    });
  });
  test("border-r-0", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { borderRightWidth: 0 } },
    });
  });
  test("border-b-0", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { borderBottomWidth: 0 } },
    });
  });
  test("border-l-0", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { borderLeftWidth: 0 } },
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
      props: { style: { borderColor: "#ffffff" } },
    });
  });
  test("border-x-white", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {
        style: {
          borderLeftColor: "#ffffff",
          borderRightColor: "#ffffff",
        },
      },
    });
  });
  test("border-y-white", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {
        style: {
          borderTopColor: "#ffffff",
          borderBottomColor: "#ffffff",
        },
      },
    });
  });
  test("border-t-white", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { borderTopColor: "#ffffff" } },
    });
  });
  test("border-b-white", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { borderBottomColor: "#ffffff" } },
    });
  });
  test("border-l-white", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { borderLeftColor: "#ffffff" } },
    });
  });
  test("border-r-white", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { borderRightColor: "#ffffff" } },
    });
  });
  test("border-current", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: {
        style: {
          "border-top-color": "currentcolor",
          "border-bottom-color": "currentcolor",
          "border-left-color": "currentcolor",
          "border-right-color": "currentcolor",
        },
      },
    });
  });
  test("border-inherit", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { style: { "border-color": "inherit" } },
    });
  });

  test("border-x-inherit", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: {
        style: {
          "border-left-color": "inherit",
          "border-right-color": "inherit",
        },
      },
    });
  });
  test("border-y-current", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: {
        style: {
          "border-top-color": "currentcolor",
          "border-bottom-color": "currentcolor",
        },
      },
    });
  });
  test("border-y-inherit", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: {
        style: {
          "border-top-color": "inherit",
          "border-bottom-color": "inherit",
        },
      },
    });
  });
  test("border-t-current", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { style: { "border-top-color": "currentcolor" } },
    });
  });

  test("border-t-inherit", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { style: { "border-top-color": "inherit" } },
    });
  });

  test("border-b-current", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { style: { "border-bottom-color": "currentcolor" } },
    });
  });

  test("border-b-inherit", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { style: { "border-bottom-color": "inherit" } },
    });
  });

  test("border-l-current", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { style: { "border-left-color": "currentcolor" } },
    });
  });

  test("border-l-inherit", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { style: { "border-left-color": "inherit" } },
    });
  });

  test("border-r-current", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { style: { "border-right-color": "currentcolor" } },
    });
  });

  test("border-r-inherit", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { style: { "border-right-color": "inherit" } },
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
      invalid: { style: { "border-style": "none" } },
    });
  });
  test("border-double", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { style: { "border-style": "double" } },
    });
  });
  test("border-hidden", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { style: { "border-style": "hidden" } },
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
