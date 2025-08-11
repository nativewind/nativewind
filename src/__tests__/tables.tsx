import { renderCurrentTest } from "../test-utils";

describe("Tables - Border Collapse", () => {
  test("border-collapse", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      warnings: { properties: ["border-collapse"] },
    });
  });
  test("border-separate", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      warnings: { properties: ["border-collapse"] },
    });
  });
});

describe("Tables - Border Spacing", () => {
  test("border-spacing-0", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      warnings: { properties: ["border-spacing"] },
    });
  });
  test("border-spacing-x-0", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      warnings: { properties: ["border-spacing"] },
    });
  });
  test("border-spacing-y-0", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      warnings: { properties: ["border-spacing"] },
    });
  });
  test("border-spacing-px", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      warnings: { properties: ["border-spacing"] },
    });
  });
  test("border-spacing-x-px", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      warnings: { properties: ["border-spacing"] },
    });
  });
  test("border-spacing-y-px", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      warnings: { properties: ["border-spacing"] },
    });
  });
  test("border-spacing-1", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      warnings: { properties: ["border-spacing"] },
    });
  });
  test("border-spacing-x-1", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      warnings: { properties: ["border-spacing"] },
    });
  });
  test("border-spacing-y-1", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      warnings: { properties: ["border-spacing"] },
    });
  });
});

describe("Tables - Table Layout", () => {
  test("table-auto", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      warnings: { properties: ["table-layout"] },
    });
  });
  test("table-fixed", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      warnings: { properties: ["table-layout"] },
    });
  });
});

describe("Tables - Caption Side", () => {
  test("caption-top", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      warnings: { properties: ["caption-side"] },
    });
  });
  test("caption-bottom", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      warnings: { properties: ["caption-side"] },
    });
  });
});
