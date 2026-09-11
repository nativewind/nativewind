import { renderCurrentTest, renderSimple } from "../test-utils";

describe("Custom - Ripple Color", () => {
  test("ripple-black", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {
        android_ripple: { color: "#000" },
        style: {},
      },
    });
  });
});

describe("Custom - Ripple Borderless", () => {
  test("ripple-borderless", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { android_ripple: { borderless: true }, style: {} },
    });
  });
});

describe("Custom utility production discovery", () => {
  test.each([
    ["ripple-foreground", { android_ripple: { foreground: true }, style: {} }],
    [
      "ripple-black ripple-foreground ripple-16",
      {
        android_ripple: { color: "#000", foreground: true, radius: 16 },
        style: {},
      },
    ],
    ["corner-rounded", { style: { borderCurve: "circular" } }],
    ["corner-squircle", { style: { borderCurve: "continuous" } }],
  ])("%s", async (className, props) => {
    expect(
      await renderSimple({
        className,
        sourceFile: `<View className="${className}" />`,
        optimize: true,
      }),
    ).toStrictEqual({ props });
  });
});

describe("Named physical corner radius utilities", () => {
  // Tailwind radius-lg is 0.5rem; the default native rem is 14 points.
  test.each([
    ["rounded-bl-lg", { borderBottomLeftRadius: 7 }],
    ["rounded-br-lg", { borderBottomRightRadius: 7 }],
    ["rounded-l-lg", { borderTopLeftRadius: 7, borderBottomLeftRadius: 7 }],
    ["rounded-r-lg", { borderTopRightRadius: 7, borderBottomRightRadius: 7 }],
    ["rounded-tl-lg", { borderTopLeftRadius: 7 }],
    ["rounded-tr-lg", { borderTopRightRadius: 7 }],
  ])("%s selects only its physical corners", async (className, style) => {
    expect(
      await renderSimple({
        className,
        sourceFile: `<View className="${className}" />`,
        optimize: true,
      }),
    ).toStrictEqual({ props: { style } });
  });
});
