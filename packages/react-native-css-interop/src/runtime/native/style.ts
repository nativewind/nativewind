import {
  StyleSheet,
  Platform,
  PlatformColor,
  PixelRatio,
  LayoutChangeEvent,
} from "react-native";
import {
  AnimatableValue,
  Easing,
  cancelAnimation,
  makeMutable,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import {
  Effect,
  Signal,
  cleanupEffect,
  createSignal,
  interopGlobal,
  setupEffect,
} from "../signals";
import { globalVariables, rem, vh, vw } from "./misc";
import { colorScheme } from "./color-scheme";
import {
  DEFAULT_CONTAINER_NAME,
  STYLE_SCOPES,
  isPropDescriptor,
} from "../../shared";
import { NormalizedOptions } from "./prop-mapping";
import {
  testContainerQuery,
  testMediaQueries,
  testPseudoClasses,
} from "./conditions";
import type { Time } from "lightningcss";
import type {
  ExtractedAnimations,
  ExtractedTransition,
  ExtractionWarning,
  ExtractedAnimation,
  GroupedTransportStyles,
  RuntimeValueDescriptor,
  RuntimeStyle,
  RuntimeValue,
  GroupedRuntimeStyle,
  TransportStyle,
  Interaction,
  Layers,
  NativeStyleToProp,
  Specificity,
} from "../../types";

export const styleSignals = new Map<string, Signal<GroupedRuntimeStyle>>();
export const opaqueStyles = new WeakMap<object, RuntimeStyle>();
export const animationMap = new Map<string, ExtractedAnimation>();

export const globalClassNameCache = new Map<string, InteropReducerState>();
export const globalInlineCache = new WeakMap<object, InteropReducerState>();

export const warnings = new Map<string, ExtractionWarning[]>();
export const warned = new Set<string>();

export interface InteropReducerState {
  testId?: string;
  version: number;
  onChange?: () => void;
  parent: InteropReducerState;
  originalProps: Record<string, any>;
  props: Record<string, any>;
  options: NormalizedOptions;
  scope: number;
  interaction: Interaction;
  hasActive: boolean;
  hasHover: boolean;
  hasFocus: boolean;
  hasContainer: boolean;
  convertToPressable: boolean;
  shouldUpdateContext: boolean;
  context?: InteropReducerState;
  isAnimated: boolean;
  animations?: Required<ExtractedAnimations>;
  animationNames: Set<string>;
  transition?: Required<ExtractedTransition>;
  signalsToRemove: Set<string>;
  inlineVariables: Map<string, Signal<any>>;
  containerNames: Set<string>;
  effect: Effect;
  requiresLayoutWidth: boolean;
  requiresLayoutHeight: boolean;
  animationWaitingOnLayout: boolean;
  layout?: Signal<[number, number] | undefined>;
  dependencies: any[];
  hoistedStyles?: [string, string, "transform" | "shadow"][];
  sharedValues: Record<string, ReturnType<typeof makeMutable>>;
  getInteraction(name: keyof Interaction): boolean;
  getVariable(name: string): any;
  setVariable(name: string, value: any, specificity: Specificity): void;
  setContainer(name: string): void;
  getContainer(name: string): InteropReducerState | undefined;
  containerSignal?: Signal<InteropReducerState>;
  rerender(
    parent?: InteropReducerState,
    originalProps?: Record<string, any>,
  ): void;
}

export function createInteropStore(
  parent: InteropReducerState,
  options: NormalizedOptions,
  originalProps: Record<string, any>,
) {
  const state: InteropReducerState = {
    testId: originalProps.testId,
    version: 0,
    parent,
    options,
    props: {},
    originalProps,
    scope: STYLE_SCOPES.GLOBAL,
    interaction: {},
    hasActive: false,
    hasHover: false,
    hasFocus: false,
    hasContainer: false,
    shouldUpdateContext: false,
    convertToPressable: false,
    animationWaitingOnLayout: false,
    requiresLayoutHeight: false,
    requiresLayoutWidth: false,
    isAnimated: false,
    animationNames: new Set(),
    signalsToRemove: new Set(),
    inlineVariables: new Map(),
    containerNames: new Set(),
    sharedValues: {},
    dependencies: options.dependencies.map((k) => originalProps[k]),
    setVariable(name, value) {
      state.signalsToRemove.delete(name);

      const existing = state.inlineVariables.get(name);
      if (!existing) {
        state.inlineVariables.set(name, createSignal(value, name));
      } else {
        existing.set(value);
      }
    },
    getVariable(name) {
      let value: any = undefined;
      value ??= state.inlineVariables.get(name)?.get();
      value ??= globalVariables.universal.get(name)?.get();
      value ??= parent.getVariable(name);
      return value;
    },
    setContainer(name) {
      state.containerSignal ??= createSignal(state, name);
      state.containerNames.add(name);
    },
    getContainer(name) {
      if (
        state.containerSignal &&
        (state.containerNames.has(name) || name === DEFAULT_CONTAINER_NAME)
      ) {
        return state.containerSignal.get();
      } else {
        return parent.getContainer(name);
      }
    },
    getInteraction(name) {
      if (!this.interaction[name]) {
        this.interaction[name] = createSignal(false, name);
      }
      return this.interaction[name]!.get();
    },
    effect: Object.assign(
      () => {
        state.rerender();
        state.onChange?.();
      },
      {
        dependencies: new Set<Signal<any>>(),
      },
    ),
    rerender: (parent, originalProps) => {
      render(state, parent, originalProps);
    },
  };

  state.effect.state = state;

  render(state);

  return {
    state,
    subscribe(subscriber: () => void) {
      state.onChange = subscriber;
      return () => {
        state.onChange = undefined;
        cleanupEffect(state.effect);
      };
    },
    snapshot() {
      return state.version;
    },
  };
}

function render(
  state: InteropReducerState,
  parent?: InteropReducerState,
  originalProps?: Record<string, any>,
): InteropReducerState {
  if (parent) state.parent = parent;
  if (originalProps) {
    state.originalProps = originalProps;
    state.dependencies = state.options.dependencies.map(
      (k) => state.originalProps![k],
    );
  }

  state.shouldUpdateContext = false;
  state.convertToPressable ||= false;
  state.signalsToRemove = new Set(state.inlineVariables.keys());
  state.props = {};

  setupEffect(state.effect);
  interopGlobal.delayedEvents.delete(state.effect!);

  let maxScope = STYLE_SCOPES.GLOBAL;
  const mapping: [string, Layers, NativeStyleToProp<any> | undefined][] = [];

  // Collect everything into the specificity layers and calculate the max scope
  for (const [prop, sourceProp, nativeStyleToProp] of state.options.config) {
    const classNames = state.originalProps?.[sourceProp];
    if (typeof classNames !== "string") continue;

    const layers: Layers = {
      classNames,
      0: [],
      1: [],
      2: [],
    };

    for (const className of classNames.split(/\s+/)) {
      let signal = styleSignals.get(className);
      if (!signal) continue;
      const meta = signal.get();
      maxScope = Math.max(maxScope, meta.scope);
      if (meta[0]) layers[0].push(...meta[0]);
      if (meta[1]) layers[1].push(...meta[1]);
      if (meta[2]) layers[2].push(...meta[2]);
    }

    let inlineStyles = state.originalProps?.[prop];
    if (inlineStyles) {
      if (Array.isArray(inlineStyles)) {
        layers[1].push(
          ...inlineStyles.flat(10).map((style) => {
            if (opaqueStyles.has(style)) {
              style = opaqueStyles.get(style)!;
            }
            return style;
          }),
        );
      } else {
        if (opaqueStyles.has(inlineStyles)) {
          inlineStyles = opaqueStyles.get(inlineStyles)!;
        }
        layers[1].push(inlineStyles);
      }
    }

    mapping.push([prop, layers, nativeStyleToProp]);
  }

  /**
   * Process the styles in order of layers
   *  0: className
   *  1: inline
   *  2: important
   *  3: transitions
   *  4: animations
   *
   * We swap the processing order of 3 and 4, so we can skip already processed attributes
   */
  for (const [prop, layers, nativeStyleToProp] of mapping) {
    // Layer 0 - className
    if (layers[0].length) {
      reduceStyles(state, prop, layers[0], maxScope);
    }

    // Layer 1 - inline
    if (layers[1].length) {
      reduceStyles(state, prop, layers[1], maxScope);
    }

    // Layer 2 - important
    if (layers[2].length) {
      reduceStyles(state, prop, layers[2], maxScope);
    }

    if (state.props[prop]) {
      resolveObject(state.props[prop]);
    }

    // Layer 3 & 4 only occur when the target is 'style'
    if (prop === "style") {
      const styleProp = state.props[prop];
      if (styleProp && typeof styleProp.width === "number") {
        state.requiresLayoutWidth = false;
      }
      if (styleProp && typeof styleProp.height === "number") {
        state.requiresLayoutHeight = false;
      }

      const seenAnimatedProps = new Set();

      // Layer 4 - animations
      if (state.animations) {
        const {
          name: animationNames,
          duration: durations,
          delay: delays,
          iterationCount: iterationCounts,
        } = state.animations;

        state.isAnimated = true;

        state.props.style ??= {};

        let names: string[] = [];
        let shouldResetAnimations = state.animationWaitingOnLayout;

        for (const name of animationNames) {
          if (name.type === "none") {
            names = [];
            state.animationNames.clear();
            break;
          }

          names.push(name.value);

          if (!state.animationNames.has(name.value)) {
            shouldResetAnimations = true;
          }
        }

        if (shouldResetAnimations) {
          state.animationNames.clear();
          state.animationWaitingOnLayout = false;

          // Loop in reverse order
          for (let index = names.length - 1; index >= 0; index--) {
            const name = names[index % names.length];
            state.animationNames.add(name);

            const keyframes = animationMap.get(name);
            if (!keyframes) {
              continue;
            }

            const totalDuration = timeToMS(durations[index % name.length]);
            const delay = timeToMS(delays[index % delays.length]);
            const iterationCount =
              iterationCounts[index % iterationCounts.length];
            const iterations =
              iterationCount.type === "infinite" ? -1 : iterationCount.value;

            if (keyframes.hoistedStyles) {
              state.hoistedStyles ??= [];
              state.hoistedStyles.push(...keyframes.hoistedStyles);
            }

            for (const [key, [initialFrame, ...frames]] of Object.entries(
              keyframes.frames,
            )) {
              if (seenAnimatedProps.has(key)) continue;
              seenAnimatedProps.add(key);

              const initialValue = resolveAnimationValue(
                initialFrame.value,
                key,
                state.props.style,
              );

              const sequence = frames.map((frame) => {
                return withDelay(
                  delay,
                  withTiming(
                    resolveAnimationValue(frame.value, key, state.props.style),
                    {
                      duration: totalDuration * frame.progress,
                      easing: Easing.linear,
                    },
                  ),
                );
              }) as [AnimatableValue, ...AnimatableValue[]];

              state.animationWaitingOnLayout =
                (state.requiresLayoutWidth || state.requiresLayoutHeight) &&
                !state.layout?.peek();

              let sharedValue = state.sharedValues[key];
              if (!sharedValue) {
                sharedValue = makeMutable(initialValue);
                state.sharedValues[key] = sharedValue;
              } else {
                sharedValue.value = initialValue;
              }

              sharedValue.value = withRepeat(
                withSequence(...sequence),
                iterations,
              );

              Object.defineProperty(state.props[prop], key, {
                configurable: true,
                enumerable: true,
                value: sharedValue,
              });
            }
          }
        } else {
          for (const name of names) {
            const keyframes = animationMap.get(name);
            if (!keyframes) {
              continue;
            }

            state.props[prop] ??= {};

            if (keyframes.hoistedStyles) {
              state.hoistedStyles ??= [];
              state.hoistedStyles.push(...keyframes.hoistedStyles);
            }

            for (const key of Object.keys(keyframes.frames)) {
              Object.defineProperty(state.props[prop], key, {
                configurable: true,
                enumerable: true,
                value: state.sharedValues[key],
              });
              seenAnimatedProps.add(key);
            }
          }
        }
      }

      // Layer 3 - transitions
      if (state.transition) {
        state.isAnimated = true;

        const {
          property: properties,
          duration: durations,
          delay: delays,
        } = state.transition;

        for (let index = 0; index < properties.length; index++) {
          const key = properties[index];

          if (seenAnimatedProps.has(key)) continue;

          let value = state.props[prop][key] ?? defaultValues[key];
          if (typeof value === "function") {
            value = value();
          }
          if (value === undefined) continue;

          seenAnimatedProps.add(key);

          const duration = timeToMS(durations[index % durations.length]);
          const delay = timeToMS(delays[index % delays.length]);
          // const easing: any =
          //   transition.timingFunction[
          //     index % transition.timingFunction.length
          //   ];

          let sharedValue = state.sharedValues[key];
          if (!sharedValue) {
            sharedValue = makeMutable(value);
            state.sharedValues[key] = sharedValue;
          }

          if (value !== sharedValue.value) {
            sharedValue.value = withDelay(
              delay,
              withTiming(value, { duration }),
            );
          }

          Object.defineProperty(state.props[prop], key, {
            configurable: true,
            enumerable: true,
            value: sharedValue,
          });
        }
      }

      // Cleanup any sharedValues that are no longer used
      for (const [key, value] of Object.entries(state.sharedValues)) {
        if (seenAnimatedProps.has(key)) continue;
        cancelAnimation(value);
        value.value = state.props[prop][key] ?? defaultValues[key];
      }
    }

    // Move any styles to the correct prop
    if (nativeStyleToProp) {
      for (let [key, targetProp] of Object.entries(nativeStyleToProp)) {
        if (targetProp === true) targetProp = key;
        if (state.props.style[key] === undefined) continue;
        state.props[prop] = state.props.style[key];
        delete state.props.style[key];
      }
    }

    // React Native has some nested styles, so we need to expand these values
    if (state.hoistedStyles) {
      for (let [prop, key, transform] of state.hoistedStyles) {
        if (state.props[prop] && key in state.props[prop]) {
          switch (transform) {
            case "transform":
              state.props[prop].transform ??= [];
              state.props[prop].transform.push({
                [key]: state.props[prop][key],
              });
              delete state.props[prop][key];
              break;
            case "shadow":
              const [type, shadowKey] = key.split(".");
              state.props[prop][type] ??= {};
              state.props[prop][type][shadowKey] = state.props[prop][key];
              delete state.props[prop][key];
              break;
          }
        }
      }
    }
  }

  if (state.hasActive || state.hasContainer) {
    state.convertToPressable = true;
    state.interaction.active ??= createSignal(false, `${state.testId}#active`);
    state.props.onPressIn = (event: unknown) => {
      state.originalProps.onPressIn?.(event);
      state.interaction.active!.set(true);
    };
    state.props.onPressOut = (event: unknown) => {
      state.originalProps.onPressOut?.(event);
      state.interaction.active!.set(false);
    };
  }
  if (state.hasHover || state.hasContainer) {
    state.convertToPressable = true;
    state.interaction.hover ??= createSignal(false, `${state.testId}#hover`);
    state.props.onHoverIn = (event: unknown) => {
      state.originalProps.onHoverIn?.(event);
      state.interaction.hover!.set(true);
    };
    state.props.onHoverOut = (event: unknown) => {
      state.originalProps.onHoverOut?.(event);
      state.interaction.hover!.set(false);
    };
  }
  if (state.hasFocus || state.hasContainer) {
    state.convertToPressable = true;
    state.interaction.hover ??= createSignal(false, `${state.testId}#focus`);
    state.props.onFocus = (event: unknown) => {
      state.originalProps.onFocus?.(event);
      state.interaction.focus!.set(true);
    };
    state.props.onBlur = (event: unknown) => {
      state.originalProps.onBlur?.(event);
      state.interaction.focus!.set(false);
    };
  }

  if (state.convertToPressable) {
    // This is an annoying quirk of RN. Pressable will only work if onPress is defined
    state.props.onPress = state.originalProps.onPress ?? (() => {});
  }

  if (
    state.requiresLayoutWidth ||
    state.requiresLayoutHeight ||
    state.animationWaitingOnLayout
  ) {
    if (!state.layout) {
      state.layout ??= createSignal<[number, number] | undefined>(undefined);
      state.layout.get();
    } else if (!state.layout.peek()) {
      state.layout.get();
    }

    state.props.onLayout ??= (event: LayoutChangeEvent) => {
      state.originalProps.onLayout?.(event);
      const layout = event.nativeEvent.layout;
      const [width, height] = state.layout!.peek() ?? [0, 0];
      if (layout.width !== width || layout.height !== height) {
        state.layout!.set([layout.width, layout.height]);
      }
    };
  }

  if (state.containerNames.size === 0) {
    state.containerSignal?.set(undefined);
    state.containerSignal = undefined;
  }

  // for (const name of state.signalsToRemove) {
  //   // Set to undefined to cause any dependencies to render
  //   state.signals.get(name)?.set(undefined);
  //   // Delete the signal
  //   state.signals.delete(name);
  //   state.shouldUpdateContext = true;
  // }

  if (state.shouldUpdateContext) {
    // Duplicate this object, making it identify different
    state.context = Object.assign({}, state);
  }

  state.version++;
  return state;
}

export function upsertStyleSignal(
  name: string,
  groupedStyleMeta: GroupedTransportStyles,
) {
  const meta: GroupedRuntimeStyle = {
    scope: groupedStyleMeta.scope,
    [0]: groupedStyleMeta[0]?.map(mapStyle),
    [1]: groupedStyleMeta[1]?.map(mapStyle),
    [2]: groupedStyleMeta[2]?.map(mapStyle),
  };

  let signal = styleSignals.get(name);
  if (signal) {
    if (!deepEqual(signal.peek(), meta)) {
      signal.set(meta);
      if (process.env.NODE_ENV !== "production") {
        warned.delete(name);
        const originalGet = signal.get;
        signal.get = () => {
          printWarnings(name, groupedStyleMeta);
          return originalGet();
        };
      }
    }
  } else {
    let signal = styleSignals.get(name);

    if (signal) {
      signal.set(meta);
    } else {
      signal = createSignal(meta, name);
      if (process.env.NODE_ENV !== "production") {
        const originalGet = signal.get;
        signal.get = () => {
          printWarnings(name, groupedStyleMeta);
          return originalGet();
        };
      }

      styleSignals.set(name, signal);
    }
  }
}

function printWarnings(name: string, groupedStyleMeta: GroupedTransportStyles) {
  if (!groupedStyleMeta.warnings) return;

  for (const warning of groupedStyleMeta.warnings) {
    if (process.env.NODE_ENV === "test") {
      warnings.set(name, groupedStyleMeta.warnings);
    } else {
      warned.add(name);

      switch (warning.type) {
        case "IncompatibleNativeProperty":
          console.log("IncompatibleNativeProperty ", warning.property);
          break;
        case "IncompatibleNativeValue":
          console.log(
            "IncompatibleNativeValue ",
            warning.property,
            warning.value,
          );
          break;
        case "IncompatibleNativeFunctionValue":
          console.log(
            "IncompatibleNativeFunctionValue ",
            warning.property,
            warning.value,
          );
          break;
      }
    }
  }
}

function mapStyle(style: TransportStyle): RuntimeStyle {
  return {
    ...style,
    $$type: "runtime",
    props: style.props?.map(([key, value]) => {
      if (isPropDescriptor(value)) {
        return [key, parseValue(value.value)];
      } else {
        return [
          key,
          Object.fromEntries(value.map(([k, v]) => [k, parseValue(v)])),
        ];
      }
    }),
  };
}

export function reduceStyles(
  state: InteropReducerState,
  prop: string,
  styles: Array<RuntimeStyle | object>,
  _scope: number,
) {
  styles.sort(specificityCompare);

  for (let style of styles) {
    if (!("$$type" in style)) {
      state.props[prop] ??= {};
      Object.assign(state.props[prop], style);
      continue;
    }

    // If a style could possibly have a variable or a name, create the context
    // This prevent children losing state if a context is suddenly created
    if (style.variables || style.container?.names) {
      state.context ??= state;
    }

    if (style.pseudoClasses) {
      state.hasActive ||= Boolean(style.pseudoClasses.active);
      state.hasHover ||= Boolean(style.pseudoClasses.hover);
      state.hasFocus ||= Boolean(style.pseudoClasses.focus);
      if (!testPseudoClasses(state, style.pseudoClasses)) {
        continue;
      }
    }

    if (style.media && !testMediaQueries(style.media)) {
      continue;
    }

    if (
      style.containerQuery &&
      !testContainerQuery(state, style.containerQuery)
    ) {
      continue;
    }

    if (style.hoistedStyles) {
      state.hoistedStyles ??= [];
      state.hoistedStyles.push(...style.hoistedStyles);
    }

    if (style.variables) {
      for (const [key, value] of style.variables) {
        state.setVariable(key, value, style.specificity);
      }
    }

    if (style.animations) {
      state.animations = {
        ...defaultAnimation,
        ...state.animations,
        ...style.animations,
      };
    }

    if (style.transition) {
      state.transition = {
        ...defaultTransition,
        ...state.transition,
        ...style.transition,
      };
    }

    if (style.container?.names) {
      state.requiresLayoutWidth = true;
      state.requiresLayoutHeight = true;
      state.hasContainer = true;
      for (const name of style.container.names) {
        state.setContainer(name);
      }
    }

    if (style.props) {
      for (const [prop, value] of style.props) {
        if (typeof value === "object" && "$$type" in value) {
          state.props[prop] = value.value;
        } else if (value !== undefined) {
          if (typeof value === "object") {
            state.props[prop] ??= {};
            Object.assign(state.props[prop], value);
          } else {
            state.props[prop] = value;
          }
        }
      }
    }
  }

  return state;
}

export function parseValue(
  value: RuntimeValueDescriptor | string | number,
): RuntimeValue {
  if (typeof value === "string" || typeof value === "number") {
    return value;
  }

  if (!("name" in value)) return value;

  switch (value.name) {
    case "var": {
      return function () {
        return getVariable(value.arguments[0]);
      };
    }
    case "vh": {
      return function () {
        return round((vh.get() / 100) * value.arguments[0]);
      };
    }
    case "vw": {
      return function () {
        return round((vw.get() / 100) * value.arguments[0]);
      };
    }
    case "em": {
      return function () {
        const style = getProp("style");
        if (style && typeof style.fontSize === "number") {
          return round(Number((style.fontSize || 0) * value.arguments[0]));
        }
      };
    }
    case "rem": {
      return function () {
        return round(rem.get() * value.arguments[0]);
      };
    }
    case "rnh": {
      return function () {
        return round(getDimensions("height") * value.arguments[0]);
      };
    }
    case "rnw": {
      return function () {
        return round(getDimensions("width") * value.arguments[0]);
      };
    }
    case "rgb":
    case "rgba": {
      return function () {
        const args = resolve(value.arguments);
        if (args.length === 3) {
          return `rgb(${args.join(", ")})`;
        } else if (args.length === 4) {
          return `rgba(${args.join(", ")})`;
        } else {
          return;
        }
      };
    }
    case "hsla": {
      return function () {
        const args = resolve(value.arguments);
        if (args.length === 3) {
          return `hsl(${args.join(" ")})`;
        } else if (args.length === 4) {
          return `hsla(${args.join(" ")})`;
        } else {
          return;
        }
      };
    }
    case "hairlineWidth": {
      return StyleSheet.hairlineWidth;
    }
    case "platformColor": {
      return PlatformColor(...value.arguments) as unknown as string;
    }
    case "platformSelect": {
      return function () {
        return resolve([Platform.select(value.arguments[0])]);
      };
    }
    case "getPixelSizeForLayoutSize": {
      return function () {
        return PixelRatio.getPixelSizeForLayoutSize(
          Number(resolve(value.arguments[0])),
        );
      };
    }
    case "fontScale": {
      return function () {
        return PixelRatio.getFontScale() * Number(resolve(value.arguments[0]));
      };
    }
    case "pixelScale": {
      return function () {
        return PixelRatio.get() * Number(resolve(value.arguments[0]));
      };
    }
    case "pixelScaleSelect": {
      return function () {
        const specifics = value.arguments[0];
        return resolve(specifics[PixelRatio.get()] ?? specifics["default"]);
      };
    }
    case "fontScaleSelect": {
      return function () {
        const specifics = value.arguments[0];
        return resolve(
          specifics[PixelRatio.getFontScale()] ?? specifics["default"],
        );
      };
    }
    case "roundToNearestPixel": {
      return function () {
        return PixelRatio.roundToNearestPixel(
          Number(resolve(value.arguments[0])),
        );
      };
    }
    default: {
      return function () {
        const args = resolve(value.arguments).join(",");
        return `${value.name}(${args})`;
      };
    }
  }
}

function resolve(
  args:
    | RuntimeValue
    | RuntimeValueDescriptor
    | Array<RuntimeValue | RuntimeValueDescriptor>,
): any {
  let resolved = [];
  if (args === undefined) return;
  if (Array.isArray(args)) {
    for (const arg of args) {
      resolved.push(resolve(arg));
    }
    resolved = resolved.flat(10);
    if (resolved.length === 0) {
      return;
    } else if (resolved.length === 1) {
      return resolved[0];
    } else {
      return resolved;
    }
  } else if (typeof args === "function") {
    return resolve(args());
  } else {
    const value = parseValue(args);
    if (value === undefined || Number.isNaN(value)) return;
    if (typeof value === "function") return resolve(value());
    return value;
  }
}

export function resolveAnimationValue(
  value: RuntimeValueDescriptor,
  prop: string,
  style: Record<string, any> = {},
) {
  if (value === "!INHERIT!") {
    return style[prop] ?? defaultValues[prop];
  } else if (value === "!INITIAL!") {
    return defaultValues[prop];
  } else {
    return resolve(value);
  }
}

function round(number: number) {
  return Math.round((number + Number.EPSILON) * 100) / 100;
}

export function specificityCompare(
  o1: object | RuntimeStyle,
  o2: object | RuntimeStyle,
) {
  // inline styles have no specificity and the order is preserved
  if (!("specificity" in o1) || !("specificity" in o2)) {
    return 0;
  }

  const a = o1.specificity;
  const b = o2.specificity;

  if (a.I !== b.I) {
    // Important
    return a.I - b.I;
  } else if (a.inline !== b.inline) {
    // Inline
    return (a.inline || 0) - (b.inline || 0);
  } else if (a.A !== b.A) {
    // Ids
    return a.A - b.A;
  } else if (a.B !== b.B) {
    // Classes
    return a.B - b.B;
  } else if (a.C !== b.C) {
    // Styles
    return a.C - b.C;
  } else if (a.S !== b.S) {
    // StyleSheet Order
    return a.S - b.S;
  } else if (a.O !== b.O) {
    // Appearance Order
    return a.O - b.O;
  } else {
    // They are the same
    return 0;
  }
}

export const timeToMS = (time: Time) => {
  return time.type === "milliseconds" ? time.value : time.value * 1000;
};

function getProp(name: string): any {
  return interopGlobal.current?.state?.props[name];
}

function getDimensions(
  dimension: "width" | "height" | "both",
  prop = "style",
): any {
  const state = interopGlobal.current?.state!;
  const style = state.props[prop];

  if (dimension === "width") {
    if (typeof style?.width === "number") {
      return style.width;
    } else {
      state.requiresLayoutWidth = true;
      return state.layout?.get()?.[0] ?? 0;
    }
  } else if (dimension === "height") {
    if (typeof style?.height === "number") {
      return style.height;
    } else {
      state.requiresLayoutHeight = true;
      return state.layout?.get()?.[1] ?? 0;
    }
  } else {
    let width = 0;
    let height = 0;
    if (typeof style?.width === "number") {
      width = style.width;
    } else {
      state.requiresLayoutWidth = true;
      width = state.layout?.get()?.[0] ?? 0;
    }
    if (typeof style?.height === "number") {
      height = style.height;
    } else {
      state.requiresLayoutHeight = true;
      height = state.layout?.get()?.[1] ?? 0;
    }
    return { width, height };
  }
}

function getVariable(name: any) {
  return resolve(interopGlobal.current?.state?.getVariable(name));
}

const defaultAnimation: Required<ExtractedAnimations> = {
  name: [],
  direction: ["normal"],
  fillMode: ["none"],
  iterationCount: [{ type: "number", value: 1 }],
  timingFunction: [{ type: "linear" }],
  playState: ["running"],
  duration: [{ type: "seconds", value: 0 }],
  delay: [{ type: "seconds", value: 0 }],
};

const defaultTransition: Required<ExtractedTransition> = {
  property: [],
  duration: [{ type: "seconds", value: 0 }],
  delay: [{ type: "seconds", value: 0 }],
  timingFunction: [{ type: "linear" }],
};

export const defaultValues: Record<
  string,
  AnimatableValue | (() => AnimatableValue)
> = {
  backgroundColor: "transparent",
  borderBottomColor: "transparent",
  borderBottomLeftRadius: 0,
  borderBottomRightRadius: 0,
  borderBottomWidth: 0,
  borderColor: "transparent",
  borderLeftColor: "transparent",
  borderLeftWidth: 0,
  borderRadius: 0,
  borderRightColor: "transparent",
  borderRightWidth: 0,
  borderTopColor: "transparent",
  borderTopWidth: 0,
  borderWidth: 0,
  bottom: 0,
  color: () => {
    return colorScheme.get() === "dark" ? "white" : "black";
  },
  flex: 1,
  flexBasis: 1,
  flexGrow: 1,
  flexShrink: 0,
  fontSize: 14,
  fontWeight: "400",
  gap: 0,
  left: 0,
  lineHeight: 14,
  margin: 0,
  marginBottom: 0,
  marginLeft: 0,
  marginRight: 0,
  marginTop: 0,
  maxHeight: 99999,
  maxWidth: 99999,
  minHeight: 0,
  minWidth: 0,
  opacity: 1,
  padding: 0,
  paddingBottom: 0,
  paddingLeft: 0,
  paddingRight: 0,
  paddingTop: 0,
  perspective: 1,
  right: 0,
  rotate: "0deg",
  rotateX: "0deg",
  rotateY: "0deg",
  rotateZ: "0deg",
  scale: 1,
  scaleX: 1,
  scaleY: 1,
  skewX: "0deg",
  skewY: "0deg",
  top: 0,
  translateX: 0,
  translateY: 0,
  zIndex: 0,
};

function deepEqual(obj1: any, obj2: any) {
  if (obj1 === obj2)
    // it's just the same object. No need to compare.
    return true;

  if (isPrimitive(obj1) && isPrimitive(obj2))
    // compare primitives
    return obj1 === obj2;

  if (Object.keys(obj1).length !== Object.keys(obj2).length) return false;

  // compare objects with same number of keys
  for (let key in obj1) {
    if (!(key in obj2)) return false; //other object doesn't have this prop
    if (!deepEqual(obj1[key], obj2[key])) return false;
  }

  return true;
}

//check if value is primitive
function isPrimitive(obj: any) {
  return obj !== Object(obj);
}

// function cloneObject<T extends object>(obj: T): T {
//   var clone = {} as T;
//   for (var i in obj) {
//     const v = obj[i];
//     if (typeof v == "object" && v != null) clone[i] = cloneObject(v);
//     else clone[i] = v;
//   }
//   return clone;
// }

// Walk an object, resolving any getters
function resolveObject<T extends object>(obj: T) {
  for (var i in obj) {
    const v = obj[i];
    if (typeof v == "object" && v != null) resolveObject(v);
    else obj[i] = typeof v === "function" ? v() : v;
  }
}
