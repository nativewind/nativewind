import { renderCurrentTest } from "../test";

describe("Backgrounds - Background Attachment", () => {
  test("bg-fixed", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["background-attachment"] },
    });
  });
  test("bg-local", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["background-attachment"] },
    });
  });
  test("bg-scroll", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["background-attachment"] },
    });
  });
});

describe("Backgrounds - Background Clip", () => {
  test("bg-clip-border", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["background-clip"] },
    });
  });
  test("bg-clip-padding", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["background-clip"] },
    });
  });
  test("bg-clip-content", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["background-clip"] },
    });
  });
  test("bg-clip-text", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["background-clip"] },
    });
  });
});

describe("Backgrounds - Background Color", () => {
  test("bg-current", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { style: { "background-color": "currentcolor" } },
    });
  });

  test("bg-transparent", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { backgroundColor: "#00000000" } },
    });
  });

  test("bg-white", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { backgroundColor: "#ffffff" } },
    });
  });
});

describe("Backgrounds - Background Origin", () => {
  test("bg-origin-border", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["background-origin"] },
    });
  });
  test("bg-origin-padding", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["background-origin"] },
    });
  });
  test("bg-origin-content", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["background-origin"] },
    });
  });
});

describe("Backgrounds - Background Position", () => {
  test("bg-bottom", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["background-position"] },
    });
  });
  test("bg-center", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["background-position"] },
    });
  });
  test("bg-left", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["background-position"] },
    });
  });
  test("bg-left-bottom", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["background-position"] },
    });
  });
  test("bg-left-top", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["background-position"] },
    });
  });
  test("bg-right", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["background-position"] },
    });
  });
  test("bg-right-bottom", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["background-position"] },
    });
  });
  test("bg-right-top", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["background-position"] },
    });
  });
  test("bg-top", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["background-position"] },
    });
  });
});

describe("Backgrounds - Background Repeat", () => {
  test("bg-repeat", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["background-repeat"] },
    });
  });
});

describe("Backgrounds - Background Size", () => {
  test("bg-auto", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["background-size"] },
    });
  });
  test("bg-cover", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["background-size"] },
    });
  });
  test("bg-contain", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["background-size"] },
    });
  });
});

describe("Backgrounds - Background Image", () => {
  test("bg-none", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["background-image"] },
    });
  });
  test("bg-gradient-to-t", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["background-image"] },
    });
  });
  test("bg-gradient-to-tr", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["background-image"] },
    });
  });
  test("bg-gradient-to-r", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["background-image"] },
    });
  });
  test("bg-gradient-to-br", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["background-image"] },
    });
  });
  test("bg-gradient-to-b", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["background-image"] },
    });
  });
  test("bg-gradient-to-bl", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["background-image"] },
    });
  });
  test("bg-gradient-to-l", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["background-image"] },
    });
  });
  test("bg-gradient-to-tl", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["background-image"] },
    });
  });
});

describe.skip("Backgrounds - Gradient Color Stops", () => {
  // TODO
});
