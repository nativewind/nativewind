import { TextStyle } from "react-native";
import {
  createTestAppearance,
  createTestDimensions,
  TestStyleSheetStore,
} from "./utils";

describe("StyleSheetStore", () => {
  test("can retrieve a style", () => {
    const style = { color: "black" };
    const store = new TestStyleSheetStore({
      styles: {
        "text-black": style,
      },
    });

    expect(store.getTestStyle("text-black")).toEqual([style]);
  });

  test("can retrieve a multiple style", () => {
    const textStyle: TextStyle = { color: "black" };
    const fontStyle: TextStyle = { fontWeight: "400" };

    const store = new TestStyleSheetStore({
      styles: {
        "text-black": textStyle,
        "font-400": fontStyle,
      },
    });

    expect(store.getTestStyle("text-black font-400")).toEqual([
      textStyle,
      fontStyle,
    ]);
  });

  test("retrieving the same style will keep the same identity", () => {
    const store = new TestStyleSheetStore({
      styles: {
        "text-black": { color: "black" },
      },
    });

    expect(store.getStyle("text-black")).toBe(store.getStyle("text-black"));
  });

  test("can match atRules", () => {
    const store = new TestStyleSheetStore({
      styles: {
        "hover_text-black.0": { color: "black" },
      },
      atRules: {
        "hover_text-black": [[["pseudo-class", "hover"]]],
      },
    });

    expect(store.getTestStyle("hover:text-black")).toEqual([]);
    expect(store.getTestStyle("hover:text-black", { hover: true })).toEqual([
      { color: "black" },
    ]);
  });

  test("can react to changes in atRules", () => {
    const appearance = createTestAppearance();

    const store = new TestStyleSheetStore({
      styles: {
        "dark_text-black.0": { color: "black" },
      },
      atRules: {
        "dark_text-black": [[["media", "(prefers-color-scheme: dark)"]]],
      },
      appearance,
    });

    expect(store.getTestStyle("dark:text-black")).toEqual([]);
    appearance.change({ colorScheme: "dark" });
    expect(store.getTestStyle("dark:text-black")).toEqual([{ color: "black" }]);
    appearance.change({ colorScheme: "light" });
    expect(store.getTestStyle("dark:text-black")).toEqual([]);
  });

  test("will only update the atRules styles", () => {
    const staticText = { color: "white" };
    const atRuleText = { color: "black" };

    const appearance = createTestAppearance();

    const store = new TestStyleSheetStore({
      styles: {
        "text-white": staticText,
        "dark_text-black.0": atRuleText,
      },
      atRules: {
        "dark_text-black": [[["media", "(prefers-color-scheme: dark)"]]],
      },
      appearance,
    });

    expect(store.getTestStyle("text-white dark:text-black")).toEqual([
      staticText,
    ]);

    appearance.change({ colorScheme: "dark" });

    expect(store.getTestStyle("text-white dark:text-black")).toEqual([
      staticText,
      atRuleText,
    ]);
  });

  test("works with atomic styles which are a mix of static and dynamic values", () => {
    const dimensions = createTestDimensions();

    const styles = {
      container: {
        width: "100%",
      },
      "container.0": {
        maxWidth: 640,
      },
      "container.1": {
        maxWidth: 768,
      },
    };

    const store = new TestStyleSheetStore({
      styles,
      atRules: {
        container: [
          [["media", "(min-width: 640px)"]],
          [["media", "(min-width: 768px)"]],
        ],
      },
      dimensions,
    });

    expect(store.getTestStyle("container")).toEqual([
      styles["container"],
      styles["container.0"],
    ]);

    dimensions.change({
      window: {
        fontScale: 2,
        height: 1334,
        scale: 2,
        width: 800,
      },
      screen: {
        fontScale: 2,
        height: 1334,
        scale: 2,
        width: 800,
      },
    });

    expect(store.getStyle("container")).toBe(store.getStyle("container"));

    expect(store.getTestStyle("container")).toEqual([
      styles["container"],
      styles["container.0"],
      styles["container.1"],
    ]);
  });

  test("works with children styles", () => {
    const store = new TestStyleSheetStore({
      styles: {
        "divide-solid.0": {
          borderStyle: "solid",
        },
      },
      atRules: {
        "divide-solid": [[["selector", "(> *:not(:first-child))"]]],
      },
    });

    const parent = store.getStyle("divide-solid");
    const child1 = store.getChildStyles(parent, { nthChild: 1 });
    const child2 = store.getChildStyles(parent, { nthChild: 2 });

    expect(child1).toEqual(undefined);
    expect(child2).toEqual([{ borderStyle: "solid" }]);
  });

  test("works with children styles and atRules", () => {
    const store = new TestStyleSheetStore({
      styles: {
        "hover_divide-solid.0": {
          borderStyle: "solid",
        },
      },
      atRules: {
        "hover_divide-solid": [
          [
            ["pseudo-class", "hover"],
            ["selector", "(> *:not(:first-child))"],
          ],
        ],
      },
    });

    const parent1 = store.getStyle("hover:divide-solid");
    expect(parent1.childStyles).toBeFalsy();

    const parent2 = store.getStyle("hover:divide-solid", { hover: true });
    const child1 = store.getChildStyles(parent2, { nthChild: 1 });
    const child2 = store.getChildStyles(parent2, { nthChild: 2 });

    expect(child1).toEqual(undefined);
    expect(child2).toEqual([{ borderStyle: "solid" }]);
  });
});
