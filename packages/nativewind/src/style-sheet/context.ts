import { StyleSheet, Platform, PlatformOSType } from "react-native";
import { Atom, Style, VariableValue } from "../postcss/types";

export type Listener<T> = (state: T, oldState: T) => void;

type Styles = Record<string, Style[] | undefined>;
type Topics = Record<string, VariableValue>;
type StyleSet = Record<string, Style[]>;

interface StyleSheetContext {
  reset: () => void;

  atoms: Map<string, Atom>;
  childClasses: Map<string, string>;
  styleMeta: Map<string, Record<string, boolean>>;

  styles: Styles;
  setStyles: (value: Styles | ((value: Styles) => Styles) | undefined) => void;
  subscribeToStyles: (listener: Listener<Styles>) => () => boolean;
  styleListeners: Set<Listener<Styles>>;

  styleSets: StyleSet;
  setStyleSets: (
    value: StyleSet | ((value: StyleSet) => StyleSet) | undefined
  ) => void;
  subscribeToStyleSets: (listener: Listener<StyleSet>) => () => boolean;
  styleSetListeners: Set<Listener<StyleSet>>;

  topics: Topics;
  setTopics: (value: Topics | ((value: Topics) => Topics) | undefined) => void;
  subscribeToTopics: (listener: Listener<Topics>) => () => boolean;
  topicListeners: Set<Listener<Topics>>;

  rootVariableValues: Record<string, VariableValue>;
  darkRootVariableValues: Record<string, VariableValue>;
  updateRootVariableValues: (
    value: Record<string, VariableValue> | undefined
  ) => void;
  updateDarkRootVariableValues: (
    value: Record<string, VariableValue> | undefined
  ) => void;

  preprocessed: boolean;
  setOutput: (
    specifics: { [platform in PlatformOSType]?: "native" | "css" } & {
      default: "native" | "css";
    }
  ) => void;

  dangerouslyCompileStyles?: (css: string) => void;
  setDangerouslyCompileStyles: (callback: (css: string) => void) => void;
}

const context: StyleSheetContext = {
  reset,

  atoms: new Map(),
  childClasses: new Map(),
  styleMeta: new Map(),

  styles: {},
  styleListeners: new Set(),
  subscribeToStyles(listener) {
    context.styleListeners.add(listener);
    return () => context.styleListeners.delete(listener);
  },
  setStyles(value) {
    if (!value) return;
    const oldValue = { ...context.styles };
    if (!value) return;
    context.styles =
      typeof value === "function"
        ? { ...context.styles, ...value(context.styles) }
        : { ...context.styles, ...value };

    for (const listener of context.styleListeners) {
      listener(context.styles, oldValue);
    }
  },

  styleSets: {},
  styleSetListeners: new Set(),
  subscribeToStyleSets(listener) {
    context.styleSetListeners.add(listener);
    return () => context.styleSetListeners.delete(listener);
  },
  setStyleSets(value) {
    if (!value) return;
    const oldValue = { ...context.styleSets };
    context.styleSets =
      typeof value === "function"
        ? { ...context.styleSets, ...value(context.styleSets) }
        : { ...context.styleSets, ...value };

    for (const listener of context.styleSetListeners) {
      listener(context.styleSets, oldValue);
    }
  },

  topics: {},
  topicListeners: new Set(),
  subscribeToTopics(listener) {
    context.topicListeners.add(listener);
    return () => context.topicListeners.delete(listener);
  },
  setTopics(value) {
    if (!value) return;
    const oldValue = { ...context.topics };
    context.topics =
      typeof value === "function"
        ? { ...context.topics, ...value(context.topics) }
        : { ...context.topics, ...value };

    for (const listener of context.topicListeners)
      listener(context.topics, oldValue);
  },

  rootVariableValues: {},
  darkRootVariableValues: {},

  updateRootVariableValues(value) {
    context.rootVariableValues = {
      ...context.rootVariableValues,
      ...value,
    };
  },

  updateDarkRootVariableValues(value) {
    context.darkRootVariableValues = {
      ...context.darkRootVariableValues,
      ...value,
    };
  },

  preprocessed: false,
  setOutput: (
    specifics: { [platform in PlatformOSType]?: "native" | "css" } & {
      default: "native" | "css";
    }
  ) => (context.preprocessed = Platform.select(specifics) === "css"),

  setDangerouslyCompileStyles(callback) {
    context.dangerouslyCompileStyles = callback;
  },
};

function reset() {
  context.atoms.clear();
  context.childClasses.clear();
  context.styleSets = {};
  context.styleSetListeners.clear();
  context.styles = {};
  context.styleListeners.clear();
  context.topics = {
    platform: Platform.OS,
  };
  context.topicListeners.clear();

  // Add some default atoms. These no do not compile
  context.atoms.set("group", {
    styles: [],
    meta: {
      group: true,
    },
  });

  context.atoms.set("group-isolate", {
    styles: [],
    meta: {
      groupIsolate: true,
    },
  });

  context.atoms.set("parent", {
    styles: [],
    meta: {
      parent: true,
    },
  });

  context.preprocessed = Platform.select({
    default: false,
    web: typeof StyleSheet.create({ test: {} }).test !== "number",
  });
  context.dangerouslyCompileStyles = undefined;
}

export default context;
