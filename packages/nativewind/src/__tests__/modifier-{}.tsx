import { renderCurrentTest } from "../test";

describe("{}/<props>:", () => {
  test("{}/test:color-black", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { test: "#000000" },
    });
  });
  test("{}/test.nested:color-black", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { test: { nested: "#000000" } },
    });
  });
  test("{}/&test:color-black", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { test: "#000000" } },
    });
  });
  test("{}/&test.nested:color-black", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { test: { nested: "#000000" } } },
    });
  });
});

// {}-[prop] is an alias for {}/<prop>:
describe("{}-[prop]:", () => {
  test("{}-[test]:color-black", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { test: "#000000" },
    });
  });
  test("{}-[test.nested]:color-black", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { test: { nested: "#000000" } },
    });
  });
  test("{}-[&test]:color-black", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { test: "#000000" } },
    });
  });
  test("{}-[&test.nested]:color-black", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { test: { nested: "#000000" } } },
    });
  });
});

describe("{}-[props]/<attributes>:", () => {
  test("{}-[test]/fontSize:text-base", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { test: 14, style: { lineHeight: 21 } },
    });
  });
  test("{}-[test.nested]/fontSize:text-base", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { test: { nested: 14 }, style: { lineHeight: 21 } },
    });
  });
  test("{}-[&test]/fontSize:text-base", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { lineHeight: 21, test: 14 } },
    });
  });
  test("{}-[&test.nested]/fontSize:text-base", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { lineHeight: 21, test: { nested: 14 } } },
    });
  });
});
