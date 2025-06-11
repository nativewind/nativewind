import { renderCurrentTest } from "../test";

describe("Tables - Border Collapse", () => {
  test("border-collapse", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["border-collapse"] },
    });
  });
  test("border-separate", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["border-collapse"] },
    });
  });
});

describe("Tables - Border Spacing", () => {
  test("border-spacing-0", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["border-spacing"] },
    });
  });
  test("border-spacing-x-0", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["border-spacing"] },
    });
  });
  test("border-spacing-y-0", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["border-spacing"] },
    });
  });
  test("border-spacing-px", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["border-spacing"] },
    });
  });
  test("border-spacing-x-px", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["border-spacing"] },
    });
  });
  test("border-spacing-y-px", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["border-spacing"] },
    });
  });
  test("border-spacing-1", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["border-spacing"] },
    });
  });
  test("border-spacing-x-1", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["border-spacing"] },
    });
  });
  test("border-spacing-y-1", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["border-spacing"] },
    });
  });
});

describe("Tables - Table Layout", () => {
  test("table-auto", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["table-layout"] },
    });
  });
  test("table-fixed", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["table-layout"] },
    });
  });
});

describe("Tables - Caption Side", () => {
  test("caption-top", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["caption-side"] },
    });
  });
  test("caption-bottom", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["caption-side"] },
    });
  });
});
