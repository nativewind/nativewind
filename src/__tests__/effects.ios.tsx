import { renderCurrentTest } from "../test-utils";

describe("Effects - Box Shadow", () => {
  test("shadow-sm", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {
        style: {
          boxShadow: [
            {
              blurRadius: 3,
              color: "#0000001a",
              offsetX: 0,
              offsetY: 1,
              spreadDistance: 0,
            },
            {
              blurRadius: 2,
              color: "#0000001a",
              offsetX: 0,
              offsetY: 1,
              spreadDistance: -1,
            },
          ],
        },
      },
    });
  });
  test("shadow", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {
        style: {
          boxShadow: [
            {
              blurRadius: 3,
              color: "#0000001a",
              offsetX: 0,
              offsetY: 1,
              spreadDistance: 0,
            },
            {
              blurRadius: 2,
              color: "#0000001a",
              offsetX: 0,
              offsetY: 1,
              spreadDistance: -1,
            },
          ],
        },
      },
    });
  });
  test("shadow-none", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {
        style: {
          boxShadow: [
            {
              color: "#0000",
              offsetX: 0,
              offsetY: 0,
            },
          ],
        },
      },
    });
  });
});

describe.skip("Effects - Box Shadow Color", () => {
  // TODO
});

describe("Effects - Opacity", () => {
  test("opacity-0", async () =>
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { opacity: 0 } },
    }));
  test("opacity-100", async () =>
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { opacity: 1 } },
    }));
});

describe("Effects - Mix Blend Mode", () => {
  test("mix-blend-normal", async () =>
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      warnings: { properties: ["mix-blend-mode"] },
    }));
  test("mix-blend-multiply", async () =>
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      warnings: { properties: ["mix-blend-mode"] },
    }));
  test("mix-blend-screen", async () =>
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      warnings: { properties: ["mix-blend-mode"] },
    }));
  test("mix-blend-overlay", async () =>
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      warnings: { properties: ["mix-blend-mode"] },
    }));
  test("mix-blend-darken", async () =>
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      warnings: { properties: ["mix-blend-mode"] },
    }));
  test("mix-blend-lighten", async () =>
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      warnings: { properties: ["mix-blend-mode"] },
    }));
  test("mix-blend-color-dodge", async () =>
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      warnings: { properties: ["mix-blend-mode"] },
    }));
  test("mix-blend-color-burn", async () =>
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      warnings: { properties: ["mix-blend-mode"] },
    }));
  test("mix-blend-hard-light", async () =>
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      warnings: { properties: ["mix-blend-mode"] },
    }));
  test("mix-blend-soft-light", async () =>
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      warnings: { properties: ["mix-blend-mode"] },
    }));
  test("mix-blend-difference", async () =>
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      warnings: { properties: ["mix-blend-mode"] },
    }));
  test("mix-blend-exclusion", async () =>
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      warnings: { properties: ["mix-blend-mode"] },
    }));
  test("mix-blend-hue", async () =>
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      warnings: { properties: ["mix-blend-mode"] },
    }));
  test("mix-blend-saturation", async () =>
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      warnings: { properties: ["mix-blend-mode"] },
    }));
  test("mix-blend-color", async () =>
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      warnings: { properties: ["mix-blend-mode"] },
    }));
  test("mix-blend-luminosity", async () =>
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      warnings: { properties: ["mix-blend-mode"] },
    }));
});

describe("Effects - Background Blend Mode", () => {
  test("bg-blend-normal", async () =>
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      warnings: { properties: ["background-blend-mode"] },
    }));
  test("bg-blend-multiply", async () =>
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      warnings: { properties: ["background-blend-mode"] },
    }));
  test("bg-blend-screen", async () =>
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      warnings: { properties: ["background-blend-mode"] },
    }));
  test("bg-blend-overlay", async () =>
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      warnings: { properties: ["background-blend-mode"] },
    }));
  test("bg-blend-darken", async () =>
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      warnings: { properties: ["background-blend-mode"] },
    }));
  test("bg-blend-lighten", async () =>
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      warnings: { properties: ["background-blend-mode"] },
    }));
  test("bg-blend-color-dodge", async () =>
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      warnings: { properties: ["background-blend-mode"] },
    }));
  test("bg-blend-color-burn", async () =>
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      warnings: { properties: ["background-blend-mode"] },
    }));
  test("bg-blend-hard-light", async () =>
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      warnings: { properties: ["background-blend-mode"] },
    }));
  test("bg-blend-soft-light", async () =>
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      warnings: { properties: ["background-blend-mode"] },
    }));
  test("bg-blend-difference", async () =>
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      warnings: { properties: ["background-blend-mode"] },
    }));
  test("bg-blend-exclusion", async () =>
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      warnings: { properties: ["background-blend-mode"] },
    }));
  test("bg-blend-hue", async () =>
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      warnings: { properties: ["background-blend-mode"] },
    }));
  test("bg-blend-saturation", async () =>
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      warnings: { properties: ["background-blend-mode"] },
    }));
  test("bg-blend-color", async () =>
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      warnings: { properties: ["background-blend-mode"] },
    }));
  test("bg-blend-luminosity", async () =>
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      warnings: { properties: ["background-blend-mode"] },
    }));
});
