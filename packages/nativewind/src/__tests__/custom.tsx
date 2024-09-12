import { renderCurrentTest } from "../test";

describe("Custom - Ripple Color", () => {
  test("ripple-black", async () =>
    expect(await renderCurrentTest()).toStrictEqual({
      props: {
        android_ripple: { color: "rgba(0, 0, 0, 1)" },
      },
    }));
});

describe("Custom - Ripple Borderless", () => {
  test("ripple-borderless", async () =>
    expect(await renderCurrentTest()).toStrictEqual({
      props: { android_ripple: { borderless: true } },
    }));
});
