import { renderCurrentTest } from "../test";

describe("Spacing - Padding", () => {
  test("p-0", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { padding: 0 } },
    });
  });
  test("px-0", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { paddingLeft: 0, paddingRight: 0 } },
    });
  });
  test("py-0", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { paddingTop: 0, paddingBottom: 0 } },
    });
  });
  test("pt-0", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { paddingTop: 0 } },
    });
  });
  test("pr-0", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { paddingRight: 0 } },
    });
  });
  test("pb-0", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { paddingBottom: 0 } },
    });
  });
  test("pl-0", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { paddingLeft: 0 } },
    });
  });
  test("ps-0", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { paddingStart: 0 } },
    });
  });
  test("pe-0", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { paddingEnd: 0 } },
    });
  });
});

describe("Spacing - Margin", () => {
  test("m-0", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { margin: 0 } },
    });
  });
  test("mx-0", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { marginLeft: 0, marginRight: 0 } },
    });
  });
  test("my-0", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { marginTop: 0, marginBottom: 0 } },
    });
  });
  test("mt-0", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { marginTop: 0 } },
    });
  });
  test("mr-0", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { marginRight: 0 } },
    });
  });
  test("mb-0", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { marginBottom: 0 } },
    });
  });
  test("ml-0", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { marginLeft: 0 } },
    });
  });
  test("ms-0", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { marginStart: 0 } },
    });
  });
  test("me-0", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { marginEnd: 0 } },
    });
  });
  test("m-auto", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { margin: "auto" } },
    });
  });
});

describe.skip("Spacing - Space Between", () => {
  // TODO
});
