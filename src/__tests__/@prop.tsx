import { renderCurrentTest, renderSimple } from "../test-utils";

describe.each([false, true])("CSS optimization: %s", (optimize) => {
  test("stacked variants retain both property mappings", async () => {
    expect(
      await renderSimple({
        className:
          "@map-[test.width]/width:@map-[test.height]/height:size-[37px]",
        optimize,
      }),
    ).toStrictEqual({ props: { test: { width: 37, height: 37 }, style: {} } });
  });
  describe("@map/<props>:", () => {
    test("@map/test:color-black", async () => {
      expect(await renderCurrentTest({ optimize })).toStrictEqual({
        props: { test: "#000", style: {} },
      });
    });
    test("@map/test.nested:color-black", async () => {
      expect(await renderCurrentTest({ optimize })).toStrictEqual({
        props: { test: { nested: "#000" }, style: {} },
      });
    });
    test("@map/&.test:color-black", async () => {
      expect(await renderCurrentTest({ optimize })).toStrictEqual({
        props: { style: { test: "#000" } },
      });
    });
    test("@map/&.test.nested:color-black", async () => {
      expect(await renderCurrentTest({ optimize })).toStrictEqual({
        props: { style: { test: { nested: "#000" } } },
      });
    });
  });

  // @map-[prop] is an alias for @map/<prop>:
  describe("@map-[prop]:", () => {
    test("@map-[test]:color-black", async () => {
      expect(await renderCurrentTest({ optimize })).toStrictEqual({
        props: { test: "#000", style: {} },
      });
    });
    test("@map-[test.nested]:color-black", async () => {
      expect(await renderCurrentTest({ optimize })).toStrictEqual({
        props: { test: { nested: "#000" }, style: {} },
      });
    });
    test("@map-[&.test]:color-black", async () => {
      expect(await renderCurrentTest({ optimize })).toStrictEqual({
        props: { style: { test: "#000" } },
      });
    });
    test("@map-[&.test.nested]:color-black", async () => {
      expect(await renderCurrentTest({ optimize })).toStrictEqual({
        props: { style: { test: { nested: "#000" } } },
      });
    });
  });

  describe("@map-[props]/<attributes>:", () => {
    test("@map-[test]/fontSize:text-base", async () => {
      expect(await renderCurrentTest({ optimize })).toStrictEqual({
        props: { test: 14, style: { lineHeight: 21 } },
      });
    });
    test("@map-[test.nested]/fontSize:text-base", async () => {
      expect(await renderCurrentTest({ optimize })).toStrictEqual({
        props: { test: { nested: 14 }, style: { lineHeight: 21 } },
      });
    });
    test("@map-[&.test]/fontSize:text-base", async () => {
      expect(await renderCurrentTest({ optimize })).toStrictEqual({
        props: { style: { lineHeight: 21, test: 14 } },
      });
    });
    test("@map-[&.test.nested]/fontSize:text-base", async () => {
      expect(await renderCurrentTest({ optimize })).toStrictEqual({
        props: { style: { lineHeight: 21, test: { nested: 14 } } },
      });
    });
  });
});
