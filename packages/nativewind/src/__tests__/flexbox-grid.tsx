import { renderCurrentTest } from "../test";

describe("Flexbox & Grid - Flex Basis", () => {
  test("basis-auto", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { style: { "flex-basis": "auto" } },
    });
  });
  test("basis-0", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { flexBasis: 0 } },
    });
  });
  test("basis-1", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { flexBasis: 3.5 } },
    });
  });
  test("basis-px", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { flexBasis: 1 } },
    });
  });
  test("basis-full", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { flexBasis: "100%" } },
    });
  });
  test("basis-1/2", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { flexBasis: "50%" } },
    });
  });
});

describe("Flexbox & Grid - Flex Direction", () => {
  test("flex-row", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { flexDirection: "row" } },
    });
  });
  test("flex-col", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { flexDirection: "column" } },
    });
  });
  test("flex-row-reverse", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { flexDirection: "row-reverse" } },
    });
  });
  test("flex-col-reverse", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { flexDirection: "column-reverse" } },
    });
  });
});

describe("Flexbox & Grid - Flex Wrap", () => {
  test("flex-wrap", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { flexWrap: "wrap" } },
    });
  });
  test("flex-nowrap", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { flexWrap: "nowrap" } },
    });
  });
  test("flex-wrap-reverse", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { flexWrap: "wrap-reverse" } },
    });
  });
});

describe("Flexbox & Grid - Flex", () => {
  test("flex", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { display: "flex" } },
    });
  });
  test("flex-1", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { flexBasis: "0%", flexGrow: 1, flexShrink: 1 } },
    });
  });
  test("flex-auto", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { flexGrow: 1, flexShrink: 1 } },
      invalid: { style: { flex: "auto" } },
    });
  });
  test("flex-initial", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { flexGrow: 0, flexShrink: 1 } },
      invalid: { style: { flex: "auto" } },
    });
  });
  test("flex-none", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { flexGrow: 0, flexShrink: 0 } },
      invalid: { style: { flex: "auto" } },
    });
  });
});

describe("Flexbox & Grid - Flex Grow", () => {
  test("grow", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { flexGrow: 1 } },
    });
  });
  test("grow-0", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { flexGrow: 0 } },
    });
  });
  test("grow-[2]", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { flexGrow: 2 } },
    });
  });
});

describe("Flexbox & Grid - Flex Shrink", () => {
  test("shrink", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { flexShrink: 1 } },
    });
  });
  test("shrink-0", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { flexShrink: 0 } },
    });
  });
});

describe("Flexbox & Grid - Order", () => {
  test("order-1", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["order"] },
    });
  });
  test("order-first", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["order"] },
    });
  });
  test("order-last", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["order"] },
    });
  });
  test("order-none", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["order"] },
    });
  });
});

describe("Flexbox & Grid - Grid Template Columns", () => {
  test("grid-cols-1", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["grid-template-columns"] },
    });
  });
  test("grid-cols-2", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["grid-template-columns"] },
    });
  });
  test("grid-cols-none", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["grid-template-columns"] },
    });
  });
  test("grid-cols-[200px_minmax(900px,_1fr)_100px]", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["grid-template-columns"] },
    });
  });
});

describe("Flexbox & Grid - Grid Column Start / End", () => {
  test("col-auto", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["grid-column"] },
    });
  });
  test("col-span-1", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["grid-column"] },
    });
  });
  test("col-span-full", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["grid-column"] },
    });
  });
  test("col-start-1", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["grid-column-start"] },
    });
  });
  test("col-start-auto", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["grid-column-start"] },
    });
  });
  test("col-end-1", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["grid-column-end"] },
    });
  });
  test("col-end-auto", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["grid-column-end"] },
    });
  });
});

describe("Flexbox & Grid - Grid Template Rows", () => {
  test("grid-rows-1", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["grid-template-rows"] },
    });
  });
  test("grid-rows-2", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["grid-template-rows"] },
    });
  });
  test("grid-rows-none", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["grid-template-rows"] },
    });
  });
  test("grid-rows-[200px_minmax(900px,_1fr)_100px]", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["grid-template-rows"] },
    });
  });
});

describe("Flexbox & Grid - Grid Row Start / End", () => {
  test("row-auto", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["grid-row"] },
    });
  });
  test("row-span-1", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["grid-row"] },
    });
  });
  test("row-span-full", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["grid-row"] },
    });
  });
  test("row-start-1", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["grid-row-start"] },
    });
  });
  test("row-start-auto", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["grid-row-start"] },
    });
  });
  test("row-end-1", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["grid-row-end"] },
    });
  });
  test("row-end-auto", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["grid-row-end"] },
    });
  });
});

describe("Flexbox & Grid - Grid Auto Flow", () => {
  test("grid-flow-row", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["grid-auto-flow"] },
    });
  });
  test("grid-flow-col", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["grid-auto-flow"] },
    });
  });
  test("grid-flow-row-dense", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["grid-auto-flow"] },
    });
  });
  test("grid-flow-col-dense", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["grid-auto-flow"] },
    });
  });
});

describe("Flexbox & Grid - Grid Auto Columns", () => {
  test("auto-cols-auto", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["grid-auto-columns"] },
    });
  });
  test("auto-cols-min", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["grid-auto-columns"] },
    });
  });
  test("auto-cols-max", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["grid-auto-columns"] },
    });
  });
  test("auto-cols-fr", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["grid-auto-columns"] },
    });
  });
});

describe("Flexbox & Grid - Grid Auto Rows", () => {
  test("auto-rows-auto", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["grid-auto-rows"] },
    });
  });
  test("auto-rows-min", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["grid-auto-rows"] },
    });
  });
  test("auto-rows-max", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["grid-auto-rows"] },
    });
  });
  test("auto-rows-fr", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["grid-auto-rows"] },
    });
  });
});

describe("Flexbox & Grid - Gap", () => {
  test("gap-0", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { columnGap: 0, rowGap: 0 } },
    });
  });
  test("gap-1", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { columnGap: 3.5, rowGap: 3.5 } },
    });
  });
  test("gap-px", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { columnGap: 1, rowGap: 1 } },
    });
  });
  test("gap-x-1", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { columnGap: 3.5 } },
    });
  });
  test("gap-y-1", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { rowGap: 3.5 } },
    });
  });
});

describe("Flexbox & Grid - Justify Content", () => {
  test("justify-start", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { justifyContent: "flex-start" } },
    });
  });
  test("justify-end", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { justifyContent: "flex-end" } },
    });
  });
  test("justify-center", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { justifyContent: "center" } },
    });
  });
  test("justify-between", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { justifyContent: "space-between" } },
    });
  });
  test("justify-around", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { justifyContent: "space-around" } },
    });
  });
  test("justify-evenly", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { justifyContent: "space-evenly" } },
    });
  });
});

describe("Flexbox & Grid - Justify Items", () => {
  test("justify-items-start", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["justify-items"] },
    });
  });
  test("justify-items-end", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["justify-items"] },
    });
  });
  test("justify-items-center", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["justify-items"] },
    });
  });
  test("justify-items-stretch", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["justify-items"] },
    });
  });
});

describe("Flexbox & Grid - Justify Self", () => {
  test("justify-self-auto", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["justify-self"] },
    });
  });
  test("justify-self-start", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["justify-self"] },
    });
  });
  test("justify-self-end", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["justify-self"] },
    });
  });
  test("justify-self-center", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["justify-self"] },
    });
  });
  test("justify-self-stretch", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["justify-self"] },
    });
  });
});

describe("Flexbox & Grid - Align Items", () => {
  test("items-center", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { alignItems: "center" } },
    });
  });
  test("items-start", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { alignItems: "flex-start" } },
    });
  });
  test("items-end", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { alignItems: "flex-end" } },
    });
  });
  test("items-baseline", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { alignItems: "baseline" } },
    });
  });
  test("items-stretch", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { alignItems: "stretch" } },
    });
  });
});

describe("Flexbox & Grid - Align Self", () => {
  test("self-auto", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { alignSelf: "auto" } },
    });
  });
  test("self-start", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { alignSelf: "flex-start" } },
    });
  });
  test("self-end", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { alignSelf: "flex-end" } },
    });
  });
  test("self-center", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { alignSelf: "center" } },
    });
  });
  test("self-stretch", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { alignSelf: "stretch" } },
    });
  });
  test("self-baseline", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { alignSelf: "baseline" } },
    });
  });
});

describe("Flexbox & Grid - Align Content", () => {
  test("content-center", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { alignContent: "center" } },
    });
  });
  test("content-start", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { alignContent: "flex-start" } },
    });
  });
  test("content-end", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { alignContent: "flex-end" } },
    });
  });
  test("content-between", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { alignContent: "space-between" } },
    });
  });
  test("content-around", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { alignContent: "space-around" } },
    });
  });
  test("content-evenly", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: {
        style: {
          "align-content": "space-evenly",
        },
      },
    });
  });
});

describe("Flexbox & Grid - Place Items", () => {
  test("place-items-start", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["place-items"] },
    });
  });
  test("place-items-end", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["place-items"] },
    });
  });
  test("place-items-center", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["place-items"] },
    });
  });
  test("place-items-stretch", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["place-items"] },
    });
  });
});

describe("Flexbox & Grid - Place Self", () => {
  test("place-self-auto", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["place-self"] },
    });
  });
  test("place-self-start", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["place-self"] },
    });
  });
  test("place-self-end", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["place-self"] },
    });
  });
  test("place-self-center", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["place-self"] },
    });
  });
  test("place-self-stretch", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["place-self"] },
    });
  });
});
