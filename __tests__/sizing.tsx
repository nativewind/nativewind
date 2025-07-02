import { Dimensions } from "react-native";

import { renderCurrentTest } from "../test";

describe("Sizing - Width", () => {
  test("w-0", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { width: 0 } },
    });
  });
  test("w-px", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { width: 1 } },
    });
  });
  test("w-1", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { width: 3.5 } },
    });
  });
  test("w-1/2", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { width: "50%" } },
    });
  });
  test("w-full", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { width: "100%" } },
    });
  });
  test("w-auto", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { style: { width: "auto" } },
    });
  });
  test("w-min", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { style: { width: "min-content" } },
    });
  });
  test("w-max", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { style: { width: "max-content" } },
    });
  });
  test("w-fit", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { style: { width: "fit-content" } },
    });
  });
  test("w-screen", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { width: Dimensions.get("window").width } },
    });
  });
});

describe("Sizing - Min Width", () => {
  test("min-w-0", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { minWidth: 0 } },
    });
  });
  test("min-w-full", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { minWidth: "100%" } },
    });
  });
  test("min-w-min", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { style: { "min-width": "min-content" } },
    });
  });
  test("min-w-max", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { style: { "min-width": "max-content" } },
    });
  });
  test("min-w-fit", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { style: { "min-width": "fit-content" } },
    });
  });
});

describe("Sizing - Max Width", () => {
  test("max-w-0", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { maxWidth: 0 } },
    });
  });
  test("max-w-full", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { maxWidth: "100%" } },
    });
  });
  test("max-w-min", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { style: { "max-width": "min-content" } },
    });
  });
  test("max-w-max", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { style: { "max-width": "max-content" } },
    });
  });
  test("max-w-fit", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { style: { "max-width": "fit-content" } },
    });
  });
});

describe("Sizing - Height", () => {
  test("h-0", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { height: 0 } },
    });
  });
  test("h-px", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { height: 1 } },
    });
  });
  test("h-1", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { height: 3.5 } },
    });
  });
  test("h-1/2", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { height: "50%" } },
    });
  });
  test("h-full", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { height: "100%" } },
    });
  });
  test("h-auto", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { style: { height: "auto" } },
    });
  });
  test("h-min", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { style: { height: "min-content" } },
    });
  });
  test("h-max", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { style: { height: "max-content" } },
    });
  });
  test("h-fit", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { style: { height: "fit-content" } },
    });
  });
  test("h-screen", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { height: Dimensions.get("window").height } },
    });
  });
});

describe("Sizing - Min Height", () => {
  test("min-h-0", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { minHeight: 0 } },
    });
  });
  test("min-h-full", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { minHeight: "100%" } },
    });
  });
  test("min-h-min", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { style: { "min-height": "min-content" } },
    });
  });
  test("min-h-max", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { style: { "min-height": "max-content" } },
    });
  });
  test("min-h-fit", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { style: { "min-height": "fit-content" } },
    });
  });
});

describe("Sizing - Max Height", () => {
  test("max-h-0", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { maxHeight: 0 } },
    });
  });
  test("max-h-full", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { maxHeight: "100%" } },
    });
  });
  test("max-h-min", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { style: { "max-height": "min-content" } },
    });
  });
  test("max-h-max", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { style: { "max-height": "max-content" } },
    });
  });
  test("max-h-fit", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { style: { "max-height": "fit-content" } },
    });
  });
});
