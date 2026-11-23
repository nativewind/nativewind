import { renderCurrentTest } from "../test-utils";

describe.each([false, true])("CSS optimization: %s", (optimize) => {
  describe("Custom - Switch thumbColor", () => {
    test("thumb-black", async () => {
      expect(await renderCurrentTest({ optimize })).toStrictEqual({
        props: { thumbColor: "#000", style: {} },
      });
    });
  });

  describe("Custom - Switch trackColor", () => {
    test("track-black", async () => {
      expect(await renderCurrentTest({ optimize })).toStrictEqual({
        props: {
          style: { trackColor: "#000" },
        },
      });
    });
  });
});
