import { renderCurrentTest } from "../test-utils";

describe("Custom - Ripple Color", () => {
  test("ripple-black", async () =>
    expect(await renderCurrentTest()).toStrictEqual({
      props: {
        android_ripple: { color: "#000" },
        style: {},
      },
    }));
});

describe("Custom - Ripple Borderless", () => {
  test("ripple-borderless", async () =>
    expect(await renderCurrentTest()).toStrictEqual({
      props: { android_ripple: { borderless: true } },
    }));
});
