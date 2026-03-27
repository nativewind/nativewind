import { renderCurrentTest, renderSimple } from "../test-utils";

describe("Ring", () => {
  test("ring-1", async () => {
    const result = await renderCurrentTest();
    expect(result.props.style.boxShadow).toStrictEqual([
      {
        offsetX: 0,
        offsetY: 0,
        blurRadius: 0,
        spreadDistance: 1,
        color: { semantic: ["label", "labelColor"] },
      },
    ]);
  });

  test("ring-2", async () => {
    const result = await renderCurrentTest();
    expect(result.props.style.boxShadow).toStrictEqual([
      {
        offsetX: 0,
        offsetY: 0,
        blurRadius: 0,
        spreadDistance: 2,
        color: { semantic: ["label", "labelColor"] },
      },
    ]);
  });

  test("ring-4", async () => {
    const result = await renderCurrentTest();
    expect(result.props.style.boxShadow).toStrictEqual([
      {
        offsetX: 0,
        offsetY: 0,
        blurRadius: 0,
        spreadDistance: 4,
        color: { semantic: ["label", "labelColor"] },
      },
    ]);
  });

  test("ring-0", async () => {
    const result = await renderCurrentTest();
    // ring-0 produces a zero-spread shadow with currentcolor (not transparent)
    expect(result.props.style.boxShadow).toStrictEqual([
      {
        offsetX: 0,
        offsetY: 0,
        blurRadius: 0,
        spreadDistance: 0,
        color: { semantic: ["label", "labelColor"] },
      },
    ]);
  });

  test("shadow-sm ring-2", async () => {
    const result = await renderSimple({ className: "shadow-sm ring-2" });
    // Ring shadow + two drop shadows from shadow-sm
    expect(result.props.style.boxShadow).toStrictEqual([
      {
        offsetX: 0,
        offsetY: 0,
        blurRadius: 0,
        spreadDistance: 2,
        color: { semantic: ["label", "labelColor"] },
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

describe("Inset Ring", () => {
  test("inset-ring-1", async () => {
    const result = await renderCurrentTest();
    expect(result.props.style.boxShadow).toStrictEqual([
      {
        inset: true,
        offsetX: 0,
        offsetY: 0,
        blurRadius: 0,
        spreadDistance: 1,
        color: { semantic: ["label", "labelColor"] },
      },
    ]);
  });

  test("inset-ring-2", async () => {
    const result = await renderCurrentTest();
    expect(result.props.style.boxShadow).toStrictEqual([
      {
        inset: true,
        offsetX: 0,
        offsetY: 0,
        blurRadius: 0,
        spreadDistance: 2,
        color: { semantic: ["label", "labelColor"] },
      },
    ]);
  });

  test("inset-ring-0", async () => {
    const result = await renderCurrentTest();
    // inset-ring-0 produces a zero-spread inset shadow with currentcolor (not transparent)
    expect(result.props.style.boxShadow).toStrictEqual([
      {
        inset: true,
        offsetX: 0,
        offsetY: 0,
        blurRadius: 0,
        spreadDistance: 0,
        color: { semantic: ["label", "labelColor"] },
      },
    ]);
  });

  test("ring-2 inset-ring-2", async () => {
    const result = await renderSimple({ className: "ring-2 inset-ring-2" });
    // Inset ring first, then regular ring (Tailwind v4 box-shadow ordering)
    expect(result.props.style.boxShadow).toStrictEqual([
      {
        inset: true,
        offsetX: 0,
        offsetY: 0,
        blurRadius: 0,
        spreadDistance: 2,
        color: { semantic: ["label", "labelColor"] },
      },
      {
        offsetX: 0,
        offsetY: 0,
        blurRadius: 0,
        spreadDistance: 2,
        color: { semantic: ["label", "labelColor"] },
      },
    ]);
  });
});
