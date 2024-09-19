import { renderCurrentTest } from "../test";

describe("Filters - Blur", () => {
  test("blur", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {
        style: {
          filter: [{ blur: 8 }],
        },
      },
    });
  });
});

describe("Filters - Brightness", () => {
  test("brightness-0", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {
        style: {
          filter: [{ brightness: 0 }],
        },
      },
    });
  });
});

describe("Filters - Contrast", () => {
  test("contrast-0", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {
        style: {
          filter: [{ contrast: 0 }],
        },
      },
    });
  });
  test("contrast-50", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {
        style: {
          filter: [{ contrast: 0.5 }],
        },
      },
    });
  });
  test("contrast-200", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {
        style: {
          filter: [{ contrast: 2 }],
        },
      },
    });
  });
});

describe("Filters - Drop Shadow", () => {
  test("drop-shadow", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {
        style: {
          filter: [
            {
              dropShadow: {
                offsetX: 0,
                offsetY: 1,
                standardDeviation: 2,
                color: "rgba(0, 0, 0, 0.10196078568696976)",
              },
            },
            {
              dropShadow: {
                offsetX: 0,
                offsetY: 1,
                standardDeviation: 1,
                color: "rgba(0, 0, 0, 0.05882352963089943)",
              },
            },
          ],
        },
      },
    });
  });
});

describe("Filters - Grayscale", () => {
  test("grayscale", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {
        style: {
          filter: [{ grayscale: "100%" }],
        },
      },
    });
  });
  test("grayscale-0", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {
        style: {
          filter: [{ grayscale: 0 }],
        },
      },
    });
  });
});

describe("Filters - Hue Rotate", () => {
  test("hue-rotate-0", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {
        style: {
          filter: [{ hueRotate: "0deg" }],
        },
      },
    });
  });
  test("hue-rotate-180", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {
        style: {
          filter: [{ hueRotate: "180deg" }],
        },
      },
    });
  });
});

describe("Filters - Invert", () => {
  test("invert-0", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {
        style: {
          filter: [{ invert: 0 }],
        },
      },
    });
  });
  test("invert", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {
        style: {
          filter: [{ invert: "100%" }],
        },
      },
    });
  });
});

describe("Filters - Saturate", () => {
  test("saturate-0", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {
        style: {
          filter: [{ saturate: 0 }],
        },
      },
    });
  });
  test("saturate-100", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {
        style: {
          filter: [{ saturate: 1 }],
        },
      },
    });
  });
});

describe("Filters - Sepia", () => {
  test("sepia", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {
        style: {
          filter: [{ sepia: "100%" }],
        },
      },
    });
  });
});

describe("Filters - Backdrop Blur", () => {
  test("backdrop-blur-none", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["backdrop-filter"] },
    });
  });
});

describe("Filters - Backdrop Brightness", () => {
  test("backdrop-brightness-0", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["backdrop-filter"] },
    });
  });
});

describe("Filters - Backdrop Contrast", () => {
  test("backdrop-contrast-0", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["backdrop-filter"] },
    });
  });
});

describe("Filters - Backdrop Grayscale", () => {
  test("backdrop-grayscale-0", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["backdrop-filter"] },
    });
  });
});

describe("Filters - Backdrop Hue Rotate", () => {
  test("backdrop-hue-rotate-0", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["backdrop-filter"] },
    });
  });
});

describe("Filters - Backdrop Invert", () => {
  test("backdrop-invert-0", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["backdrop-filter"] },
    });
  });
});

describe("Filters - Backdrop Opacity", () => {
  test("backdrop-opacity-0", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["backdrop-filter"] },
    });
  });
});

describe("Filters - Backdrop Saturate", () => {
  test("backdrop-saturate-0", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["backdrop-filter"] },
    });
  });
});

describe("Filters - Backdrop Sepia", () => {
  test("backdrop-sepia-0", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["backdrop-filter"] },
    });
  });
});
