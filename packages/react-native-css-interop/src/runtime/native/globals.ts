import { createContext, useContext } from "react";
import {
  AccessibilityInfo,
  AppState,
  Appearance,
  Dimensions,
  NativeEventSubscription,
} from "react-native";
import { Signal, createSignal, useComputed } from "../signals";
import { INTERNAL_RESET, INTERNAL_SET, STYLE_SCOPES } from "../../shared";
import {
  StyleProp,
  RuntimeValueDescriptor,
  GroupedRuntimeStyle,
  ExtractedAnimation,
  ExtractionWarning,
  InteropStore,
  StyleEffectParent,
} from "../../types";

export const styleSignals = new Map<string, Signal<GroupedRuntimeStyle>>();
export const opaqueStyles = new WeakMap<object, GroupedRuntimeStyle>();
export const animationMap = new Map<string, ExtractedAnimation>();

export const globalClassNameCache = new Map<string, InteropStore>();
export const globalInlineCache = new WeakMap<object, InteropStore>();

export const warnings = new Map<string, ExtractionWarning[]>();
export const warned = new Set<string>();

export const externalClassNameCompilerCallback: {
  current?: (className: string) => void;
} = {
  current: undefined,
};

export const globalVariables = {
  root: new Map<string, ColorSchemeSignal>(),
  universal: new Map<string, ColorSchemeSignal>(),
};

export const rootContext = {
  getContainer() {},
  getVariable(name: string) {
    return globalVariables.root.get(name)?.get();
  },
} as unknown as StyleEffectParent;
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
let appearanceListener: NativeEventSubscription | undefined;
let appStateListener: NativeEventSubscription | undefined;

function resetAppearanceListeners(
  $appearance: typeof Appearance,
  appState: typeof AppState,
) {
  appearance = $appearance;
  appearanceListener?.remove();
  appStateListener?.remove();

  appearanceListener = appearance.addChangeListener((state) => {
    if (AppState.currentState === "active") {
      _colorScheme.set(state.colorScheme ?? "light");
    }
  });

  appStateListener = appState.addEventListener("change", (type) => {
    if (type === "active") {
      _colorScheme.set(appearance.getColorScheme() ?? "light");
    }
  });
}
resetAppearanceListeners(appearance, AppState);

const _colorScheme = createSignal<"light" | "dark" | "system">("system");
export const colorScheme = {
  ..._colorScheme,
  set(value: "light" | "dark" | "system") {
    _colorScheme.set(value);
    if (value === "system") {
      appearance.setColorScheme(null);
    } else {
      appearance.setColorScheme(value);
    }
  },
  get() {
    let current = _colorScheme.get();
    if (current === "system") current = appearance.getColorScheme() ?? "light";
    return current;
  },
  toggle() {
    let current = _colorScheme.peek();
    if (current === "system") current = appearance.getColorScheme() ?? "light";
    _colorScheme.set(current === "light" ? "dark" : "light");
  },
  [INTERNAL_RESET]: (appearance: typeof Appearance) => {
    _colorScheme.set("system");
    resetAppearanceListeners(appearance, AppState);
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
