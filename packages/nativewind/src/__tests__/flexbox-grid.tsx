import { resetStyles } from "react-native-css-interop/testing-library";
import { invalidProperty, invalidValue, style, testCases } from "../test-utils";

afterEach(() => resetStyles());

describe("Flexbox & Grid - Flex Basis", () => {
  testCases(
    ["basis-auto", invalidValue("flex-basis", "auto")],
    ["basis-0", style({ flexBasis: 0 })],
    ["basis-1", style({ flexBasis: 3.5 })],
    ["basis-px", style({ flexBasis: 1 })],
    ["basis-full", style({ flexBasis: "100%" })],
    ["basis-1/2", style({ flexBasis: "50%" })],
  );
});

describe("Flexbox & Grid - Flex Direction", () => {
  testCases(
    ["flex-row", style({ flexDirection: "row" })],
    ["flex-col", style({ flexDirection: "column" })],
    ["flex-row-reverse", style({ flexDirection: "row-reverse" })],
    ["flex-col-reverse", style({ flexDirection: "column-reverse" })],
  );
});

describe("Flexbox & Grid - Flex Wrap", () => {
  testCases(
    ["flex-wrap", style({ flexWrap: "wrap" })],
    ["flex-nowrap", style({ flexWrap: "nowrap" })],
    ["flex-wrap-reverse", style({ flexWrap: "wrap-reverse" })],
  );
});

describe("Flexbox & Grid - Flex", () => {
  testCases(
    ["flex", style({ display: "flex" })],
    ["flex-1", style({ flexBasis: "0%", flexGrow: 1, flexShrink: 1 })],
    [
      "flex-auto",
      {
        ...style({ flexGrow: 1, flexShrink: 1 }),
        ...invalidValue("flex", "auto"),
      },
    ],
    [
      "flex-initial",
      {
        ...style({ flexGrow: 0, flexShrink: 1 }),
        ...invalidValue("flex", "auto"),
      },
    ],
    [
      "flex-none",
      {
        ...style({ flexGrow: 0, flexShrink: 0 }),
        ...invalidValue("flex", "auto"),
      },
    ],
  );
});

describe("Flexbox & Grid - Flex Grow", () => {
  testCases(
    ["grow", style({ flexGrow: 1 })],
    ["grow-0", style({ flexGrow: 0 })],
    ["grow-[2]", style({ flexGrow: 2 })],
  );
});

describe("Flexbox & Grid - Flex Shrink", () => {
  testCases(
    ["shrink", style({ flexShrink: 1 })],
    ["shrink-0", style({ flexShrink: 0 })],
  );
});

describe("Flexbox & Grid - Order", () => {
  testCases(
    ["order-1", invalidProperty("order")],
    ["order-first", invalidProperty("order")],
    ["order-last", invalidProperty("order")],
    ["order-none", invalidProperty("order")],
  );
});

describe("Flexbox & Grid - Grid Template Columns", () => {
  testCases(
    ["grid-cols-1", invalidProperty("grid-template-columns")],
    ["grid-cols-2", invalidProperty("grid-template-columns")],
    ["grid-cols-none", invalidProperty("grid-template-columns")],
    [
      "grid-cols-[200px_minmax(900px,_1fr)_100px]",
      invalidProperty("grid-template-columns"),
    ],
  );
});

describe("Flexbox & Grid - Grid Column Start / End", () => {
  testCases(
    ["col-auto", invalidProperty("grid-column")],
    ["col-span-1", invalidProperty("grid-column")],
    ["col-span-full", invalidProperty("grid-column")],
    ["col-start-1", invalidProperty("grid-column-start")],
    ["col-start-auto", invalidProperty("grid-column-start")],
    ["col-end-1", invalidProperty("grid-column-end")],
    ["col-end-auto", invalidProperty("grid-column-end")],
  );
});

describe("Flexbox & Grid - Grid Template Rows", () => {
  testCases(
    ["grid-rows-1", invalidProperty("grid-template-rows")],
    ["grid-rows-2", invalidProperty("grid-template-rows")],
    ["grid-rows-none", invalidProperty("grid-template-rows")],
    [
      "grid-rows-[200px_minmax(900px,_1fr)_100px]",
      invalidProperty("grid-template-rows"),
    ],
  );
});

describe("Flexbox & Grid - Grid Row Start / End", () => {
  testCases(
    ["row-auto", invalidProperty("grid-row")],
    ["row-span-1", invalidProperty("grid-row")],
    ["row-span-full", invalidProperty("grid-row")],
    ["row-start-1", invalidProperty("grid-row-start")],
    ["row-start-auto", invalidProperty("grid-row-start")],
    ["row-end-1", invalidProperty("grid-row-end")],
    ["row-end-auto", invalidProperty("grid-row-end")],
  );
});

describe("Flexbox & Grid - Grid Auto Flow", () => {
  testCases(
    ["grid-flow-row", invalidProperty("grid-auto-flow")],
    ["grid-flow-col", invalidProperty("grid-auto-flow")],
    ["grid-flow-row-dense", invalidProperty("grid-auto-flow")],
    ["grid-flow-col-dense", invalidProperty("grid-auto-flow")],
  );
});

describe("Flexbox & Grid - Grid Auto Columns", () => {
  testCases(
    ["auto-cols-auto", invalidProperty("grid-auto-columns")],
    ["auto-cols-min", invalidProperty("grid-auto-columns")],
    ["auto-cols-max", invalidProperty("grid-auto-columns")],
    ["auto-cols-fr", invalidProperty("grid-auto-columns")],
  );
});

describe("Flexbox & Grid - Grid Auto Rows", () => {
  testCases(
    ["auto-rows-auto", invalidProperty("grid-auto-rows")],
    ["auto-rows-min", invalidProperty("grid-auto-rows")],
    ["auto-rows-max", invalidProperty("grid-auto-rows")],
    ["auto-rows-fr", invalidProperty("grid-auto-rows")],
  );
});

describe("Flexbox & Grid - Gap", () => {
  testCases(
    ["gap-0", style({ columnGap: 0, rowGap: 0 })],
    ["gap-1", style({ columnGap: 3.5, rowGap: 3.5 })],
    ["gap-px", style({ columnGap: 1, rowGap: 1 })],
    ["gap-x-1", style({ columnGap: 3.5 })],
    ["gap-y-1", style({ rowGap: 3.5 })],
  );
});

describe("Flexbox & Grid - Justify Content", () => {
  testCases(
    ["justify-start", style({ justifyContent: "flex-start" })],
    ["justify-end", style({ justifyContent: "flex-end" })],
    ["justify-center", style({ justifyContent: "center" })],
    ["justify-between", style({ justifyContent: "space-between" })],
    ["justify-around", style({ justifyContent: "space-around" })],
    ["justify-evenly", style({ justifyContent: "space-evenly" })],
  );
});

describe("Flexbox & Grid - Justify Items", () => {
  testCases(
    ["justify-items-start", invalidProperty("justify-items")],
    ["justify-items-end", invalidProperty("justify-items")],
    ["justify-items-center", invalidProperty("justify-items")],
    ["justify-items-stretch", invalidProperty("justify-items")],
  );
});

describe("Flexbox & Grid - Justify Self", () => {
  testCases(
    ["justify-self-auto", invalidProperty("justify-self")],
    ["justify-self-start", invalidProperty("justify-self")],
    ["justify-self-end", invalidProperty("justify-self")],
    ["justify-self-center", invalidProperty("justify-self")],
    ["justify-self-stretch", invalidProperty("justify-self")],
  );
});

describe("Flexbox & Grid - Align Items", () => {
  testCases(
    ["items-center", style({ alignItems: "center" })],
    ["items-start", style({ alignItems: "flex-start" })],
    ["items-end", style({ alignItems: "flex-end" })],
    ["items-baseline", style({ alignItems: "baseline" })],
    ["items-stretch", style({ alignItems: "stretch" })],
  );
});

describe("Flexbox & Grid - Align Self", () => {
  testCases(
    ["self-auto", style({ alignSelf: "auto" })],
    ["self-start", style({ alignSelf: "flex-start" })],
    ["self-end", style({ alignSelf: "flex-end" })],
    ["self-center", style({ alignSelf: "center" })],
    ["self-stretch", style({ alignSelf: "stretch" })],
    ["self-baseline", style({ alignSelf: "baseline" })],
  );
});

describe("Flexbox & Grid - Align Content", () => {
  testCases(
    ["content-center", style({ alignContent: "center" })],
    ["content-start", style({ alignContent: "flex-start" })],
    ["content-end", style({ alignContent: "flex-end" })],
    ["content-between", style({ alignContent: "space-between" })],
    ["content-around", style({ alignContent: "space-around" })],
    ["content-evenly", invalidValue("align-content", "space-evenly")],
  );
});

describe("Flexbox & Grid - Place Items", () => {
  testCases(
    ["place-items-start", invalidProperty("place-items")],
    ["place-items-end", invalidProperty("place-items")],
    ["place-items-center", invalidProperty("place-items")],
    ["place-items-stretch", invalidProperty("place-items")],
  );
});

describe("Flexbox & Grid - Place Self", () => {
  testCases(
    ["place-self-auto", invalidProperty("place-self")],
    ["place-self-start", invalidProperty("place-self")],
    ["place-self-end", invalidProperty("place-self")],
    ["place-self-center", invalidProperty("place-self")],
    ["place-self-stretch", invalidProperty("place-self")],
  );
});
