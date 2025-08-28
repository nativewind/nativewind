import { renderCurrentTest } from "../test-utils";

describe("@prop/<props>:", () => {
  test("@prop/test:color-black", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { test: "#000", style: {} },
    });
  });
  test("@prop/test.nested:color-black", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { test: { nested: "#000" }, style: {} },
    });
  });
  test("@prop/&test:color-black", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { test: "#000000" } },
    });
  });
  test("@prop/&test.nested:color-black", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { test: { nested: "#000000" } } },
    });
  });
});

// @prop-[prop] is an alias for @prop/<prop>:
describe("@prop-[prop]:", () => {
  test("@prop-[test]:color-black", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { test: "#000000" },
    });
  });
  test("@prop-[test.nested]:color-black", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { test: { nested: "#000000" } },
    });
  });
  test("@prop-[&test]:color-black", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { test: "#000000" } },
    });
  });
  test("@prop-[&test.nested]:color-black", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { test: { nested: "#000000" } } },
    });
  });
});

describe("@prop-[props]/<attributes>:", () => {
  test("@prop-[test]/fontSize:text-base", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { test: 14, style: { lineHeight: 21 } },
    });
  });
  test("@prop-[test.nested]/fontSize:text-base", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { test: { nested: 14 }, style: { lineHeight: 21 } },
    });
  });
  test("@prop-[&test]/fontSize:text-base", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { lineHeight: 21, test: 14 } },
    });
  });
  test("@prop-[&test.nested]/fontSize:text-base", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { lineHeight: 21, test: { nested: 14 } } },
    });
  });
});
