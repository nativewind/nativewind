// import { Dimensions } from "react-native";
import { renderHook, act } from "@testing-library/react-hooks";
import { NativeWindStyleSheet } from "../src";
import { extractStyles } from "../src/postcss/extract";
import nativePreset from "../src/tailwind";

afterEach(() => {
  NativeWindStyleSheet.reset();
  jest.clearAllMocks();
});

const { useSync } = NativeWindStyleSheet;

function create(className: string) {
  return NativeWindStyleSheet.create(
    extractStyles({
      content: [],
      safelist: [className],
      presets: [nativePreset],
    })
  );
}

test("useSync is stable", () => {
  create("text-black font-400");

  const { result } = renderHook(() => useSync("text-black font-400"));

  const firstResult = result.current;
  act(() => {
    return;
  });
  const secondResult = result.current;

  expect(firstResult.childClasses).toBeUndefined();
  expect(firstResult.styles).toEqual([
    { color: "black" },
    { fontWeight: "400" },
  ]);

  expect(firstResult.styles).toBe(secondResult.styles);
  expect(firstResult.childClasses).toBe(secondResult.childClasses);
});

test("styles change when atoms change", () => {
  NativeWindStyleSheet.create({
    "text-custom": {
      styles: [
        {
          color: "custom",
        },
      ],
    },
  });

  const { result } = renderHook(() => useSync("text-custom"));

  const firstResult = result.current;

  expect(firstResult.childClasses).toBeUndefined();
  expect(firstResult.styles).toEqual([{ color: "custom" }]);

  act(() => {
    NativeWindStyleSheet.create({
      "text-custom": {
        styles: [
          {
            color: "custom2",
          },
        ],
      },
    });
  });

  const secondResult = result.current;

  expect(firstResult.styles).not.toBe(secondResult.styles);
  expect(firstResult.childClasses).toBe(secondResult.childClasses);

  expect(secondResult.childClasses).toBeUndefined();
  expect(secondResult.styles).toEqual([{ color: "custom2" }]);
});

test.skip("text-[color:hsl(var(--custom))]", () => {
  NativeWindStyleSheet.setCustomProperties({
    "--custom": "360, 100%, 100%",
  });
  create("text-[color:hsl(var(--custom))]");

  const { result } = renderHook(() =>
    useSync("text-[color:hsl(var(--custom))]")
  );

  expect(result.current.childClasses).toBeUndefined();
  expect(result.current.styles).toEqual([]);

  act(() => NativeWindStyleSheet.setColorScheme("dark"));

  expect(result.current.childClasses).toBeUndefined();
  expect(result.current.styles).toEqual([{ color: "custom" }]);

  act(() => NativeWindStyleSheet.toggleColorScheme());

  expect(result.current.childClasses).toBeUndefined();
  expect(result.current.styles).toEqual([]);
});

// test("dark:text-custom", () => {
//   create({
//     "dark:text-custom": {
//       styles: [
//         {
//           color: "custom",
//         },
//       ],
//       atRules: [[["colorScheme", "dark"]]],
//       topics: ["colorScheme"],
//     },
//   });

//   const { result } = renderHook(() => useSync("dark:text-custom"));

//   expect(result.current.childClasses).toBeUndefined();
//   expect(result.current.styles).toEqual([]);

//   act(() => NativeWindStyleSheet.setColorScheme("dark"));

//   expect(result.current.childClasses).toBeUndefined();
//   expect(result.current.styles).toEqual([{ color: "custom" }]);

//   act(() => NativeWindStyleSheet.toggleColorScheme());

//   expect(result.current.childClasses).toBeUndefined();
//   expect(result.current.styles).toEqual([]);
// });

// test("container", () => {
//   const spy = jest
//     .spyOn(Dimensions, "get")
//     .mockReturnValue({ width: 700, height: 1, scale: 1, fontScale: 1 });

//   create({
//     "text-custom": {
//       styles: [
//         {
//           color: "custom",
//         },
//       ],
//     },
//     container: {
//       styles: [{ width: "100%" }, { maxWidth: 640 }, { maxWidth: 760 }],
//       atRules: [
//         [],
//         [["media", "(min-width: 640px)"]],
//         [["media", "(min-width: 768px)"]],
//       ],
//       topics: ["width"],
//     },
//   });

//   const { result } = renderHook(() => useSync("text-custom container"));

//   expect(result.current.childClasses).toBeUndefined();
//   expect(result.current.styles).toEqual([
//     { color: "custom" },
//     { width: "100%" },
//     { maxWidth: 640 },
//   ]);

//   act(() => {
//     spy.mockReturnValue({ width: 800, height: 1, scale: 1, fontScale: 1 });
//     setDimensions(Dimensions);
//   });

//   expect(result.current.childClasses).toBeUndefined();
//   expect(result.current.styles).toEqual([
//     { color: "custom" },
//     { width: "100%" },
//     { maxWidth: 640 },
//     { maxWidth: 760 },
//   ]);
// });

// test("hover:text-custom", () => {
//   create({
//     "hover:text-custom": {
//       styles: [
//         {
//           color: "custom",
//         },
//       ],
//       conditions: ["hover"],
//     },
//   });

//   const conditions: Record<string, true> = {};

//   const { result, rerender } = renderHook(() => {
//     return useSync("hover:text-custom", conditions);
//   });

//   expect(result.current.childClasses).toBeUndefined();
//   expect(result.current.styles).toBeUndefined();

//   conditions.hover = true;
//   rerender();

//   expect(result.current.childClasses).toBeUndefined();
//   expect(result.current.styles).toEqual([{ color: "custom" }]);
// });

// test("gap-x-2", () => {
//   create({
//     "gap-x-2": {
//       styles: [{ marginLeft: -8 }],
//       childClasses: ["gap-x-2.children"],
//     },
//     "gap-x-2.children": {
//       styles: [{ marginLeft: 8 }],
//       conditions: ["not-first-child"],
//     },
//   });

//   const { result } = renderHook(() => {
//     return useSync("gap-x-2");
//   });

//   expect(result.current.childClasses).toEqual(["gap-x-2.children"]);
//   expect(result.current.styles).toEqual([{ marginLeft: -8 }]);

//   const { result: firstChild } = renderHook(() => {
//     return useSync("gap-x-2.children", {
//       nthChild: 0,
//     });
//   });

//   expect(firstChild.current.childClasses).toBeUndefined();
//   expect(firstChild.current.styles).toBeUndefined();

//   const { result: secondChild } = renderHook(() => {
//     return useSync("gap-x-2.children", {
//       nthChild: 1,
//     });
//   });

//   expect(secondChild.current.childClasses).toBeUndefined();
//   expect(secondChild.current.styles).toEqual([{ marginLeft: 8 }]);
// });

// test("dark:hover:gap-x-2", () => {
//   const className = "dark:hover:gap-x-2";
//   const childClassName = `${className}.children`;

//   create({
//     [className]: {
//       styles: [{ marginLeft: -8 }],
//       childClasses: [childClassName],
//       conditions: ["hover"],
//       topics: ["colorScheme"],
//       atRules: [[["colorScheme", "dark"]]],
//     },
//     [childClassName]: {
//       styles: [{ marginLeft: 8 }],
//       conditions: ["notFirstChild"],
//       topics: ["colorScheme"],
//       atRules: [[["colorScheme", "dark"]]],
//     },
//   });

//   const conditions: Record<string, true> = {};

//   const { result, rerender } = renderHook(() => {
//     return useSync(className, conditions);
//   });

//   const { result: childResult } = renderHook(() => {
//     return useSync(childClassName, {
//       nthChild: 1,
//     });
//   });

//   // No conditions are met, so everything is undefined
//   expect(result.current.childClasses).toBeUndefined();
//   expect(result.current.styles).toBeUndefined();
//   // Child matches its condition, but not the atRules so its just an empty array
//   expect(childResult.current.styles).toEqual([]);

//   conditions.hover = true;
//   rerender();

//   // Hover conditions are met, but because atRules are not met, the styles are empty
//   // This will render styled children, but with no styles
//   expect(result.current.childClasses).toEqual([childClassName]);
//   expect(result.current.styles).toEqual([]);
//   expect(childResult.current.styles).toEqual([]);

//   act(() => NativeWindStyleSheet.setColorScheme("dark"));

//   // Now we have matched both conditions and atRules, so we have styles
//   expect(result.current.childClasses).toEqual([childClassName]);
//   expect(result.current.styles).toEqual([{ marginLeft: -8 }]);
//   expect(childResult.current.styles).toEqual([{ marginLeft: 8 }]);
// });
