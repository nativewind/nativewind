import { renderCurrentTest } from "../test-utils";

describe("@map/<props>:", () => {
  test("@map/test:color-black", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { test: "#000", style: {} },
    });
  });
  test("@map/test.nested:color-black", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { test: { nested: "#000" }, style: {} },
    });
  });
  test("@map/&.test:color-black", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { test: "#000" } },
    });
  });
  test("@map/&.test.nested:color-black", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { test: { nested: "#000" } } },
    });
  });
});

// @map-[prop] is an alias for @map/<prop>:
describe("@map-[prop]:", () => {
  test("@map-[test]:color-black", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { test: "#000", style: {} },
    });
  });
  test("@map-[test.nested]:color-black", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { test: { nested: "#000" }, style: {} },
    });
  });
  test("@map-[&.test]:color-black", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { test: "#000" } },
    });
  });
  test("@map-[&.test.nested]:color-black", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { test: { nested: "#000" } } },
    });
  });
});

describe("@map-[props]/<attributes>:", () => {
  test("@map-[test]/fontSize:text-base", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { test: 14, style: { lineHeight: 21 } },
    });
  });
  test("@map-[test.nested]/fontSize:text-base", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { test: { nested: 14 }, style: { lineHeight: 21 } },
    });
  });
  test("@map-[&.test]/fontSize:text-base", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { lineHeight: 21, test: 14 } },
    });
  });
  test("@map-[&.test.nested]/fontSize:text-base", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { lineHeight: 21, test: { nested: 14 } } },
    });
  });
});
