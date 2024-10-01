import { renderCurrentTest } from "../test";

describe("Custom - Ripple Color", () => {
  test("ripple-black", async () =>
    expect(await renderCurrentTest()).toStrictEqual({
      props: {
        android_ripple: { color: "#000000" },
      },
    }));
});

describe("Custom - Ripple Borderless", () => {
  test("ripple-borderless", async () =>
    expect(await renderCurrentTest()).toStrictEqual({
      props: { android_ripple: { borderless: true } },
    }));
});
