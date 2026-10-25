import { renderCurrentTest } from "../test-utils";

describe("Custom - TextInput cursorColor", () => {
  test("caret-black", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {
        cursorColor: "#000",
        style: {},
      },
    });
  });
});
