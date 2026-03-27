import { renderCurrentTest, renderSimple } from "../test-utils";

describe("Inset Shadow", () => {
  test("inset-shadow-xs", async () => {
    const result = await renderCurrentTest();
    expect(result.props.style.boxShadow).toStrictEqual([
      {
        inset: true,
        offsetX: 0,
        offsetY: 1,
        blurRadius: 1,
        color: "#0000000d",
      },
    ]);
  });

  test("inset-shadow-sm", async () => {
    const result = await renderCurrentTest();
    expect(result.props.style.boxShadow).toStrictEqual([
      {
        inset: true,
        offsetX: 0,
        offsetY: 2,
        blurRadius: 4,
        color: "#0000000d",
      },
    ]);
  });

  test("inset-shadow-none", async () => {
    const result = await renderCurrentTest();
    expect(result.props.style.boxShadow).toStrictEqual([]);
  });

  test("shadow-sm inset-shadow-sm", async () => {
    const result = await renderSimple({
      className: "shadow-sm inset-shadow-sm",
    });
    // Inset shadow first, then regular shadows (Tailwind v4 box-shadow ordering)
    expect(result.props.style.boxShadow).toStrictEqual([
      {
        inset: true,
        offsetX: 0,
        offsetY: 2,
        blurRadius: 4,
        color: "#0000000d",
      },
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
});
