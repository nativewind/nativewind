import { renderCurrentTest } from "../test-utils";

describe("Accessibility - Screen Readers", () => {
  test("sr-only", async () => {
    const { props } = await renderCurrentTest();
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
    // expect(invalid).toStrictEqual({
    //   properties: ["clip", "white-space"],
    // });
  });

  test("not-sr-only", async () => {
    const result = await renderCurrentTest();
    expect(result).toStrictEqual({
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
