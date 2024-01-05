import { EasingFunction, Time } from "lightningcss";
import {
  LayoutChangeEvent,
  PixelRatio,
  Platform,
  PlatformColor,
  StyleSheet,
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
import { DEFAULT_CONTAINER_NAME, STYLE_SCOPES } from "../../shared";
import {
  ExtractedAnimations,
  ExtractedTransition,
  Layers,
  NormalizedOptions,
  RuntimeStyle,
  RuntimeValue,
  RuntimeValueDescriptor,
  StyleComputedSharedAttributes,
  StyleEffect,
  StyleEffectOptions,
  StyleEffectParent,
  StyleEffectUpdateOptions,
} from "../../types";
import {
  Signal,
  createSignal,
  interopGlobal,
  setupEffect,
  teardownEffect,
} from "../signals";
import {
  animationMap,
  colorScheme,
  externalClassNameCompilerCallback,
  globalVariables,
  opaqueStyles,
  rem,
  rootContext,
  styleSignals,
  vh,
  vw,
} from "./globals";
import {
  getTestAttributeValue,
  testAttribute,
  testMediaQueries,
  testPseudoClasses,
} from "./conditions";
import { createContext } from "react";

export const styleEffectContext = createContext(rootContext);
export const StyleEffectContextProvider = styleEffectContext.Provider;

export function getStyleStateFn(
  parent: any,
  rerender: () => void,
  options: NormalizedOptions,
) {
  const sourceSignals = new Set<ReturnType<typeof createStyleComputed>>();
  const inlineVariables = new Map<string, Signal<any>>();
  const inlineVariablesToRemove = new Set<string>();
  const containerNames = new Set<string>();

  /**
   * Updating the context will rerender all child components, so we try to limit t.
   * We only need to do so if the parent changes, a new variable/container-name is added
   */
  let shouldUpdateContext = false;

  // These values are persisted across renders and used for all source signals
  const shared: StyleComputedSharedAttributes = {
    interaction: {},
    parent,
    getVariable(name) {
      let value: any = undefined;
      value ??= inlineVariables.get(name)?.get();
      value ??= globalVariables.universal.get(name)?.get();
      value ??= shared.parent.getVariable(name);
      return value;
    },
    setVariable(name: string, value: any) {
      inlineVariablesToRemove.delete(name);
      const existing = inlineVariables.get(name);
      if (!existing) {
        shouldUpdateContext = true;
        inlineVariables.set(name, createSignal(value, name));
      } else {
        existing.set(value);
      }
    },
    getContainer(name: string) {
      if (
        shared.container &&
        (containerNames.has(name) || name === DEFAULT_CONTAINER_NAME)
      ) {
        return shared.container.get();
      } else {
        return shared.parent.getContainer(name);
      }
    },
    setContainer(name: string) {
      if (!shared.container) {
        shouldUpdateContext = true;
        shared.container = createSignal<StyleEffectParent>(shared, name);
      }
      containerNames.add(name);
    },
  };

  for (const [target, source, nativeStyleToProp] of options.config) {
    const computed = createStyleComputed({
      parent,
      target,
      source,
      shared,
      rerender,
      nativeStyleToProp: Object.entries(nativeStyleToProp || {}),
    });

    sourceSignals.add(computed);
  }

  let convertToPressable = false;
  let context: StyleEffectParent | undefined;

  function update(parent: any, originalProps: any) {
    const props = { ...originalProps };
    let hasActive = false;
    let hasFocus = false;
    let hasHover = false;
    let requiresLayout = false;

    const parentChanged = shared.parent !== parent;
    shared.parent = parent;
    shouldUpdateContext = false;

    /**
     * We want to preserve any inline variables that are still being used
     * as they are tracking their dependencies. So we mark all existing
     * and remove them only when they are no longer used.
     */
    inlineVariablesToRemove.clear();
    for (const previousInlineVariable of inlineVariables.keys()) {
      inlineVariablesToRemove.add(previousInlineVariable);
    }

    /**
     * Clear the container names, so we can check if any are still being used
     */
    containerNames.clear();

    for (const signal of sourceSignals) {
      signal.updateDuringRender({ parent, props });
      Object.assign(props, signal.props);
      if (signal.target !== signal.source) {
        delete props[signal.source];
      }

      const hasContainer = Boolean(shared.container);
      hasActive ||= Boolean(shared.interaction.active) || hasContainer;
      hasFocus ||= Boolean(shared.interaction.focus) || hasContainer;
      hasHover ||= Boolean(shared.interaction.hover) || hasContainer;
      convertToPressable ||= hasActive || hasFocus || hasHover;
      requiresLayout ||=
        signal.requiresLayoutWidth ||
        signal.requiresLayoutHeight ||
        signal.animationWaitingOnLayout;

      for (const name of inlineVariablesToRemove) {
        /**
         * NOTE: we don't have to update the context here
         * because we set the value to undefined, which will
         * cause a rerender anyway
         */
        inlineVariables.get(name)?.set(undefined);
        inlineVariables.delete(name);
      }
    }

    if (hasActive) {
      props.onPressIn = (event: unknown) => {
        originalProps.onPressIn?.(event);
        shared.interaction.active!.set(true);
      };
      props.onPressOut = (event: unknown) => {
        originalProps.onPressOut?.(event);
        shared.interaction.active!.set(false);
      };
    }

    if (hasHover) {
      props.onHoverIn = (event: unknown) => {
        originalProps.onHoverIn?.(event);
        shared.interaction.hover!.set(true);
      };
      props.onHoverOut = (event: unknown) => {
        originalProps.onHoverOut?.(event);
        shared.interaction.hover!.set(false);
      };
    }

    if (hasFocus) {
      props.onFocus = (event: unknown) => {
        originalProps.onFocus?.(event);
        shared.interaction.focus!.set(true);
      };
      props.onBlur = (event: unknown) => {
        originalProps.onBlur?.(event);
        shared.interaction.focus!.set(false);
      };
    }

    if (convertToPressable) {
      // This is an annoying quirk of RN. Pressable will only work if onPress is defined
      props.onPress = originalProps.onPress ?? (() => {});
    }

    if (requiresLayout) {
      props.onLayout ??= (event: LayoutChangeEvent) => {
        originalProps.onLayout?.(event);

        if (!shared.layout) {
          // The first time this is called, we need to create the signal and rerender the component
          shared.layout = createSignal<[number, number] | undefined>(undefined);
          rerender();
        }

        const layout = event.nativeEvent.layout;
        const [width, height] = shared.layout!.peek() ?? [0, 0];
        if (layout.width !== width || layout.height !== height) {
          shared.layout!.set([layout.width, layout.height]);
        }
      };
    }

    if (containerNames.size === 0) {
      shared.container?.set(undefined);
      shouldUpdateContext = true;
    }

    if (
      !shouldUpdateContext &&
      parentChanged &&
      (inlineVariables.size || containerNames.size)
    ) {
      shouldUpdateContext = true;
    }

    if (shouldUpdateContext) {
      context = { ...shared };
    }

    return { props, context, convertToPressable };
  }

  function cleanup() {
    for (const signal of sourceSignals) {
      signal.subscriptions.clear();
      for (const dependency of signal.dependencies) {
        dependency.subscriptions.delete(signal);
      }
      signal.dependencies.clear();
    }
  }

  return {
    update,
    cleanup,
  };
}

export function createStyleComputed({
  parent,
  source,
  target,
  id,
  rerender,
  nativeStyleToProp,
  shared,
}: Omit<StyleEffectOptions, "props"> & {
  shared: StyleComputedSharedAttributes;
}) {
  const effect: StyleEffect = Object.assign(
    function () {
      setupEffect(effect);
      effect.set(effect.fn);
      teardownEffect(effect);
      rerender();
    },
    createSignal({}, id),
    {
      ...shared,
      rerender,
      dependencies: new Set<Signal<any>>(),
      parent,
      source,
      target,
      props: {},
      originalProps: {},
      requiresLayoutWidth: false,
      requiresLayoutHeight: false,
      isAnimated: false,
      animationWaitingOnLayout: false,
      animationNames: new Set<string>(),
      attrDependencies: [],
      sharedValues: {},
      shouldUpdateContext: false,
      inlineVariablesToRemove: new Set<string>(),
      inlineVariables: new Map<string, Signal<any>>(),
      containerNames: new Set<string>(),
      updateDuringRender: (incoming: StyleEffectUpdateOptions) => {
        const current = effect.peek();

        if (
          incoming.parent !== effect.parent ||
          incoming.props[source] !== effect.props[source] ||
          incoming.props[target] !== effect.props[target]
        ) {
          effect.parent = incoming.parent;
          effect.props = { ...incoming.props };
          effect.originalProps = incoming.props;

          setupEffect(effect);
          interopGlobal.delayUpdates = true;
          effect.set(effect.fn, false);
          interopGlobal.delayUpdates = false;
          teardownEffect(effect);
        }

        return current;
      },
      fn: () => {
        const classNames = effect.props[source];
        const inlineStyles = effect.props[target];

        effect.shouldUpdateContext = false;
        effect.inlineVariablesToRemove = new Set(effect.inlineVariables.keys());
        effect.props = {};
        effect.attrDependencies = [];

        let maxScope = STYLE_SCOPES.GLOBAL;
        const layers: Layers = {
          classNames,
          0: [],
          1: [],
          2: [],
        };

        if (classNames) {
          externalClassNameCompilerCallback.current?.(classNames);
          for (const className of classNames.split(/\s+/)) {
            let signal = styleSignals.get(className);
            if (!signal) continue;
            const meta = signal.get();
            maxScope = Math.max(maxScope, meta.scope);
            if (meta[0]) layers[0].push(...meta[0]);
            if (meta[1]) layers[1].push(...meta[1]);
            if (meta[2]) layers[2].push(...meta[2]);
          }
        }

        if (inlineStyles) {
          if (Array.isArray(inlineStyles)) {
            for (let style of inlineStyles.flat(10)) {
              if (opaqueStyles.has(style)) {
                const opaqueStyle = opaqueStyles.get(style)!;
                maxScope = Math.max(maxScope, opaqueStyle.scope);
                // Layer 0 is upgraded to layer 1
                if (opaqueStyle[0]) {
                  layers[1].push(...opaqueStyle[0]);
                }
                if (opaqueStyle[1]) {
                  layers[1].push(...opaqueStyle[1]);
                }
                if (opaqueStyle[2]) {
                  layers[2].push(...opaqueStyle[2]);
                }
              } else {
                layers[1].push(style);
              }
            }
          } else {
            if (opaqueStyles.has(inlineStyles)) {
              const opaqueStyle = opaqueStyles.get(inlineStyles)!;
              maxScope = Math.max(maxScope, opaqueStyle.scope);
              // Layer 0 is upgraded to layer 1
              if (opaqueStyle[0]) {
                layers[1].push(...opaqueStyle[0]);
              }
              if (opaqueStyle[1]) {
                layers[1].push(...opaqueStyle[1]);
              }
              if (opaqueStyle[2]) {
                layers[2].push(...opaqueStyle[2]);
              }
            } else {
              layers[1].push(inlineStyles);
            }
          }
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

        // Layer 0 - className
        if (layers[0].length) {
          reduceStyles(effect, layers[0], maxScope);
        }

        // Layer 1 - inline
        if (layers[1].length) {
          reduceStyles(effect, layers[1], maxScope, true);
        }

        // Layer 2 - important
        if (layers[2].length) {
          reduceStyles(effect, layers[2], maxScope, true);
        }

        if (effect.props[effect.target]) {
          resolveObject(effect.props[effect.target]);
        }

        // Layer 3 & 4 only occur when the target is 'style'
        if (target === "style") {
          const styleProp = effect.props["style"];
          if (styleProp && typeof styleProp.width === "number") {
            effect.requiresLayoutWidth = false;
          }
          if (styleProp && typeof styleProp.height === "number") {
            effect.requiresLayoutHeight = false;
          }

          const seenAnimatedProps = new Set();

          // Layer 4 - animations
          if (effect.animations) {
            const {
              name: animationNames,
              duration: durations,
              delay: delays,
              iterationCount: iterationCounts,
              timingFunction: timingFunctions,
            } = effect.animations;

            effect.isAnimated = true;

            effect.props.style ??= {};

            let names: string[] = [];
            let shouldResetAnimations = effect.animationWaitingOnLayout;

            for (const name of animationNames) {
              if (name.type === "none") {
                names = [];
                effect.animationNames.clear();
                break;
              }

              names.push(name.value);

              if (!effect.animationNames.has(name.value)) {
                shouldResetAnimations = true;
              }
            }

            if (shouldResetAnimations) {
              effect.animationNames.clear();
              effect.animationWaitingOnLayout = false;

              // Loop in reverse order
              for (let index = names.length - 1; index >= 0; index--) {
                const name = names[index % names.length];
                effect.animationNames.add(name);

                const keyframes = animationMap.get(name);
                if (!keyframes) {
                  continue;
                }

                const totalDuration = timeToMS(durations[index % name.length]);
                const delay = timeToMS(delays[index % delays.length]);
                const timingFunction =
                  timingFunctions[index % timingFunctions.length];
                const iterationCount =
                  iterationCounts[index % iterationCounts.length];
                const iterations =
                  iterationCount.type === "infinite"
                    ? -1
                    : iterationCount.value;

                if (keyframes.hoistedStyles) {
                  effect.hoistedStyles ??= [];
                  effect.hoistedStyles.push(...keyframes.hoistedStyles);
                }

                for (const [key, [initialFrame, ...frames]] of Object.entries(
                  keyframes.frames,
                )) {
                  if (seenAnimatedProps.has(key)) continue;
                  seenAnimatedProps.add(key);

                  const initialValue = resolveAnimationValue(
                    initialFrame.value,
                    key,
                    effect.props.style,
                  );

                  const sequence = frames.map((frame) => {
                    return withDelay(
                      delay,
                      withTiming(
                        resolveAnimationValue(
                          frame.value,
                          key,
                          effect.props.style,
                        ),
                        {
                          duration: totalDuration * frame.progress,
                          easing: getEasing(timingFunction),
                        },
                      ),
                    );
                  }) as [AnimatableValue, ...AnimatableValue[]];

                  effect.animationWaitingOnLayout =
                    (effect.requiresLayoutWidth ||
                      effect.requiresLayoutHeight) &&
                    !effect.layout?.peek();

                  let sharedValue = effect.sharedValues[key];
                  if (!sharedValue) {
                    sharedValue = makeMutable(initialValue);
                    effect.sharedValues[key] = sharedValue;
                  } else {
                    sharedValue.value = initialValue;
                  }

                  sharedValue.value = withRepeat(
                    withSequence(...sequence),
                    iterations,
                  );

                  effect.props[target][key] = sharedValue;
                }
              }
            } else {
              for (const name of names) {
                const keyframes = animationMap.get(name);
                if (!keyframes) {
                  continue;
                }

                effect.props[target] ??= {};

                if (keyframes.hoistedStyles) {
                  effect.hoistedStyles ??= [];
                  effect.hoistedStyles.push(...keyframes.hoistedStyles);
                }

                for (const key of Object.keys(keyframes.frames)) {
                  Object.defineProperty(effect.props[target], key, {
                    configurable: true,
                    enumerable: true,
                    value: effect.sharedValues[key],
                  });
                  seenAnimatedProps.add(key);
                }
              }
            }
          }

          // Layer 3 - transitions
          if (effect.transition) {
            effect.isAnimated = true;

            const {
              property: properties,
              duration: durations,
              delay: delays,
              timingFunction: timingFunctions,
            } = effect.transition;

            for (let index = 0; index < properties.length; index++) {
              const key = properties[index];

              if (seenAnimatedProps.has(key)) continue;

              let value = effect.props[target][key] ?? defaultValues[key];

              if (typeof value === "function") {
                value = value();
              }

              if (value === undefined) continue;

              seenAnimatedProps.add(key);

              const duration = timeToMS(durations[index % durations.length]);
              const delay = timeToMS(delays[index % delays.length]);
              const easing = timingFunctions[index % timingFunctions.length];

              let sharedValue = effect.sharedValues[key];
              if (!sharedValue) {
                sharedValue = makeMutable(value);
                effect.sharedValues[key] = sharedValue;
              }

              if (value !== sharedValue.value) {
                sharedValue.value = withDelay(
                  delay,
                  withTiming(value, {
                    duration,
                    easing: getEasing(easing),
                  }),
                );
              }

              Object.defineProperty(effect.props[target], key, {
                configurable: true,
                enumerable: true,
                value: sharedValue,
              });
            }
          }

          // Cleanup any sharedValues that are no longer used
          for (const [key, value] of Object.entries(effect.sharedValues)) {
            if (seenAnimatedProps.has(key)) continue;
            cancelAnimation(value);
            value.value = effect.props[target][key] ?? defaultValues[key];
          }
        }

        // The compiler hoists styles, so we need to move them back to the correct prop
        if (effect.hoistedStyles) {
          for (let hoisted of effect.hoistedStyles) {
            const prop = hoisted[0];
            const key = hoisted[1];
            if (effect.props[prop] && key in effect.props[prop]) {
              switch (hoisted[2]) {
                case "transform":
                  effect.props[prop].transform ??= [];
                  effect.props[prop].transform.push({
                    [key]: effect.props[prop][key],
                  });
                  delete effect.props[prop][key];
                  break;
                case "shadow":
                  const [type, shadowKey] = key.split(".");
                  effect.props[prop][type] ??= {};
                  effect.props[prop][type][shadowKey] = effect.props[prop][key];
                  delete effect.props[prop][key];
                  break;
              }
            }
          }
        }

        // Move any styles to the correct prop
        if (nativeStyleToProp) {
          for (let [key, targetProp] of nativeStyleToProp) {
            if (targetProp === true) targetProp = key;
            if (effect.props?.style?.[key] === undefined) continue;
            effect.props[targetProp] = effect.props.style[key];
            delete effect.props.style[key];
          }
        }

        // TODO: We should check if the styles actually changed
        // Right now we just force an update
        return {};
      },
    },
  );
  return effect;
}

// Walk an object, resolving any getters
function resolveObject<T extends object>(obj: T) {
  for (var i in obj) {
    const v = obj[i];
    if (typeof v == "object" && v != null) resolveObject(v);
    else obj[i] = typeof v === "function" ? v() : v;
  }
}

export function reduceStyles(
  effect: StyleEffect,
  styles: Array<RuntimeStyle | object>,
  _scope: number,
  treatAsInline = false,
) {
  styles.sort((a, b) => specificityCompare(a, b, treatAsInline));

  for (let style of styles) {
    if (!style) continue;
    if (typeof style === "object" && !("$$type" in style)) {
      effect.props[effect.target] ??= {};
      Object.assign(effect.props[effect.target], style);
      continue;
    }

    // If a style could possibly have a variable or a name, create the context
    // This prevent children losing state if a context is suddenly created
    if (style.variables || style.container?.names) {
      effect.context ??= effect;
    }

    if (style.pseudoClasses) {
      if (style.pseudoClasses.active) {
        effect.interaction.active ??= createSignal(false);
      }
      if (style.pseudoClasses.hover) {
        effect.interaction.hover ??= createSignal(false);
      }
      if (style.pseudoClasses.focus) {
        effect.interaction.focus ??= createSignal(false);
      }
      if (!testPseudoClasses(effect, style.pseudoClasses)) {
        continue;
      }
    }

    if (style.media && !testMediaQueries(style.media)) {
      continue;
    }

    // if (
    //   style.containerQuery &&
    //   !testContainerQuery(effect, style.containerQuery)
    // ) {
    //   continue;
    // }

    if (style.attrs) {
      let passed = true;
      for (const attrCondition of style.attrs) {
        const attrValue = getTestAttributeValue(
          effect.originalProps,
          attrCondition,
        );
        effect.attrDependencies.push({ ...attrCondition, previous: attrValue });
        if (!testAttribute(attrValue, attrCondition)) passed = false;
      }

      if (!passed) continue;
    }

    if (style.hoistedStyles) {
      effect.hoistedStyles ??= [];
      effect.hoistedStyles.push(...style.hoistedStyles);
    }

    if (style.variables) {
      for (const [key, value] of style.variables) {
        effect.setVariable(key, value, style.specificity);
      }
    }

    if (style.animations) {
      effect.animations = {
        ...defaultAnimation,
        ...effect.animations,
        ...style.animations,
      };
    }

    if (style.transition) {
      effect.transition = {
        ...defaultTransition,
        ...effect.transition,
        ...style.transition,
      };
    }

    // if (style.container?.names) {
    //   effect.requiresLayoutWidth = true;
    //   effect.requiresLayoutHeight = true;
    //   effect.hasContainer = true;
    //   for (const name of style.container.names) {
    //     effect.setContainer(name);
    //   }
    // }

    if (style.props) {
      for (let [prop, value] of style.props) {
        // The compiler maps to 'style' by default, but we may be rendering for a different prop
        if (effect.target !== "style" && prop === "style") {
          prop = effect.target;
        }
        if (typeof value === "object" && "$$type" in value) {
          effect.props[prop] = value.value;
        } else if (value !== undefined) {
          if (typeof value === "object") {
            effect.props[prop] ??= {};
            Object.assign(effect.props[prop], value);
          } else {
            effect.props[prop] = value;
          }
        }
      }
    }
  }

  return effect;
}

export function parseValue(
  value: RuntimeValueDescriptor | string | number | boolean,
): RuntimeValue {
  if (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
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
        debugger;
        return round((vw.get() / 100) * value.arguments[0]);
      };
    }
    case "em": {
      return function () {
        const style = getCurrentEffect().props["style"];
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

function getCurrentEffect() {
  return interopGlobal.current as StyleEffect;
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

function getVariable(name: any) {
  return resolve(getCurrentEffect().getVariable(name));
}

function resolveAnimationValue(
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

const timeToMS = (time: Time) => {
  return time.type === "milliseconds" ? time.value : time.value * 1000;
};

function round(number: number) {
  return Math.round((number + Number.EPSILON) * 100) / 100;
}

function getDimensions(
  dimension: "width" | "height" | "both",
  prop = "style",
): any {
  const effect = getCurrentEffect();
  const style = effect.props[prop];

  if (dimension === "width") {
    if (typeof style?.width === "number") {
      return style.width;
    } else {
      effect.requiresLayoutWidth = true;
      return effect.layout?.get()?.[0] ?? 0;
    }
  } else if (dimension === "height") {
    if (typeof style?.height === "number") {
      return style.height;
    } else {
      effect.requiresLayoutHeight = true;
      return effect.layout?.get()?.[1] ?? 0;
    }
  } else {
    let width = 0;
    let height = 0;
    if (typeof style?.width === "number") {
      width = style.width;
    } else {
      effect.requiresLayoutWidth = true;
      width = effect.layout?.get()?.[0] ?? 0;
    }
    if (typeof style?.height === "number") {
      height = style.height;
    } else {
      effect.requiresLayoutHeight = true;
      height = effect.layout?.get()?.[1] ?? 0;
    }
    return { width, height };
  }
}

function getEasing(timingFunction: EasingFunction) {
  switch (timingFunction.type) {
    case "ease":
      return Easing.ease;
    case "ease-in":
      return Easing.in(Easing.quad);
    case "ease-out":
      return Easing.out(Easing.quad);
    case "ease-in-out":
      return Easing.inOut(Easing.quad);
    case "linear":
      return Easing.linear;
    case "cubic-bezier":
      return Easing.bezier(
        timingFunction.x1,
        timingFunction.y1,
        timingFunction.x2,
        timingFunction.y2,
      );
    default:
      return Easing.linear;
  }
}

export function specificityCompare(
  o1: object | RuntimeStyle,
  o2: object | RuntimeStyle,
  treatAsInline = false,
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
  } else if (!treatAsInline && a.inline !== b.inline) {
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
