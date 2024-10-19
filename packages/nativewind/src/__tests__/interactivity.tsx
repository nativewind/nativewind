import { renderCurrentTest } from "../test";

describe("Interactivity - Accent Color", () => {
  test("accent-inherit", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["accent-color"] },
    });
  });
  test("accent-current", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["accent-color"] },
    });
  });
  test("accent-white", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["accent-color"] },
    });
  });
});

describe("Interactivity - Appearance", () => {
  test("appearance-none", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["appearance"] },
    });
  });
});

describe("Interactivity - Cursor", () => {
  test("cursor-auto", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["cursor"] },
    });
  });
  test("cursor-default", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["cursor"] },
    });
  });
  test("cursor-default", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["cursor"] },
    });
  });
});

describe("Interactivity - Caret Color", () => {
  test("caret-inherit", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { style: { "caret-color": "inherit" } },
    });
  });
  test("caret-current", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { style: { "caret-color": "currentcolor" } },
    });
  });
  test("caret-white", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { cursorColor: "#ffffff" },
    });
  });
});

describe("Interactivity - Pointer Events", () => {
  test("pointer-events-none", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { pointerEvents: "none" } },
    });
  });
  test("pointer-events-auto", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { pointerEvents: "auto" } },
    });
  });
  test("pointer-events-box-none", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { pointerEvents: "box-none" } },
    });
  });
  test("pointer-events-box-only", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { pointerEvents: "box-only" } },
    });
  });
});

describe("Interactivity - Resize", () => {
  test("resize-none", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["resize"] },
    });
  });
  test("resize-y", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["resize"] },
    });
  });
  test("resize-x", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["resize"] },
    });
  });
  test("resize", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["resize"] },
    });
  });
});

describe("Interactivity - Scroll Behavior", () => {
  test("scroll-auto", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["scroll-behavior"] },
    });
  });
  test("scroll-smooth", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["scroll-behavior"] },
    });
  });
});

describe("Interactivity - Scroll Margin", () => {
  test("scroll-m-0", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["scroll-margin"] },
    });
  });
  test("scroll-mx-0", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["scroll-margin-left", "scroll-margin-right"] },
    });
  });
  test("scroll-my-0", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["scroll-margin-top", "scroll-margin-bottom"] },
    });
  });
  test("scroll-mt-0", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["scroll-margin-top"] },
    });
  });
  test("scroll-mr-0", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["scroll-margin-right"] },
    });
  });
  test("scroll-mb-0", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["scroll-margin-bottom"] },
    });
  });
  test("scroll-ml-0", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["scroll-margin-left"] },
    });
  });
  test("scroll-ms-0", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["scroll-margin-inline-start"] },
    });
  });
  test("scroll-me-0", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["scroll-margin-inline-end"] },
    });
  });
  test("scroll-m-px", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["scroll-margin"] },
    });
  });
  test("scroll-mx-px", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["scroll-margin-left", "scroll-margin-right"] },
    });
  });
  test("scroll-my-px", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["scroll-margin-top", "scroll-margin-bottom"] },
    });
  });
  test("scroll-mt-px", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["scroll-margin-top"] },
    });
  });
  test("scroll-mr-px", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["scroll-margin-right"] },
    });
  });
  test("scroll-mb-px", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["scroll-margin-bottom"] },
    });
  });
  test("scroll-ml-px", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["scroll-margin-left"] },
    });
  });
  test("scroll-ms-px", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["scroll-margin-inline-start"] },
    });
  });
  test("scroll-me-px", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["scroll-margin-inline-end"] },
    });
  });
});

describe("Interactivity - Scroll Padding", () => {
  test("scroll-p-0", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["scroll-padding"] },
    });
  });
  test("scroll-px-0", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["scroll-padding-left", "scroll-padding-right"] },
    });
  });
  test("scroll-py-0", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["scroll-padding-top", "scroll-padding-bottom"] },
    });
  });
  test("scroll-pt-0", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["scroll-padding-top"] },
    });
  });
  test("scroll-pr-0", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["scroll-padding-right"] },
    });
  });
  test("scroll-pb-0", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["scroll-padding-bottom"] },
    });
  });
  test("scroll-pl-0", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["scroll-padding-left"] },
    });
  });
  test("scroll-ps-0", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["scroll-padding-inline-start"] },
    });
  });
  test("scroll-pe-0", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["scroll-padding-inline-end"] },
    });
  });
  test("scroll-p-px", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["scroll-padding"] },
    });
  });
  test("scroll-px-px", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["scroll-padding-left", "scroll-padding-right"] },
    });
  });
  test("scroll-py-px", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["scroll-padding-top", "scroll-padding-bottom"] },
    });
  });
  test("scroll-pt-px", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["scroll-padding-top"] },
    });
  });
  test("scroll-pr-px", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["scroll-padding-right"] },
    });
  });
  test("scroll-pb-px", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["scroll-padding-bottom"] },
    });
  });
  test("scroll-pl-px", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["scroll-padding-left"] },
    });
  });
  test("scroll-ps-px", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["scroll-padding-inline-start"] },
    });
  });
  test("scroll-pe-px", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["scroll-padding-inline-end"] },
    });
  });
});

describe("Interactivity - Scroll Snap Align", () => {
  test("snap-start", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["scroll-snap-align"] },
    });
  });
  test("snap-end", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["scroll-snap-align"] },
    });
  });
  test("snap-center", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["scroll-snap-align"] },
    });
  });
  test("snap-align-none", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["scroll-snap-align"] },
    });
  });
});

describe("Interactivity - Scroll Snap Stop", () => {
  test("snap-normal", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["scroll-snap-stop"] },
    });
  });
  test("snap-always", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["scroll-snap-stop"] },
    });
  });
});

describe("Interactivity - Scroll Snap Type", () => {
  test("snap-none", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["scroll-snap-type"] },
    });
  });
  test("snap-x", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["scroll-snap-type"] },
    });
  });
  test("snap-y", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["scroll-snap-type"] },
    });
  });
  test("snap-both", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["scroll-snap-type"] },
    });
  });
  test("snap-mandatory", async () => {
    expect(await renderCurrentTest()).toStrictEqual({ props: {} });
  });
  test("snap-proximity", async () => {
    expect(await renderCurrentTest()).toStrictEqual({ props: {} });
  });
});

describe("Interactivity - Touch Action", () => {
  test("touch-auto", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["touch-action"] },
    });
  });
  test("touch-none", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["touch-action"] },
    });
  });
  test("touch-pan-x", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["touch-action"] },
    });
  });
  test("touch-pan-left", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["touch-action"] },
    });
  });
  test("touch-pan-right", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["touch-action"] },
    });
  });
  test("touch-pan-y", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["touch-action"] },
    });
  });
  test("touch-pan-up", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["touch-action"] },
    });
  });
  test("touch-pan-down", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["touch-action"] },
    });
  });
  test("touch-pinch-zoom", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["touch-action"] },
    });
  });
  test("touch-manipulation", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["touch-action"] },
    });
  });
});

describe("Interactivity - User Select", () => {
  test("select-none", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { userSelect: "none" } },
    });
  });
  test("select-text", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { userSelect: "text" } },
    });
  });
  test("select-all", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { userSelect: "all" } },
    });
  });
  test("select-auto", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { userSelect: "auto" } },
    });
  });
});

describe("Interactivity - Will Change", () => {
  test("will-change-auto", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["will-change"] },
    });
  });
  test("will-change-scroll", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["will-change"] },
    });
  });
  test("will-change-contents", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["will-change"] },
    });
  });
  test("will-change-transform", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["will-change"] },
    });
  });
});
