import { renderCurrentTest } from "../test";

describe("Typography - Font Family", () => {
  test("font-sans", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { fontFamily: "system font" } },
    });
  });
  test("font-serif", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { fontFamily: "Georgia" } },
    });
  });
  test("font-mono", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { fontFamily: "Courier New" } },
    });
  });
});

describe("Typography - Font Size", () => {
  test("text-xs", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { fontSize: 10.5, lineHeight: 14 } },
    });
  });
  test("text-base", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { fontSize: 14, lineHeight: 21 } },
    });
  });
});

describe("Typography - Font Smoothing", () => {
  test("antialiased", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: {
        properties: ["-webkit-font-smoothing", "-moz-osx-font-smoothing"],
      },
    });
  });
  test("subpixel-antialiased", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: {
        properties: ["-webkit-font-smoothing", "-moz-osx-font-smoothing"],
      },
    });
  });
});

describe("Typography - Font Style", () => {
  test("italic", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { fontStyle: "italic" } },
    });
  });
  test("not-italic", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { fontStyle: "normal" } },
    });
  });
});

describe("Typography - Font Weight", () => {
  test("font-thin", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { fontWeight: "100" } },
    });
  });
  test("font-normal", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { fontWeight: "400" } },
    });
  });
  test("font-black", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { fontWeight: "900" } },
    });
  });
});

describe("Typography - Font Variant Numeric", () => {
  test("normal-nums", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["font-variant-numeric"] },
    });
  });
  test("ordinal", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["font-variant-numeric"] },
    });
  });
  test("slashed-zero", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["font-variant-numeric"] },
    });
  });
  test("lining-nums", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["font-variant-numeric"] },
    });
  });
  test("oldstyle-nums", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["font-variant-numeric"] },
    });
  });
  test("proportional-nums", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["font-variant-numeric"] },
    });
  });
  test("tabular-nums", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["font-variant-numeric"] },
    });
  });
  test("diagonal-fractions", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["font-variant-numeric"] },
    });
  });
  test("stacked-fractions", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["font-variant-numeric"] },
    });
  });
});

describe("Typography - Letter Spacing", () => {
  test("tracking-tighter", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { letterSpacing: -0.5 } },
    });
  });
  test("tracking-tight", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { letterSpacing: -0.25 } },
    });
  });
  test("tracking-normal", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { letterSpacing: 0 } },
    });
  });
  test("tracking-wide", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { letterSpacing: 0.25 } },
    });
  });
  test("tracking-wider", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { letterSpacing: 0.5 } },
    });
  });
  test("tracking-widest", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { letterSpacing: 1 } },
    });
  });
});

describe("Typography - Line Clamp", () => {
  test("line-clamp-1", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { numberOfLines: 1, style: { overflow: "hidden" } },
    });
  });
  test("line-clamp-2", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { numberOfLines: 2, style: { overflow: "hidden" } },
    });
  });
  test("line-clamp-3", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { numberOfLines: 3, style: { overflow: "hidden" } },
    });
  });
  test("line-clamp-4", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { numberOfLines: 4, style: { overflow: "hidden" } },
    });
  });
  test("line-clamp-5", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { numberOfLines: 5, style: { overflow: "hidden" } },
    });
  });
  test("line-clamp-6", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { numberOfLines: 6, style: { overflow: "hidden" } },
    });
  });
  test("line-clamp-none", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {
        numberOfLines: 0,
        style: { overflow: "visible" },
      },
    });
  });
});

describe("Typography - Line Height", () => {
  test("leading-3", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { lineHeight: 10.5 } },
    });
  });
  test("leading-4", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { lineHeight: 14 } },
    });
  });
});

describe("Typography - List Style Image", () => {
  test("list-image-none", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["list-style-image"] },
    });
  });
});

describe("Typography - List Style Position", () => {
  test("list-inside", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["list-style-position"] },
    });
  });
  test("list-outside", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["list-style-position"] },
    });
  });
});

describe("Typography - List Style Type", () => {
  test("list-none", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["list-style-type"] },
    });
  });
  test("list-disc", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["list-style-type"] },
    });
  });
  test("list-decimal", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["list-style-type"] },
    });
  });
});

describe("Typography - Text Align", () => {
  test("text-left", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { textAlign: "left" } },
    });
  });
  test("text-center", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { textAlign: "center" } },
    });
  });
  test("text-right", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { textAlign: "right" } },
    });
  });
  test("text-justify", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { textAlign: "justify" } },
    });
  });
});

describe("Typography - Text Color", () => {
  test("text-black", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { color: "#000000" } },
    });
  });
  test("text-white", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { color: "#ffffff" } },
    });
  });
  test("text-transparent", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { color: "#00000000" } },
    });
  });
  test("text-slate-50", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { color: "#f8fafc" } },
    });
  });
  test("text-white/50", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { color: "#ffffff80" } },
    });
  });
  test("text-current", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { style: { color: "currentcolor" } },
    });
  });
  test("text-inherit", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { style: { color: "inherit" } },
    });
  });
});

describe("Typography - Text Decoration", () => {
  test("underline", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { textDecorationLine: "underline" } },
    });
  });
  test("line-through", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { textDecorationLine: "line-through" } },
    });
  });
  test("no-underline", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { textDecorationLine: "none" } },
    });
  });
  test("overline", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { style: { "text-decoration-line": "overline" } },
    });
  });
});

describe("Typography - Text Decoration Color", () => {
  test("decoration-black", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { textDecorationColor: "#000000" } },
    });
  });
  test("decoration-white", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { textDecorationColor: "#ffffff" } },
    });
  });
  test("decoration-transparent", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { textDecorationColor: "#00000000" } },
    });
  });
  test("decoration-slate-50", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { textDecorationColor: "#f8fafc" } },
    });
  });
  test("decoration-current", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { style: { "text-decoration-color": "currentcolor" } },
    });
  });
  test("decoration-inherit", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { style: { "text-decoration-color": "inherit" } },
    });
  });
});

describe("Typography - Text Decoration Style", () => {
  test("decoration-solid", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { textDecorationStyle: "solid" } },
    });
  });
  test("decoration-double", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { textDecorationStyle: "double" } },
    });
  });
  test("decoration-dotted", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { textDecorationStyle: "dotted" } },
    });
  });
  test("decoration-dashed", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { textDecorationStyle: "dashed" } },
    });
  });
  test("decoration-wavy", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { style: { "text-decoration-style": "wavy" } },
    });
  });
});

describe("Typography - Text Decoration Thickness", () => {
  test("decoration-auto", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["text-decoration-thickness"] },
    });
  });
  test("decoration-from-font", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["text-decoration-thickness"] },
    });
  });
  test("decoration-0", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["text-decoration-thickness"] },
    });
  });
  test("decoration-1", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["text-decoration-thickness"] },
    });
  });
});

describe("Typography - Text Underline Offset", () => {
  test("underline-offset-auto", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["text-underline-offset"] },
    });
  });
  test("underline-offset-0", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["text-underline-offset"] },
    });
  });
});

describe("Typography - Text Transform", () => {
  test("uppercase", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { textTransform: "uppercase" } },
    });
  });
  test("lowercase", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { textTransform: "lowercase" } },
    });
  });
  test("capitalize", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { textTransform: "capitalize" } },
    });
  });
  test("normal-case", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { textTransform: "none" } },
    });
  });
});

describe("Typography - Text Overflow", () => {
  test("text-ellipsis", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["text-overflow"] },
    });
  });
  test("text-clip", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["text-overflow"] },
    });
  });
});

describe("Typography - Text Indent", () => {
  test("indent-px", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["text-indent"] },
    });
  });
  test("indent-0", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["text-indent"] },
    });
  });
  test("indent-1", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["text-indent"] },
    });
  });
});

describe("Typography - Vertical Align", () => {
  test("align-baseline", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { style: { "vertical-align": "baseline" } },
    });
  });
  test("align-top", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { verticalAlign: "top" } },
    });
  });
  test("align-middle", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { verticalAlign: "middle" } },
    });
  });
  test("align-bottom", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { verticalAlign: "bottom" } },
    });
  });
  test("align-text-top", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { style: { "vertical-align": "text-top" } },
    });
  });
  test("align-text-bottom", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { style: { "vertical-align": "text-bottom" } },
    });
  });
  test("align-sub", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { style: { "vertical-align": "sub" } },
    });
  });
  test("align-super", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { style: { "vertical-align": "super" } },
    });
  });
});

describe("Typography - Whitespace", () => {
  test("whitespace-normal", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["white-space"] },
    });
  });
  test("whitespace-nowrap", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["white-space"] },
    });
  });
  test("whitespace-pre", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["white-space"] },
    });
  });
  test("whitespace-pre-line", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["white-space"] },
    });
  });
  test("whitespace-pre-wrap", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["white-space"] },
    });
  });
});

describe("Typography - Word Break", () => {
  test("break-normal", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: {
        properties: ["overflow-wrap", "word-break"],
      },
    });
  });
  test("break-words", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["overflow-wrap"] },
    });
  });
  test("break-all", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["word-break"] },
    });
  });
});

describe("Typography - Hyphens", () => {
  test("hyphens-none", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["hyphens"] },
    });
  });
  test("hyphens-manual", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["hyphens"] },
    });
  });
  test("hyphens-auto", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["hyphens"] },
    });
  });
});

describe("Typography - Content", () => {
  test("content-none", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["content"] },
    });
  });
});
