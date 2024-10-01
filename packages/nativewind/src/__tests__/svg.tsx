import { renderCurrentTest } from "../test";

describe("SVG - Fill", () => {
  test("fill-black", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { fill: "#000000" },
    });
  });
});

describe("SVG - Stroke", () => {
  test("stroke-black", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { stroke: "#000000" },
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
