import {
  Appearance,
  ColorSchemeName,
  Dimensions,
  EmitterSubscription,
  I18nManager,
  OpaqueColorValue,
  PixelRatio,
  Platform,
  PlatformColor,
  PlatformOSType,
  StyleSheet,
} from "react-native";
import { useSyncExternalStoreWithSelector } from "use-sync-external-store/shim/with-selector";

import { AtRuleTuple, Style } from "../types/common";
import themeFunctions from "./theme-functions";

type Listener<T> = (state: T, oldState: T) => void;

export type AtomStyle = {
  [T in keyof Style]: Style[T] | StyleWithFunction;
};

export type StyleWithFunction = {
  function: string;
  values: Array<StyleWithFunction | string | number>;
};

export interface Atom {
  styles?: AtomStyle[];
  atRules?: Record<number, Array<AtRuleTuple>>;
  conditions?: string[];
  customProperties?: string[];
  topics?: string[];
  topicSubscription?: () => void;
  childClasses?: string[];
  meta?: Record<string, true>;
}

const createSetter =
  <T extends Record<string, unknown | undefined>>(
    getRecord: () => T,
    setRecord: (newDate: T) => void,
    listeners: Set<Listener<T>>
  ) =>
  (partialRecord: T | ((value: T) => T) | undefined) => {
    if (!partialRecord) return;
    const oldRecord = { ...getRecord() };
    setRecord(
      typeof partialRecord === "function"
        ? partialRecord(oldRecord)
        : partialRecord
    );

    for (const listener of listeners) listener(getRecord(), oldRecord);
  };

const createSubscriber =
  <T>(listeners: Set<Listener<T>>) =>
  (listener: Listener<T>) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  };

// eslint-disable-next-line unicorn/no-useless-undefined
let dimensionsListener: EmitterSubscription | undefined = undefined;

const atoms: Map<string, Atom> = new Map();
const childClasses: Map<string, string> = new Map();
const styleMeta: Map<string, Record<string, boolean>> = new Map();

let styleSets: Record<string, Style[]> = {};
const styleSetsListeners = new Set<Listener<typeof styleSets>>();
const setStyleSets = createSetter(
  () => styleSets,
  (data) => {
    styleSets = { ...styleSets, ...data };
  },
  styleSetsListeners
);
const subscribeToStyleSets = createSubscriber(styleSetsListeners);

let styles: Record<string, Style[] | undefined> = {};
const styleListeners = new Set<Listener<typeof styles>>();
const setStyles = createSetter(
  () => styles,
  (data) => {
    styles = { ...styles, ...data };
  },
  styleListeners
);
const subscribeToStyles = createSubscriber(styleListeners);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let topicValues: Record<string, string | number> = {};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const topicValueListeners = new Set<Listener<typeof topicValues>>();
const setTopicValues = createSetter(
  () => topicValues,
  (data) => {
    topicValues = { ...topicValues, ...data };
  },
  topicValueListeners
);
const subscribeToTopics = createSubscriber(topicValueListeners);

let isPreprocessed = Platform.select({
  default: false,
  web: typeof StyleSheet.create({ test: {} }).test !== "number",
});

let dangerouslyCompileStyles: (css: string) => void | undefined;

export const NativeWindStyleSheet = {
  ...themeFunctions,
  create,
  warmCache,
  useSync,
  reset: () => {
    atoms.clear();
    childClasses.clear();
    styleSets = {};
    styleSetsListeners.clear();
    styles = {};
    styleListeners.clear();
    topicValues = {
      platform: Platform.OS,
    };
    topicValueListeners.clear();
    setDimensions(Dimensions);
    setColorScheme("system");
    setDirection(I18nManager.isRTL ? "rtl" : "ltr");

    // Add some default atoms. These no do not compile

    atoms.set("group", {
      styles: [],
      meta: {
        group: true,
      },
    });

    atoms.set("group-isolate", {
      styles: [],
      meta: {
        groupIsolate: true,
      },
    });

    atoms.set("parent", {
      styles: [],
      meta: {
        parent: true,
      },
    });
  },
  isPreprocessed: () => isPreprocessed,
  setOutput: (
    specifics: { [platform in PlatformOSType]?: "native" | "css" } & {
      default: "native" | "css";
    }
  ) => (isPreprocessed = Platform.select(specifics) === "css"),
  getColorScheme,
  setColorScheme,
  setDirection,
  toggleColorScheme,
  setCustomProperties,
  setDimensions,
  setDangerouslyCompileStyles: (callback: typeof dangerouslyCompileStyles) =>
    (dangerouslyCompileStyles = callback),
};
NativeWindStyleSheet.reset();

export type CreateOptions = Record<string, Atom>;

function create(options: CreateOptions) {
  if (isPreprocessed) {
    return;
  }

  let newStyles: Record<string, Style[] | undefined> = {};

  for (const [atomName, atom] of Object.entries(options)) {
    if (atom.topics) {
      atom.topicSubscription = subscribeToTopics((values, oldValues) => {
        const topicChanged = atom.topics?.some((topic) => {
          return values[topic] !== oldValues[topic];
        });

        if (!topicChanged) {
          return;
        }

        setStyles(evaluate(atomName, atom));
      });
    }

    // Remove any existing subscriptions
    atoms.get(atomName)?.topicSubscription?.();
    atoms.set(atomName, atom);
    newStyles = { ...newStyles, ...evaluate(atomName, atom) };
  }

  setStyles(newStyles);
}

function evaluate(name: string, atom: Atom) {
  const atomStyles: Style[] = [];
  let newStyles: Record<string, Style[] | undefined> = {
    [name]: atomStyles,
  };

  if (!atom.styles) return;

  for (const [index, originalStyles] of atom.styles.entries()) {
    const styles = { ...originalStyles } as Style;

    for (const [key, value] of Object.entries(styles)) {
      if (typeof value === "object" && "function" in value) {
        (styles as Record<string, unknown>)[key] = resolveFunction(value);
      }
    }

    const atRules = atom.atRules?.[index];

    if (!atRules || atRules.length === 0) {
      atomStyles.push(styles);
      continue;
    }

    const atRulesResult = atRules.every(([rule, params]) => {
      if (rule === "selector") {
        // These atRules shouldn't be on the atomic styles, they only
        // apply to childStyles
        return false;
      } else if (rule === "colorScheme") {
        return topicValues["colorScheme"] === params;
      } else {
        switch (rule) {
          case "platform":
            return params === Platform.OS;
          case "width":
            return params === topicValues["device-width"];
          case "min-width":
            return (params ?? 0) >= topicValues["device-width"];
          case "max-width":
            return (params ?? 0) <= topicValues["device-width"];
          case "height":
            return params === topicValues["device-height"];
          case "min-height":
            return (params ?? 0) >= topicValues["device-height"];
          case "max-height":
            return (params ?? 0) <= topicValues["device-height"];
          default:
            return true;
        }
      }
    });

    if (atRulesResult) {
      // All atRules matches, so add the style
      atomStyles.push(styles);

      // If there are children also add them.
      if (atom.childClasses) {
        for (const child of atom.childClasses) {
          const childAtom = atoms.get(child);
          if (childAtom) {
            newStyles = { ...newStyles, ...evaluate(child, childAtom) };
          }
        }
      }
    } else {
      // If we failed the atRulesResult, remove the child class styles
      if (atom.childClasses) {
        for (const child of atom.childClasses) {
          newStyles[child] = undefined;
        }
      }
    }
  }

  return newStyles;
}

function resolveFunction(
  style: StyleWithFunction | string | number
): string | number | OpaqueColorValue | undefined {
  if (typeof style !== "object" || !("function" in style)) {
    return style;
  }

  const resolvedValues = style.values.map((value) => resolveFunction(value));

  switch (style.function) {
    case "inbuilt": {
      const [name, ...values] = resolvedValues;
      return [name, "(", values.join(", "), ")"].join("");
    }
    case "vw": {
      const [value] = resolvedValues;
      if (typeof value !== "number") return;
      return value * (topicValues["device-width"] as number);
    }
    case "vh": {
      const [value] = resolvedValues;
      if (typeof value !== "number") return;
      return value * (topicValues["device-height"] as number);
    }
    case "var": {
      const [variable, defaultValue] = resolvedValues;
      if (typeof variable !== "string") return;
      return topicValues[variable] ?? defaultValue;
    }
    case "platformSelect": {
      const specifics = resolveSpecifics(resolvedValues);
      return Platform.select(specifics);
    }
    case "platformColor": {
      return PlatformColor(
        ...resolvedValues.filter(
          (value): value is string => typeof value === "string"
        )
      );
    }
    case "hairlineWidth":
      return StyleSheet.hairlineWidth;
    case "pixelRatio": {
      if (resolvedValues.length > 0) {
        const specifics = resolveSpecifics(resolvedValues);
        return specifics[PixelRatio.get()];
      } else {
        return PixelRatio.get();
      }
    }
    case "fontScale": {
      if (resolvedValues.length > 0) {
        const specifics = resolveSpecifics(resolvedValues);
        return specifics[PixelRatio.getFontScale()];
      } else {
        return PixelRatio.getFontScale();
      }
    }
    case "getPixelSizeForLayoutSize": {
      const value = resolvedValues[0];
      if (typeof value !== "number") return;
      return PixelRatio.getPixelSizeForLayoutSize(value);
    }
    case "roundToNearestPixel": {
      const value = resolvedValues[0];
      if (typeof value !== "number") return;
      return PixelRatio.roundToNearestPixel(value);
    }
  }
}

function resolveSpecifics(
  values: (string | number | OpaqueColorValue | undefined)[]
) {
  return Object.fromEntries(
    values
      .filter((value): value is string => typeof value === "string")
      .map((value) => {
        const [platform, other] = value.split("_");
        return [platform, resolveFunction(other)];
      })
  );
}

function useSync(
  className: string,
  componentState: Record<string, boolean | number> = {}
) {
  const keyTokens: string[] = [];
  const conditions = new Set<string>();

  for (const atomName of className.split(/\s+/)) {
    const atom = atoms.get(atomName);

    if (!atom) continue;

    if (atom.conditions) {
      let conditionsPass = true;
      for (const condition of atom.conditions) {
        conditions.add(condition);

        if (conditionsPass) {
          switch (condition) {
            case "not-first-child":
              conditionsPass =
                typeof componentState["nthChild"] === "number" &&
                componentState["nthChild"] > 0;
              break;
            case "odd":
              conditionsPass =
                typeof componentState["nthChild"] === "number" &&
                componentState["nthChild"] % 2 === 1;
              break;
            case "even":
              conditionsPass =
                typeof componentState["nthChild"] === "number" &&
                componentState["nthChild"] % 2 === 0;
              break;
            default:
              conditionsPass = !!componentState[condition];
          }
        }
      }

      if (conditionsPass) {
        keyTokens.push(atomName);
      }
    } else {
      keyTokens.push(atomName);
    }
  }

  const key = keyTokens.join(" ");

  if (!styleSets[key] && key.length > 0) {
    warmCache([keyTokens]);
  }

  const currentStyles = useSyncExternalStoreWithSelector(
    subscribeToStyleSets,
    () => styleSets,
    () => styleSets,
    (styles) => styles[key]
  );

  return {
    styles: currentStyles,
    childClasses: childClasses.get(key),
    meta: styleMeta.get(key),
    conditions,
  };
}

function warmCache(tokenSets: Array<string[]>) {
  for (const keyTokens of tokenSets) {
    const key = keyTokens.join(" ");

    setStyleSets({
      [key]: keyTokens.flatMap((token) => {
        return styles[token] ?? [];
      }),
    });

    subscribeToStyles((styles, oldStyles) => {
      const hasChanged = keyTokens.some(
        (token) => styles[token] !== oldStyles[token]
      );

      if (hasChanged) {
        setStyleSets({
          [key]: keyTokens.flatMap((token) => styles[token] ?? []),
        });
      }
    });

    const children = keyTokens.flatMap((token) => {
      const childClasses = atoms.get(token)?.childClasses;
      return childClasses ?? [];
    });

    if (children.length > 0) {
      childClasses.set(key, children.join(" "));
    }
  }
}

function getColorScheme() {
  return topicValues["colorScheme"] as "light" | "dark";
}

function setColorScheme(system?: ColorSchemeName | "system" | null) {
  setTopicValues({
    colorSchemeSystem: system ?? "system",
    colorScheme:
      !system || system === "system"
        ? Appearance.getColorScheme() || "light"
        : system,
  });
}

function setDirection(direction: "ltr" | "rtl") {
  setTopicValues({
    i18nDirection: direction,
  });
}

function setCustomProperties(
  properties: Record<`--${string}`, string | number>
) {
  setTopicValues(properties);
}

function toggleColorScheme() {
  return setTopicValues((state) => {
    const currentColor =
      state["colorSchemeSystem"] === "system"
        ? Appearance.getColorScheme() || "light"
        : state["colorScheme"];

    const newColor = currentColor === "light" ? "dark" : "light";

    return {
      colorScheme: newColor,
      colorSchemeSystem: newColor,
    };
  });
}

topicValueListeners.add((topics) => {
  if (typeof localStorage !== "undefined") {
    localStorage.nativewind_theme = topics["colorScheme"];
  }
});

try {
  if (typeof localStorage !== "undefined") {
    const isDarkMode = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    const hasLocalStorageTheme = "nativewind_theme" in localStorage;

    if (
      localStorage.nativewind_theme === "dark" ||
      (!hasLocalStorageTheme && isDarkMode)
    ) {
      document.documentElement.classList.add("dark");
      setColorScheme("dark");
    } else {
      document.documentElement.classList.remove("dark");
      setColorScheme("light");
    }
  }
} catch {
  // Do nothing
}

Appearance.addChangeListener(({ colorScheme }) => {
  setColorScheme(colorScheme);
});

function setDimensions(dimensions: Dimensions) {
  dimensionsListener?.remove();

  const window = dimensions.get("window");
  setTopicValues({
    "device-width": window.width,
    "device-height": window.height,
    "device-orientation":
      window.width > window.height ? "landscape" : "portrait",
  });

  dimensionsListener = dimensions.addEventListener("change", ({ window }) => {
    setTopicValues({
      "device-width": window.width,
      "device-height": window.height,
      "device-orientation":
        window.width > window.height ? "landscape" : "portrait",
    });
  });
}
