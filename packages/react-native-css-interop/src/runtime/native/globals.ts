import { createContext, useContext } from "react";
import {
  AccessibilityInfo,
  AppState,
  Appearance,
  Dimensions,
} from "react-native";
import { Signal, createSignal, useComputed } from "../signals";
import { INTERNAL_RESET, INTERNAL_SET, STYLE_SCOPES } from "../../shared";
import {
  StyleProp,
  ContainerRuntime,
  RuntimeValueDescriptor,
  GroupedRuntimeStyle,
  ExtractedAnimation,
  ExtractionWarning,
} from "../../types";
import { InteropStore } from "./style";

export const styleSignals = new Map<string, Signal<GroupedRuntimeStyle>>();
export const opaqueStyles = new WeakMap<object, GroupedRuntimeStyle>();
export const animationMap = new Map<string, ExtractedAnimation>();

export const globalClassNameCache = new Map<string, InteropStore>();
export const globalInlineCache = new WeakMap<object, InteropStore>();

export const warnings = new Map<string, ExtractionWarning[]>();
export const warned = new Set<string>();

export const globalVariables = {
  root: new Map<string, ColorSchemeSignal>(),
  universal: new Map<string, ColorSchemeSignal>(),
};

export const ContainerContext = createContext<Record<string, ContainerRuntime>>(
  {},
);

const rootContext = {
  inlineVariables: globalVariables.root,
  getContainer() {},
  getVariable(name: string) {
    return globalVariables.root.get(name)?.get();
  },
} as unknown as InteropStore;
export const interopContext = createContext(rootContext);
export const InteropProvider = interopContext.Provider;

export const rem = createColorSchemeSignal("rem");
export const vw = viewportUnit("width", Dimensions);
export const vh = viewportUnit("height", Dimensions);
function viewportUnit(key: "width" | "height", dimensions: Dimensions) {
  const signal = createSignal<number>(dimensions.get("window")[key] || 0);

  let subscription = dimensions.addEventListener("change", ({ window }) => {
    signal.set(window[key]);
  });

  const get = () => signal.get() || 0;
  const reset = (dimensions: Dimensions) => {
    signal.set(dimensions.get("window")[key] || 0);
    subscription.remove();
    subscription = dimensions.addEventListener("change", ({ window }) => {
      signal.set(window[key]);
    });
  };

  return { get, [INTERNAL_RESET]: reset, [INTERNAL_SET]: signal.set };
}

export const isReduceMotionEnabled = (function createIsReduceMotionEnabled() {
  const signal = createSignal(false);
  // Hopefully this resolves before the first paint...
  AccessibilityInfo.isReduceMotionEnabled()?.then(signal.set);
  AccessibilityInfo.addEventListener("reduceMotionChanged", signal.set);

  return { ...signal, [INTERNAL_RESET]: () => signal.set(false) };
})();

export type ColorSchemeSignal = ReturnType<typeof createColorSchemeSignal>;

/**
 * A special signal that can be used to set a value for both light and dark color schemes.
 * Currently only used for root and universal variables.
 */
export function createColorSchemeSignal(id: string) {
  let light = createSignal<any>(undefined, `${id}#light`);
  let dark = createSignal<any>(undefined, `${id}#dark`);

  const get = () => {
    return colorScheme.get() === "light"
      ? light.get()
      : dark.get() ?? light.get();
  };

  const peek = () => {
    return colorScheme.peek() === "light"
      ? light.peek()
      : dark.peek() ?? light.peek();
  };

  const unsubscribe = (subscription: () => void) => {
    dark.unsubscribe(subscription);
    light.unsubscribe(subscription);
  };

  const set = (value: Record<string, any> | any) => {
    if (typeof value === "object") {
      if ("dark" in value) dark.set(value.dark);
      if ("light" in value) light.set(value.light);
    } else {
      light.set(value);
      dark.set(value);
    }
  };

  return {
    id,
    get,
    set,
    peek,
    unsubscribe,
  };
}

let appearance = Appearance;

let appearanceListener = appearance.addChangeListener((state) =>
  _appColorScheme.set(state.colorScheme ?? "light"),
);

AppState.addEventListener("change", () =>
  _appColorScheme.set(appearance.getColorScheme() ?? "light"),
);

const _appColorScheme = createSignal<"light" | "dark" | "system">("system");
export const colorScheme = {
  ..._appColorScheme,
  set(value: "light" | "dark" | "system") {
    _appColorScheme.set(value);
    if (value === "system") {
      appearance.setColorScheme(null);
    } else {
      appearance.setColorScheme(value);
    }
  },
  get() {
    let current = _appColorScheme.get();
    if (current === "system") current = appearance.getColorScheme() ?? "light";
    return current;
  },
  toggle() {
    let current = _appColorScheme.peek();
    if (current === "system") current = appearance.getColorScheme() ?? "light";
    _appColorScheme.set(current === "light" ? "dark" : "light");
  },
  [INTERNAL_RESET]: ($appearance: typeof Appearance) => {
    _appColorScheme.set("system");
    appearance = $appearance;
    appearanceListener.remove();
    appearanceListener = appearance.addChangeListener((state) =>
      _appColorScheme.set(state.colorScheme ?? "light"),
    );
  },
};

export function useColorScheme() {
  return useComputed(() => ({
    colorScheme: colorScheme.get(),
    setColorScheme: colorScheme.set,
    toggleColorScheme: colorScheme.toggle,
  }));
}

export function vars(variables: Record<string, RuntimeValueDescriptor>) {
  const style: StyleProp = {};
  opaqueStyles.set(style, {
    scope: STYLE_SCOPES.SELF,
    1: [
      {
        $$type: "runtime",
        scope: STYLE_SCOPES.SELF,
        variables: Object.entries(variables).map(([name, value]) => {
          return [name.startsWith("--") ? name : `--${name}`, value];
        }),
        specificity: {
          A: 0,
          B: 0,
          C: 0,
          I: 0,
          O: 0,
          S: 0,
          inline: 1,
        },
      },
    ],
  });
  return style;
}

export const useUnstableNativeVariable = (name: string) => {
  const state = useContext(interopContext);
  return useComputed(() => state.getVariable(name), state);
};
