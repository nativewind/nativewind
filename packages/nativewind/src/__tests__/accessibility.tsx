import { renderCurrentTest } from "../test";

describe("Accessibility - Screen Readers", () => {
  test("sr-only", async () => {
    const { props, invalid } = await renderCurrentTest();
    expect(props).toStrictEqual({
      style: {
        borderWidth: 0,
        height: 1,
        margin: -1,
        overflow: "hidden",
        padding: 0,
        position: "absolute",
        width: 1,
      },
    });
    expect(invalid).toStrictEqual({
      properties: ["clip", "white-space"],
    });
  });

  test("not-sr-only", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {
        style: {
          margin: 0,
          overflow: "visible",
          padding: 0,
        },
      },
      invalid: {
        properties: ["clip", "white-space"],
        style: {
          position: "static",
          width: "auto",
          height: "auto",
        },
      },
    });
  });
});
