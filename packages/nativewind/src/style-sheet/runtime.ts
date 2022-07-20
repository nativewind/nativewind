import {
  StyleSheet,
  Dimensions,
  Appearance,
  ScaledSize,
  EmitterSubscription,
  NativeEventSubscription,
  TextStyle,
  ImageStyle,
  ViewStyle,
  Platform,
  StyleProp,
  I18nManager,
  PlatformOSType,
} from "react-native";
import {
  matchAtRule,
  matchChildAtRule,
  MatchChildAtRuleOptions,
} from "./match-at-rule";
import {
  createAtRuleSelector,
  getStateBit,
  matchesMask,
  StateBitOptions,
} from "../utils/selector";
import { MediaRecord } from "../types/common";
import vh from "./units/vh";
import vw from "./units/vw";
import { ColorSchemeStore } from "./color-scheme";
import { parseStyleFunction } from "./style-functions";

export type { ColorSchemeSystem, ColorSchemeName } from "./color-scheme";
export type Style = ViewStyle | ImageStyle | TextStyle;
export type InlineStyle<T extends Style> = T;
export type AtRuleStyle<T extends Style> = T & { atRules: unknown[] };
export type CompiledStyle = { [key: string]: string } & { $$css: boolean };
export type EitherStyle<T extends Style = Style> =
  | AtRuleStyle<T>
  | CompiledStyle
  | InlineStyle<T>
  | StyleProp<T>;

export type Snapshot = Record<string, StylesArray>;

const emptyStyles: StylesArray = Object.assign([], { mask: 0 });

export interface StylesArray<T = Style> extends Array<EitherStyle<T>> {
  childClassNames?: string[];
  mask?: number;
}

const units: Record<
  string,
  (value: string | number) => string | number | Record<string, unknown>
> = {
  vw,
  vh,
};

/**
 * Tailwind styles are strings of atomic classes. eg "a b" compiles to [a, b]
 *
 * If the styles are static we can simply cache them and return a stable result
 *
 * However, if the styles are dynamic (have atRules) there are two things we need to do
 *  - Update the atomic style
 *  - Update the dependencies of the atomic style
 *
 * This is performed by each style subscribing to a atRule topic. The atomic styles are updated
 * before the parent styles.
 *
 * The advantage of this system is that styles are only updated once, no matter how many components
 * are on using them
 *
 * The disadvantages are
 * - Is that the store doesn't purge unused styles, so the listeners will continue to grow
 * - UI states (hover/active/focus) are considered separate styles
 *
 * If you are interested in helping me build a more robust store, please create an issue on Github.
 *
 */
export class StyleSheetRuntime extends ColorSchemeStore {
  snapshot: Snapshot = { "": emptyStyles };
  listeners = new Set<() => void>();
  atRuleListeners = new Set<(topics: string[]) => void>();

  dimensionListener?: EmitterSubscription;
  appearanceListener?: NativeEventSubscription;
  dangerouslyCompileStyles?: (
    className: string,
    store: StyleSheetRuntime
  ) => void;

  styles: Record<string, Style> = {};
  atRules: MediaRecord = {};
  transforms: Record<string, true> = {};
  topics: Record<string, Array<string>> = {};
  childClasses: Record<string, Array<string>> = {};
  masks: Record<string, number> = {};
  units: Record<string, Record<string, string>> = {};

  preprocessed = false;

  platform: typeof Platform.OS = Platform.OS;
  window: ScaledSize = Dimensions.get("window");
  orientation: OrientationLockType = "portrait";

  constructor() {
    super();
    this.setDimensions(Dimensions);
    this.setAppearance(Appearance);
    this.setPlatform(Platform.OS);
    this.setOutput({
      web:
        typeof StyleSheet.create({ test: {} }).test !== "number"
          ? "css"
          : "native",
      default: "native",
    });
  }

  setDimensions(dimensions: Dimensions) {
    this.window = dimensions.get("window");
    this.orientation =
      this.window.height >= this.window.width ? "portrait" : "landscape";

    this.dimensionListener?.remove();
    this.dimensionListener = dimensions.addEventListener(
      "change",
      ({ window }) => {
        const topics: string[] = ["window"];

        if (window.width !== this.window.width) topics.push("width");
        if (window.height !== this.window.height) topics.push("height");

        this.window = window;

        const orientation =
          window.height >= window.width ? "portrait" : "landscape";
        if (orientation !== this.orientation) topics.push("orientation");
        this.orientation = orientation;

        this.notifyMedia(topics);
      }
    );
  }

  setAppearance(appearance: typeof Appearance) {
    this.appearanceListener?.remove();
    this.appearanceListener = appearance.addChangeListener(
      ({ colorScheme }) => {
        if (this.colorSchemeSystem === "system") {
          this.colorScheme = colorScheme || "light";
          this.notifyMedia(["colorScheme"]);
        }
      }
    );
  }

  setPlatform(platform: typeof Platform.OS) {
    this.platform = platform;
  }

  setOutput(specifics: {
    [platform in PlatformOSType | "default"]?: "css" | "native";
  }) {
    this.preprocessed = Platform.select(specifics) === "css";
  }

  setDangerouslyCompileStyles(
    dangerouslyCompileStyles: (
      className: string,
      store: StyleSheetRuntime
    ) => void
  ) {
    this.dangerouslyCompileStyles = dangerouslyCompileStyles;
  }

  getSnapshot = () => {
    return this.snapshot;
  };

  getServerSnapshot() {
    return this.snapshot;
  }

  subscribe = (listener: () => void) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };

  destroy() {
    this.dimensionListener?.remove();
    this.appearanceListener?.remove();
  }

  notify() {
    for (const l of this.listeners) l();
  }

  subscribeMedia(listener: (topics: string[]) => void) {
    this.atRuleListeners.add(listener);
    return () => this.atRuleListeners.delete(listener);
  }

  notifyMedia(topics: string[]) {
    for (const l of this.atRuleListeners) l(topics);
    this.notify();
  }

  isEqual(a: StylesArray, b: StylesArray): boolean {
    if (a.length !== b.length) {
      return false;
    }

    return a.every((style, index) => Object.is(style, b[index]));
  }

  prepare(composedClassName?: string, options: StateBitOptions = {}): string {
    if (typeof composedClassName !== "string") {
      return "";
    }

    if (this.preprocessed) {
      return this.preparePreprocessed(composedClassName, options);
    }

    const stateBit = getStateBit(options);

    const snapshotKey = `(${composedClassName}).${stateBit}`;
    if (this.snapshot[snapshotKey]) return snapshotKey;

    this.dangerouslyCompileStyles?.(composedClassName, this);

    const classNames = composedClassName.split(/\s+/);
    const topics = new Set<string>();

    for (const className of classNames) {
      if (this.topics[className]) {
        for (const topic of this.topics[className]) {
          topics.add(topic);
        }
      }
    }

    const childStyles: string[] = [];

    const reEvaluate = () => {
      const styleArray: StylesArray = [];
      const transformStyles: ViewStyle["transform"] = [];
      styleArray.mask = 0;

      const stateBit = getStateBit({
        ...options,
        darkMode: this.colorScheme === "dark",
        rtl: I18nManager.isRTL,
        platform: Platform.OS,
      });

      for (const className of classNames) {
        const mask = this.masks[className] || 0;
        styleArray.mask |= mask;

        // If we match this class's state, then process it
        if (matchesMask(stateBit, mask)) {
          const classNameStyles = this.upsertAtomicStyle(className);

          // Group transforms
          if (this.transforms[className]) {
            for (const a of classNameStyles) {
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              transformStyles.push(...(a as unknown as ViewStyle).transform!);
            }
          } else {
            styleArray.push(...classNameStyles);
          }

          if (classNameStyles.childClassNames) {
            childStyles.push(...classNameStyles.childClassNames);
          }
        }
      }

      if (transformStyles.length > 0) {
        styleArray.push({
          transform: transformStyles,
        });
      }

      if (styleArray.length > 0 || childStyles.length > 0) {
        if (childStyles.length > 0) {
          styleArray.childClassNames = childStyles;
        }

        this.snapshot = {
          ...this.snapshot,
          [snapshotKey]: styleArray,
        };
      } else if (styleArray.mask === 0) {
        this.snapshot = {
          ...this.snapshot,
          [snapshotKey]: emptyStyles,
        };
      } else {
        this.snapshot = {
          ...this.snapshot,
          [snapshotKey]: styleArray,
        };
      }
    };

    reEvaluate();

    if (topics.size > 0) {
      this.subscribeMedia((notificationTopics: string[]) => {
        if (notificationTopics.some((topic) => topics.has(topic))) {
          reEvaluate();
        }
      });
    }

    return snapshotKey;
  }

  preparePreprocessed(
    className: string,
    {
      isolateGroupActive = false,
      isolateGroupFocus = false,
      isolateGroupHover = false,
    } = {}
  ): string {
    if (this.snapshot[className]) return className;

    const classNames = [className];

    if (isolateGroupActive) classNames.push("group-isolate-active");
    if (isolateGroupFocus) classNames.push("group-isolate-focus");
    if (isolateGroupHover) classNames.push("group-isolate-hover");

    const styleArray: StylesArray = [
      {
        $$css: true,
        [className]: classNames.join(" "),
      } as CompiledStyle,
    ];
    this.snapshot = {
      ...this.snapshot,
      [className]: styleArray,
    };
    return className;
  }

  getStyleArray(className: string): StylesArray {
    let styles = this.styles[className];

    /**
     * Some RN platforms still use style ids. Unfortunately this means we cannot
     * support transform or dynamic units.
     *
     * In these cases we need to call flatten on the style to return it to an object.
     *
     * This causes a minor performance issue for these styles, but it should only
     * be a subset
     */
    if (this.units[className] || this.transforms[className]) {
      styles = {
        ...(typeof styles === "number" ? StyleSheet.flatten(styles) : styles),
      };
    }

    if (this.units[className]) {
      for (const [key, value] of Object.entries(styles)) {
        const unitFunction = this.units[className][key]
          ? units[this.units[className][key]]
          : undefined;

        if (unitFunction) {
          (styles as Record<string, unknown>)[key] = unitFunction(value);
        }
      }
    }

    // To keep things consistent, even atomic styles are arrays
    const styleArray: StylesArray = styles ? [styles] : [];

    if (this.childClasses[className]) {
      styleArray.childClassNames = this.childClasses[className];
    }

    return styleArray;
  }

  /**
   * ClassNames are made of multiple atomic styles. eg "a b" are the styles [a, b]
   *
   * This function will be called for each atomic style
   */
  upsertAtomicStyle(className: string): StylesArray {
    // This atomic style has already been processed, we can skip it
    if (this.snapshot[className]) return this.snapshot[className];

    // To keep things consistent, even atomic styles are arrays
    const styleArray = this.getStyleArray(className);

    if (this.childClasses[className]) {
      styleArray.childClassNames = this.childClasses[className];
    }

    const atRulesTuple = this.atRules[className];

    // If there are no atRules, this style is static.
    // We can add it to the snapshot and early exit.
    if (!atRulesTuple) {
      this.snapshot =
        styleArray.length > 0
          ? { ...this.snapshot, [className]: styleArray }
          : { ...this.snapshot, [className]: emptyStyles };
      return styleArray;
    }

    // When a topic has new information, this function will be called.
    const reEvaluate = () => {
      const newStyles: StylesArray = [...styleArray];

      for (const [index, atRules] of atRulesTuple.entries()) {
        const atRulesResult = atRules.every(([rule, params]) => {
          if (rule === "selector") {
            // These atRules shouldn't be on the atomic styles, they only
            // apply to childStyles
            return false;
          }

          return matchAtRule({
            rule,
            params,
            width: this.window.width,
            height: this.window.height,
            orientation: this.orientation,
          });
        });

        if (!atRulesResult) {
          continue;
        }

        const ruleSelector = createAtRuleSelector(className, index);
        newStyles.push(this.styles[ruleSelector]);
      }

      this.snapshot =
        newStyles.length > 0 || newStyles?.childClassNames?.length
          ? { ...this.snapshot, [className]: newStyles }
          : { ...this.snapshot, [className]: emptyStyles };

      return newStyles;
    };

    if (this.topics[className]) {
      const topics = new Set(this.topics[className]);
      this.subscribeMedia((notificationTopics: string[]) => {
        if (notificationTopics.some((topic) => topics.has(topic))) {
          reEvaluate();
        }
      });
    }

    return reEvaluate();
  }

  getChildStyles<T>(parent: StylesArray<T>, options: MatchChildAtRuleOptions) {
    if (!parent.childClassNames) return;

    const styles: Style[] = [];
    const classNames = new Set();

    for (const className of parent.childClassNames) {
      for (const [index, atRules] of this.atRules[className].entries()) {
        const match = atRules.every(([rule, params]) => {
          return matchChildAtRule(rule, params, options);
        });

        const stylesKey = createAtRuleSelector(className, index);
        const style = this.styles[stylesKey];

        if (match && style) {
          classNames.add(className);

          styles.push(style);
        }
      }
    }

    if (styles.length === 0) {
      return;
    }

    const className = `${[...classNames].join(" ")}.child`;

    if (this.snapshot[className]) return this.snapshot[className];
    this.snapshot = { ...this.snapshot, [className]: styles };
    return this.snapshot[className];
  }

  create({
    styles,
    atRules,
    masks,
    topics,
    units,
    childClasses,
    transforms,
  }: Partial<
    Pick<
      StyleSheetRuntime,
      | "styles"
      | "atRules"
      | "masks"
      | "topics"
      | "units"
      | "childClasses"
      | "transforms"
    >
  >) {
    if (atRules) Object.assign(this.atRules, atRules);
    if (masks) Object.assign(this.masks, masks);
    if (topics) Object.assign(this.topics, topics);
    if (childClasses) Object.assign(this.childClasses, childClasses);
    if (units) Object.assign(this.units, units);
    if (transforms) Object.assign(this.transforms, transforms);

    if (styles) {
      Object.assign(this.styles, StyleSheet.create(styles));
      for (const className of Object.keys(styles)) {
        this.upsertAtomicStyle(className);
      }
    }
  }

  parse(functionString: string, value: string) {
    return parseStyleFunction(functionString, value);
  }
}
