import { renderSimple } from "../test-utils";

const mappings = [
  ["@map/test:color-black", { test: "#000", style: {} }],
  ["@map/test.nested:color-black", { test: { nested: "#000" }, style: {} }],
  ["@map-[test]:color-black", { test: "#000", style: {} }],
  ["@map-[test.nested]:color-black", { test: { nested: "#000" }, style: {} }],
  ["@map-[&.test]:color-black", { style: { test: "#000" } }],
  ["@map-[&.test.nested]:color-black", { style: { test: { nested: "#000" } } }],
  ["@map-[test]/fontSize:text-base", { test: 14, style: { lineHeight: 21 } }],
  [
    "@map-[test.nested]/fontSize:text-base",
    { test: { nested: 14 }, style: { lineHeight: 21 } },
  ],
  ["@map-[&.test]/fontSize:text-base", { style: { lineHeight: 21, test: 14 } }],
  [
    "@map-[&.test.nested]/fontSize:text-base",
    { style: { lineHeight: 21, test: { nested: 14 } } },
  ],
] as const;

describe.each([false, true])(
  "TSX source discovery; optimization %s",
  (optimize) => {
    test.each(mappings)(
      "discovers and renders %s",
      async (className, props) => {
        expect(
          await renderSimple({
            className,
            sourceFile: `<View className=${JSON.stringify(className)} />`,
            optimize,
          }),
        ).toStrictEqual({ props });
      },
    );

    test("does not generate a mapping absent from the source file", async () => {
      const className = "@map-[&.test]:color-black";
      expect(
        await renderSimple({
          className,
          sourceFile: '<View className="" />',
          optimize,
        }),
      ).toStrictEqual({ props: {} });
    });

    test.each(["@map/&.test:color-black", "@map/&.test.nested:color-black"])(
      "records the scanner omission for %s",
      async (className) => {
        expect(
          await renderSimple({
            className,
            sourceFile: `<View className=${JSON.stringify(className)} />`,
            optimize,
          }),
        ).toStrictEqual({ props: {} });
      },
    );
  },
);
