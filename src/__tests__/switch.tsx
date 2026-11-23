import { renderCurrentTest, renderSimple } from "../test-utils";

describe.each([false, true])("CSS optimization: %s", (optimize) => {
  describe("Custom - Switch thumbColor", () => {
    test("thumb-black", async () => {
      expect(await renderCurrentTest({ optimize })).toStrictEqual({
        props: { thumbColor: "#000", style: {} },
      });
    });
  });

  describe("Custom - Switch trackColor", () => {
    test("track-on-black", async () => {
      expect(await renderCurrentTest({ optimize })).toStrictEqual({
        props: { trackColor: { true: "#000" }, style: {} },
      });
    });
    test("track-off-black", async () => {
      expect(await renderCurrentTest({ optimize })).toStrictEqual({
        props: { trackColor: { false: "#000" }, style: {} },
      });
    });
  });

  test("thumb-* and track-* combine", async () => {
    const className = "thumb-white track-on-green-500 track-off-zinc-300";
    expect(await renderSimple({ className, optimize })).toStrictEqual({
      props: {
        thumbColor: "#fff",
        trackColor: { true: "#00c950", false: "#d4d4d8" },
        style: {},
      },
    });
  });
});
