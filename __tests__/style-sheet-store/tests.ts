import {
  Appearance,
  ColorSchemeName,
  Dimensions,
  ScaledSize,
} from "react-native";
import { StateBitOptions } from "../../src/shared/selector";

import { StyleSheetStore } from "../../src/style-sheet-store";

export class TestStyleSheetStore extends StyleSheetStore {
  // Helper to easily retrieve a style from the latest snapshot
  getStyle(className: string, options?: StateBitOptions) {
    const selector = this.prepare(className, options);
    return this.getSnapshot()[selector];
  }

  // Remove the extra meta-data properties from StyleArray, allows you to compare
  // the results with toEqual
  //
  // Note: If you want check the stability of results, you need to use getStyle()
  getTestStyle(className: string, options?: StateBitOptions) {
    return [...this.getStyle(className, options)];
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
