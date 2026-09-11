import { renderSimple } from "../test-utils";

describe.each([false, true])("line height with optimization %s", (optimize) => {
  test.each([
    ["text-[20px] leading-8", { fontSize: 20, lineHeight: 28 }],
    ["text-[24px] leading-8", { fontSize: 24, lineHeight: 28 }],
    ["text-[20px] leading-[31px]", { fontSize: 20, lineHeight: 31 }],
    ["text-[20px] leading-[1.5]", { fontSize: 20, lineHeight: 30 }],
  ] as const)(
    "renders %s independently of the font size",
    async (className, style) => {
      expect(
        await renderSimple({
          className,
          sourceFile: `<View className=${JSON.stringify(className)} />`,
          optimize,
        }),
      ).toStrictEqual({ props: { style } });
    },
  );
  test("uses a custom spacing length directly", async () => {
    const className = "text-[20px] leading-8";
    expect(
      await renderSimple({
        className,
        sourceFile: `<View className=${JSON.stringify(className)} />`,
        extraCss: "@theme { --spacing: 5px; }",
        optimize,
      }),
    ).toStrictEqual({ props: { style: { fontSize: 20, lineHeight: 40 } } });
  });
});
