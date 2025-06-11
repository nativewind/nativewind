import { renderCurrentTest } from "../test";

describe("Custom - Elevation", () => {
  test("elevation", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {
        style: {
          elevation: 3,
        },
      },
    });
  });
  test("elevation-sm", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {
        style: {
          elevation: 1,
        },
      },
    });
  });
});
