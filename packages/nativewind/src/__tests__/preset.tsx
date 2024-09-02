import { renderCurrentTest } from "../test";

describe("Preset - color-*", () => {
  test("color-black", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { color: "rgba(0, 0, 0, 1)" } },
    });
  });
});
