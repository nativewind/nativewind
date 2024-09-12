import { renderCurrentTest } from "../test";

describe("Filters - Blur", () => {
  test("blur", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["filter"] },
    });
  });
});

describe("Filters - Brightness", () => {
  test("brightness-0", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["filter"] },
    });
  });
});

describe("Filters - Contrast", () => {
  test("contrast-0", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["filter"] },
    });
  });
  test("contrast-50", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["filter"] },
    });
  });
  test("contrast-200", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["filter"] },
    });
  });
});

describe("Filters - Drop Shadow", () => {
  test("drop-shadow", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: {
        properties: ["filter"],
      },
    });
  });
});

describe("Filters - Grayscale", () => {
  test("grayscale", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["filter"] },
    });
  });
  test("grayscale-0", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["filter"] },
    });
  });
});

describe("Filters - Hue Rotate", () => {
  test("hue-rotate-0", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["filter"] },
    });
  });
  test("hue-rotate-180", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["filter"] },
    });
  });
});

describe("Filters - Invert", () => {
  test("invert-0", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["filter"] },
    });
  });
  test("invert", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["filter"] },
    });
  });
});

describe("Filters - Saturate", () => {
  test("saturate-0", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["filter"] },
    });
  });
  test("saturate-100", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["filter"] },
    });
  });
});

describe("Filters - Sepia", () => {
  test("sepia", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["filter"] },
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
