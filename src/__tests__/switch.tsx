import { renderCurrentTest } from "../test-utils";

describe("Custom - Switch thumbColor", () => {
  test("thumb-black", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {
        style: { thumbColor: "#000" },
      },
    });
  });
});

describe("Custom - Switch trackColor", () => {
  test("track-black", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {
        style: { trackColor: "#000" },
      },
    });
  });
});
