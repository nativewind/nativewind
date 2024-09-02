import { renderCurrentTest } from "../test";

describe("Layout - Aspect Ratio", () => {
  test("aspect-square", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { aspectRatio: 1 } },
    });
  });
  test("aspect-video", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { aspectRatio: "16 / 9" } },
    });
  });
  test("aspect-[4/3]", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { aspectRatio: "4 / 3" } },
    });
  });
});

describe("Layout - Container", () => {
  test("container", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { maxWidth: 640, width: "100%" } },
    });
  });
});

describe("Layout - Columns", () => {
  test("columns-1", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["columns"] },
    });
  });
  test("columns-2", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["columns"] },
    });
  });
});

describe("Layout - Break After", () => {
  test("break-after-auto", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["break-after"] },
    });
  });
  test("break-after-avoid", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["break-after"] },
    });
  });
  test("break-after-all", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["break-after"] },
    });
  });
  test("break-after-avoid-page", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["break-after"] },
    });
  });
  test("break-after-page", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["break-after"] },
    });
  });
  test("break-after-left", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["break-after"] },
    });
  });
  test("break-after-right", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["break-after"] },
    });
  });
  test("break-after-column", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["break-after"] },
    });
  });
});

describe("Layout - Break Before", () => {
  test("break-before-auto", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["break-before"] },
    });
  });
  test("break-before-avoid", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["break-before"] },
    });
  });
  test("break-before-all", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["break-before"] },
    });
  });
  test("break-before-avoid-page", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["break-before"] },
    });
  });
  test("break-before-page", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["break-before"] },
    });
  });
  test("break-before-left", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["break-before"] },
    });
  });
  test("break-before-right", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["break-before"] },
    });
  });
  test("break-before-column", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["break-before"] },
    });
  });
});

describe("Layout - Break Inside", () => {
  test("break-inside-auto", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["break-inside"] },
    });
  });
  test("break-inside-avoid", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["break-inside"] },
    });
  });
  test("break-inside-avoid-page", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["break-inside"] },
    });
  });
  test("break-inside-avoid-column", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["break-inside"] },
    });
  });
});

describe("Layout - Box Decoration Break", () => {
  test("box-decoration-clone", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["box-decoration-break"] },
    });
  });
  test("box-decoration-slice", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["box-decoration-break"] },
    });
  });
});

describe("Layout - Box Sizing", () => {
  test("box-border", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["box-sizing"] },
    });
  });
  test("box-content", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["box-sizing"] },
    });
  });
});

describe("Layout - Display", () => {
  test("flex", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { display: "flex" } },
    });
  });
  test("hidden", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { display: "none" } },
    });
  });
  test("block", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { style: { display: "block" } },
    });
  });
  test("inline-block", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { style: { display: "inline-block" } },
    });
  });
  test("inline", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { style: { display: "inline" } },
    });
  });
  test("inline-flex", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { style: { display: "inline-flex" } },
    });
  });
  test("table", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { style: { display: "table" } },
    });
  });
  test("inline-table", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { style: { display: "inline-table" } },
    });
  });
  test("table-caption", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { style: { display: "table-caption" } },
    });
  });
  test("table-cell", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { style: { display: "table-cell" } },
    });
  });
  test("table-column", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { style: { display: "table-column" } },
    });
  });
  test("table-column-group", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { style: { display: "table-column-group" } },
    });
  });
  test("table-footer-group", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { style: { display: "table-footer-group" } },
    });
  });
  test("table-header-group", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { style: { display: "table-header-group" } },
    });
  });
  test("table-row-group", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { style: { display: "table-row-group" } },
    });
  });
  test("table-row", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { style: { display: "table-row" } },
    });
  });
  test("flow-root", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { style: { display: "flow-root" } },
    });
  });
  test("grid", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { style: { display: "grid" } },
    });
  });
  test("inline-grid", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { style: { display: "inline-grid" } },
    });
  });
  test("contents", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { style: { display: "contents" } },
    });
  });
  test("list-item", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { style: { display: "list-item" } },
    });
  });
});

describe("Layout - Floats", () => {
  test("float-right", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["float"] },
    });
  });
  test("float-left", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["float"] },
    });
  });
  test("float-none", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["float"] },
    });
  });
});

describe("Layout - Clear", () => {
  test("clear-right", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["clear"] },
    });
  });
  test("clear-left", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["clear"] },
    });
  });
  test("clear-both", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["clear"] },
    });
  });
  test("clear-none", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["clear"] },
    });
  });
});

describe("Layout - Isolation", () => {
  test("isolate", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["isolation"] },
    });
  });
  test("isolation-auto", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["isolation"] },
    });
  });
});

describe("Layout - Object Fit", () => {
  test("object-contain", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["object-fit"] },
    });
  });
  test("object-cover", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["object-fit"] },
    });
  });
  test("object-fill", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["object-fit"] },
    });
  });
  test("object-none", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["object-fit"] },
    });
  });
  test("object-scale-down", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["object-fit"] },
    });
  });
});

describe("Layout - Object Position", () => {
  test("object-bottom", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["object-position"] },
    });
  });
  test("object-center", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["object-position"] },
    });
  });
  test("object-left", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["object-position"] },
    });
  });
  test("object-left-bottom", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["object-position"] },
    });
  });
  test("object-left-top", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["object-position"] },
    });
  });
  test("object-right", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["object-position"] },
    });
  });
  test("object-right-bottom", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["object-position"] },
    });
  });
  test("object-right-top", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["object-position"] },
    });
  });
  test("object-top", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["object-position"] },
    });
  });
});

describe("Layout - Overflow", () => {
  test("overflow-auto", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { style: { overflow: "auto" } },
    });
  });
  test("overflow-clip", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { style: { overflow: "clip" } },
    });
  });
  test("overflow-scroll", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { style: { overflow: "scroll" } },
    });
  });
  test("overflow-x-auto", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["overflow-x"] },
    });
  });
  test("overflow-y-auto", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["overflow-y"] },
    });
  });
  test("overflow-x-hidden", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["overflow-x"] },
    });
  });
  test("overflow-y-hidden", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["overflow-y"] },
    });
  });
  test("overflow-x-clip", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["overflow-x"] },
    });
  });
  test("overflow-y-clip", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["overflow-y"] },
    });
  });
  test("overflow-x-visible", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["overflow-x"] },
    });
  });
  test("overflow-y-visible", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["overflow-y"] },
    });
  });
  test("overflow-x-scroll", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["overflow-x"] },
    });
  });
  test("overflow-y-scroll", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["overflow-y"] },
    });
  });
  test("overflow-hidden", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { overflow: "hidden" } },
    });
  });
  test("overflow-visible", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { overflow: "visible" } },
    });
  });
});

describe("Layout - Overscroll Behavior", () => {
  test("overscroll-auto", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["overscroll-behavior"] },
    });
  });
  test("overscroll-contain", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["overscroll-behavior"] },
    });
  });
  test("overscroll-none", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["overscroll-behavior"] },
    });
  });
  test("overscroll-y-auto", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["overscroll-behavior-y"] },
    });
  });
  test("overscroll-y-contain", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["overscroll-behavior-y"] },
    });
  });
  test("overscroll-y-none", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["overscroll-behavior-y"] },
    });
  });
  test("overscroll-x-auto", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["overscroll-behavior-x"] },
    });
  });
  test("overscroll-x-contain", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["overscroll-behavior-x"] },
    });
  });
  test("overscroll-x-none", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["overscroll-behavior-x"] },
    });
  });
});

describe("Layout - Position", () => {
  test("absolute", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { position: "absolute" } },
    });
  });
  test("relative", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { position: "relative" } },
    });
  });
  test("static", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { style: { position: "static" } },
    });
  });
  test("fixed", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { style: { position: "fixed" } },
    });
  });
  test("sticky", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { style: { position: "sticky" } },
    });
  });
});

describe("Layout - Top Right Bottom Left", () => {
  test("top-0", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { top: 0 } },
    });
  });
  test("top-px", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { top: 1 } },
    });
  });
  test("top-1", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { top: 3.5 } },
    });
  });
  test("top-1/2", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { top: "50%" } },
    });
  });
  test("top-full", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { top: "100%" } },
    });
  });
  test("top-[10px]", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { top: 10 } },
    });
  });
  test("bottom-0", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { bottom: 0 } },
    });
  });
  test("bottom-px", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { bottom: 1 } },
    });
  });
  test("bottom-1", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { bottom: 3.5 } },
    });
  });
  test("bottom-1/2", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { bottom: "50%" } },
    });
  });
  test("bottom-full", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { bottom: "100%" } },
    });
  });
  test("bottom-[10px]", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { bottom: 10 } },
    });
  });
  test("left-0", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { left: 0 } },
    });
  });
  test("left-px", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { left: 1 } },
    });
  });
  test("left-1", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { left: 3.5 } },
    });
  });
  test("left-1/2", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { left: "50%" } },
    });
  });
  test("left-full", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { left: "100%" } },
    });
  });
  test("left-[10px]", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { left: 10 } },
    });
  });
  test("right-0", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { right: 0 } },
    });
  });
  test("right-px", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { right: 1 } },
    });
  });
  test("right-1", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { right: 3.5 } },
    });
  });
  test("right-1/2", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { right: "50%" } },
    });
  });
  test("right-full", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { right: "100%" } },
    });
  });
  test("right-[10px]", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { right: 10 } },
    });
  });
  test("inset-auto", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: {
        style: { top: "auto", bottom: "auto", left: "auto", right: "auto" },
      },
    });
  });
  test("inset-x-auto", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { style: { left: "auto", right: "auto" } },
    });
  });
  test("inset-y-auto", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { style: { top: "auto", bottom: "auto" } },
    });
  });
  test("top-auto", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { style: { top: "auto" } },
    });
  });
  test("right-auto", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { style: { right: "auto" } },
    });
  });
  test("bottom-auto", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { style: { bottom: "auto" } },
    });
  });
  test("left-auto", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { style: { left: "auto" } },
    });
  });
});

describe("Layout - Visibility", () => {
  test("visible", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { opacity: 1 } },
    });
  });
  test("invisible", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { opacity: 0 } },
    });
  });
});

describe("Layout - Z-Index", () => {
  test("z-auto", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { style: { "z-index": "auto" } },
    });
  });
  test("z-0", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { zIndex: 0 } },
    });
  });
});
