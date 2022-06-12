import {
  Appearance,
  ColorSchemeName,
  Dimensions,
  ScaledSize,
} from "react-native";

import { StyleSheetStore, SelectorOptions } from "../../src/style-sheet-store";

export class TestStyleSheetStore extends StyleSheetStore {
  // Helper to easily retrieve a style from the latest snapshot
  getStyle(classNames: string, options?: SelectorOptions) {
    return this.createSelector(classNames, options)(this.getSnapshot());
  }

  // Remove the extra meta-data properties from StyleArray, allows you to compare
  // the results with toEqual
  //
  // Note: If you want check the stability of results, you need to use getStyle()
  getTestStyle(classNames: string, options?: SelectorOptions) {
    return [...this.createSelector(classNames, options)(this.getSnapshot())];
  }
}

// Hacky mock of Dimensions that the store can subscribe to
// Provides an "change" function to manually update the dimensions
export function createTestDimensions() {
  const dimensions = {
    get() {
      return {
        fontScale: 2,
        height: 1334,
        scale: 2,
        width: 750,
      };
    },
    set() {
      return;
    },
    addEventListener(_: unknown, handler: unknown) {
      this.change = handler;
    },
    removeEventListener() {
      return;
    },
    change: {} as unknown,
    changeWindowDimensions(window: unknown) {
      if (typeof this.change === "function") {
        this.change({ window, screen: window });
      }
    },
  };

  return dimensions as unknown as Dimensions & {
    change: ({
      window,
      screen,
    }: {
      window: ScaledSize;
      screen: ScaledSize;
    }) => void;
  };
}

// Hacky mock of Appearance that the store can subscribe to
// Provides an "change" function to manually update the colorScheme
export function createTestAppearance() {
  return {
    removeChangeListener() {
      return;
    },
    getColorScheme(): ColorSchemeName {
      return "light";
    },
    change: {} as (preferences: Appearance.AppearancePreferences) => void,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    addChangeListener(fn: any) {
      this.change = fn;
      return {
        remove() {
          return;
        },
      };
    },
  };
}
