import { renderCurrentTest } from "../test-utils";

describe("Shadow", () => {
  test("shadow-sm", async () => {
    const result = await renderCurrentTest();
    expect(result.props.style.boxShadow).toStrictEqual([
      {
        offsetX: 0,
        offsetY: 1,
        blurRadius: 3,
        spreadDistance: 0,
        color: "#0000001a",
      },
      {
        offsetX: 0,
        offsetY: 1,
        blurRadius: 2,
        spreadDistance: -1,
        color: "#0000001a",
      },
    ]);
  });

  test("shadow-md", async () => {
    const result = await renderCurrentTest();
    expect(result.props.style.boxShadow).toStrictEqual([
      {
        offsetX: 0,
        offsetY: 4,
        blurRadius: 6,
        spreadDistance: -1,
        color: "#0000001a",
      },
      {
        offsetX: 0,
        offsetY: 2,
        blurRadius: 4,
        spreadDistance: -2,
        color: "#0000001a",
      },
    ]);
  });

  test("shadow-lg", async () => {
    const result = await renderCurrentTest();
    expect(result.props.style.boxShadow).toStrictEqual([
      {
        offsetX: 0,
        offsetY: 10,
        blurRadius: 15,
        spreadDistance: -3,
        color: "#0000001a",
      },
      {
        offsetX: 0,
        offsetY: 4,
        blurRadius: 6,
        spreadDistance: -4,
        color: "#0000001a",
      },
    ]);
  });

  test("shadow-none", async () => {
    const result = await renderCurrentTest();
    expect(result.props.style.boxShadow).toStrictEqual([]);
  });
});
