import { renderCurrentTest } from "../test";

describe("SVG - Fill", () => {
  test("fill-black", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { fill: "rgba(0, 0, 0, 1)" },
    });
  });
});

describe("SVG - Stroke", () => {
  test("stroke-black", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { stroke: "rgba(0, 0, 0, 1)" },
    });
  });
});

describe("SVG - Stroke Width", () => {
  test("stroke-1", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { strokeWidth: 1 },
    });
  });
});
