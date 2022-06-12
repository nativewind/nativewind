import { TestStyleSheetStore } from "./utils";

describe("StyleSheetStore - preprocessed", () => {
  test("can retrieve a style", () => {
    const store = new TestStyleSheetStore({
      preprocessed: true,
    });

    const styles = store.getTestStyle("text-black");
    expect(styles).toEqual([{ $$css: true, "text-black": "text-black" }]);
  });

  test("can retrieve multiple styles", () => {
    const store = new TestStyleSheetStore({
      preprocessed: true,
    });

    expect(store.getTestStyle("text-black font-bold")).toEqual([
      { $$css: true, "text-black font-bold": "text-black font-bold" },
    ]);
  });

  test("retrieving the same style will keep the same identity", () => {
    const store = new TestStyleSheetStore({
      preprocessed: true,
    });

    expect(store.getStyle("text-black")).toBe(store.getStyle("text-black"));
  });
});
