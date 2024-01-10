import {
  SharedValue,
  cancelAnimation,
  makeMutable,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { STYLE_SCOPES } from "../../shared";
import {
  AttributeDependency,
  ExtractedAnimations,
  ExtractedTransition,
  HoistedTypes,
  Layers,
  RuntimeStyle,
} from "../../types";
import {
  Effect,
  Signal,
  createSignal,
  interopGlobal,
  setupEffect,
  teardownEffect,
} from "../signals";
import {
  animationMap,
  externalClassNameCompilerCallback,
  opaqueStyles,
  styleSignals,
} from "./globals";
import {
  getTestAttributeValue,
  testAttribute,
  testContainerQuery,
  testMediaQueries,
  testPseudoClasses,
  testAttributesChanged,
} from "./conditions";
import {
  defaultValues,
  getEasing,
  resolveAnimation,
  resolveObject,
  timeToMS,
} from "./resolve-value";
import type { ComponentState, InheritedParentContext } from "./component-state";

export type PropStateEffect = Effect & {
  getProps(): Record<string, any>;
  getVariable(name: string): any;
  getWidth(): number;
  getHeight(): number;
};

export class PropState {
  effect: PropStateEffect;
  originalProps: Record<string, any> = {};
  props: Record<string, any> = {};
  hoistedStyles: [string, string, HoistedTypes][] = [];
  attrDependencies: AttributeDependency[] = [];

  shouldResolveTarget = false;
  seenVariables = new Set<string>();
  sharedValues = {} as Record<string, SharedValue<any>>;
  animation?: Required<ExtractedAnimations>;
  animationNames = new Set<string>();
  animationWaitingOnLayout = false;
  transition?: Required<ExtractedTransition>;

  constructor(
    private state: ComponentState,
    private parent: InheritedParentContext,
    public target: string,
    public source: string,
    rerender: () => void,
    private nativeStyleToProp: [string, string | true][],
    public id?: string,
    private signal = createSignal<Record<string, any>>({}, id),
  ) {
    this.effect = Object.assign(
      () => {
        this.signal.set(this._update);
        rerender();
      },
      {
        id,
        dependencies: new Set<Signal<any>>(),
        getProps: () => this.props,
        getVariable: (name: string) => state.getVariable(name),
        getWidth: () => {
          state.requiresLayout = true;
          state.layout ??= createSignal<[number, number] | undefined>(
            undefined,
            "layout",
          );
          return state.layout?.get()?.[0] ?? 0;
        },
        getHeight: () => {
          state.requiresLayout = true;
          state.layout ??= createSignal<[number, number] | undefined>(
            undefined,
            "layout",
          );
          return state.layout?.get()?.[1] ?? 0;
        },
      },
    );
  }

  cleanup() {
    this.signal.subscriptions.clear();
    for (const dependency of this.effect.dependencies) {
      dependency.subscriptions.delete(this.effect);
    }
  }

  private previousSource: string | undefined;
  private previousTarget: any;
  getProps(parent: InheritedParentContext, incomingProps: Record<string, any>) {
    const shouldUpdate = Boolean(
      this.parent !== parent ||
        !Object.is(incomingProps[this.source], this.previousSource) ||
        !Object.is(incomingProps[this.target], this.previousTarget) ||
        testAttributesChanged(incomingProps, this.attrDependencies),
    );

    this.parent = parent;
    this.originalProps = incomingProps;

    if (shouldUpdate) {
      interopGlobal.delayUpdates = true;
      this.signal.set(this._update, false);
    }

    return this.signal.peek();
  }

  _update = () => {
    setupEffect(this.effect);
    this.props = {};
    const props = this.props;
    const source = this.source;
    const target = this.target;

    this.previousSource = this.originalProps[source];

    const classNames = this.previousSource;
    const inlineStyles = (this.previousTarget = this.originalProps[target]);

    this.shouldResolveTarget = false;
    this.seenVariables.clear();
    this.hoistedStyles = [];
    this.attrDependencies = [];
    this.animation = undefined as Required<ExtractedAnimations> | undefined;
    this.transition = undefined as Required<ExtractedTransition> | undefined;

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
      this.reduceStyles(props, layers[0], maxScope);
    }

    // Layer 1 - inline
    if (layers[1].length) {
      this.reduceStyles(props, layers[1], maxScope, true);
    }

    // Layer 2 - important
    if (layers[2].length) {
      this.reduceStyles(props, layers[2], maxScope, true);
    }

    if (this.shouldResolveTarget && props[target]) {
      resolveObject(props[target]);
    }

    // Layer 3 & 4 only occur when the target is 'style'
    if (target === "style") {
      const seenAnimatedProps = new Set();

      // Layer 4 - animations
      if (this.animation) {
        const {
          name: animationNames,
          duration: durations,
          delay: delays,
          iterationCount: iterationCounts,
          timingFunction: timingFunctions,
        } = this.animation;

        this.state.isAnimated = true;
        props.style ??= {};
        let names: string[] = [];

        // Always reset if we are waiting on an animation
        let shouldResetAnimations = this.animationWaitingOnLayout;

        for (const name of animationNames) {
          if (name.type === "none") {
            names = [];
            this.animationNames.clear();
            break;
          }

          names.push(name.value);

          if (!this.animationNames.has(name.value)) {
            shouldResetAnimations = true;
          }
        }

        if (shouldResetAnimations) {
          this.animationNames.clear();
          this.animationWaitingOnLayout = false;

          // Loop in reverse order
          for (let index = names.length - 1; index >= 0; index--) {
            const name = names[index % names.length];
            this.animationNames.add(name);

            const animation = animationMap.get(name);
            if (!animation) {
              continue;
            }

            const totalDuration = timeToMS(durations[index % name.length]);
            const delay = timeToMS(delays[index % delays.length]);
            const timingFunction =
              timingFunctions[index % timingFunctions.length];
            const iterationCount =
              iterationCounts[index % iterationCounts.length];
            const iterations =
              iterationCount.type === "infinite" ? -1 : iterationCount.value;

            if (animation.hoistedStyles) {
              this.hoistedStyles.push(...animation.hoistedStyles);
            }

            for (const [key, frames] of Object.entries(animation.frames)) {
              if (seenAnimatedProps.has(key)) continue;
              seenAnimatedProps.add(key);

              const [initialValue, ...sequence] = resolveAnimation(
                frames,
                key,
                props,
                delay,
                totalDuration,
                timingFunction,
              );

              if (
                animation.requiresLayoutWidth ||
                animation.requiresLayoutHeight
              ) {
                const layout = this.state.layout?.peek();
                const needWidth =
                  animation.requiresLayoutWidth &&
                  props.style?.width === undefined &&
                  layout?.[0] === undefined;

                const needHeight =
                  animation.requiresLayoutHeight &&
                  props.style?.height === undefined &&
                  layout?.[1] === undefined;

                if (needWidth || needHeight) {
                  this.state.requiresLayout = true;
                  this.animationWaitingOnLayout = true;
                }
              }

              let sharedValue = this.sharedValues[key];
              if (!sharedValue) {
                sharedValue = makeMutable(initialValue);
                this.sharedValues[key] = sharedValue;
              } else {
                sharedValue.value = initialValue;
              }

              sharedValue.value = withRepeat(
                withSequence(...sequence),
                iterations,
              );

              props[target][key] = sharedValue;
            }
          }
        } else {
          for (const name of names) {
            const keyframes = animationMap.get(name);
            if (!keyframes) {
              continue;
            }

            props[target] ??= {};

            if (keyframes.hoistedStyles) {
              this.hoistedStyles.push(...keyframes.hoistedStyles);
            }

            for (const key of Object.keys(keyframes.frames)) {
              Object.defineProperty(props[target], key, {
                configurable: true,
                enumerable: true,
                value: this.sharedValues[key],
              });
              seenAnimatedProps.add(key);
            }
          }
        }
      }

      // Layer 3 - transitions
      if (this.transition) {
        this.state.isAnimated = true;

        const {
          property: properties,
          duration: durations,
          delay: delays,
          timingFunction: timingFunctions,
        } = this.transition;

        for (let index = 0; index < properties.length; index++) {
          const key = properties[index];

          if (seenAnimatedProps.has(key)) continue;

          let value = props[target]?.[key] ?? defaultValues[key];

          if (typeof value === "function") {
            value = value();
          }

          if (value === undefined) continue;

          seenAnimatedProps.add(key);

          const duration = timeToMS(durations[index % durations.length]);
          const delay = timeToMS(delays[index % delays.length]);
          const easing = timingFunctions[index % timingFunctions.length];

          let sharedValue = this.sharedValues[key];
          if (!sharedValue) {
            sharedValue = makeMutable(value);
            this.sharedValues[key] = sharedValue;
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

          props[target] ??= {};
          props[target][key] = sharedValue;
        }
      }

      // Cleanup any sharedValues that are no longer used
      for (const [key, value] of Object.entries(this.sharedValues)) {
        if (seenAnimatedProps.has(key)) continue;
        cancelAnimation(value);
        value.value = props[target][key] ?? defaultValues[key];
      }
    }

    // The compiler hoists styles, so we need to move them back to the correct prop
    for (let hoisted of this.hoistedStyles) {
      const prop = hoisted[0];
      const key = hoisted[1];
      const targetObj = props[prop];
      if (targetObj && key in targetObj) {
        switch (hoisted[2]) {
          case "transform":
            targetObj.transform ??= [];
            targetObj.transform.push({
              [key]: targetObj[key],
            });
            delete targetObj[key];
            break;
          case "shadow":
            const [type, shadowKey] = key.split(".");
            targetObj[type] ??= {};
            targetObj[type][shadowKey] = targetObj[key];
            delete targetObj[key];
            break;
        }
      }
    }

    // Move any styles to the correct prop
    if (this.nativeStyleToProp) {
      for (let [key, targetProp] of this.nativeStyleToProp) {
        if (targetProp === true) targetProp = key;
        if (props?.style?.[key] === undefined) continue;
        props[targetProp] = props.style[key];
        delete props.style[key];
      }
    }

    teardownEffect(this.effect);

    return props;
  };

  private reduceStyles(
    props: Record<string, any>,
    styles: Array<RuntimeStyle | object>,
    _scope: number,
    treatAsInline = false,
  ) {
    const state = this.state;
    const target = this.target;

    styles.sort((a, b) => specificityCompare(a, b, treatAsInline));

    for (let style of styles) {
      if (!style) continue;
      if (typeof style === "object" && !("$$type" in style)) {
        props[target] ??= {};
        Object.assign(props[target], style);
        continue;
      }

      // If a style could possibly have a variable or a name, create the context
      // This prevent children losing state if a context is suddenly created
      if (style.variables || style.container?.names) {
        if (!state.context) {
          state.resetContext = true;
        }
      }

      if (style.pseudoClasses) {
        if (style.pseudoClasses.active) {
          state.interaction.active ??= createSignal(false, "active");
        }
        if (style.pseudoClasses.hover) {
          state.interaction.hover ??= createSignal(false, "hover");
        }
        if (style.pseudoClasses.focus) {
          state.interaction.focus ??= createSignal(false, "focus");
        }
        if (!testPseudoClasses(this.state, style.pseudoClasses)) {
          continue;
        }
      }

      if (style.media && !testMediaQueries(style.media)) {
        continue;
      }

      if (
        style.containerQuery &&
        !testContainerQuery(this.parent, style.containerQuery)
      ) {
        continue;
      }

      if (style.attrs) {
        let passed = true;
        for (const attrCondition of style.attrs) {
          const attrValue = getTestAttributeValue(
            this.originalProps,
            attrCondition,
          );
          this.attrDependencies.push({
            ...attrCondition,
            previous: attrValue,
          });
          if (!testAttribute(attrValue, attrCondition)) passed = false;
        }

        if (!passed) continue;
      }

      if (style.hoistedStyles) {
        this.hoistedStyles ??= [];
        this.hoistedStyles.push(...style.hoistedStyles);
      }

      if (style.variables) {
        for (const [key, value] of style.variables) {
          this.seenVariables.add(key);
          state.setVariable(key, value);
        }
      }

      if (style.animations) {
        this.animation = Object.assign(
          {},
          defaultAnimation,
          this.animation,
          style.animations,
        );
      }

      if (style.transition) {
        this.transition = Object.assign(
          {},
          defaultTransition,
          this.transition,
          style.transition,
        );
      }

      if (style.container?.names) {
        for (const name of style.container.names) {
          state.setContainer(name);
        }
      }

      if (style.props) {
        this.shouldResolveTarget = true;
        for (let [prop, value] of style.props) {
          // The compiler maps to 'style' by default, but we may be rendering for a different prop
          if (target !== "style" && prop === "style") {
            prop = target;
          }
          if (typeof value === "object" && "$$type" in value) {
            props[prop] = value.value;
          } else if (value !== undefined) {
            if (typeof value === "object") {
              props[prop] ??= {};
              Object.assign(props[prop], value);
            } else {
              props[prop] = value;
            }
          }
        }
      }
    }

    return props;
  }
}

export function specificityCompare(
  o1?: object | RuntimeStyle | null,
  o2?: object | RuntimeStyle | null,
  treatAsInline = false,
) {
  if (!o1) return -1;
  if (!o2) return 1;

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

export const defaultAnimation: Required<ExtractedAnimations> = {
  name: [],
  direction: ["normal"],
  fillMode: ["none"],
  iterationCount: [{ type: "number", value: 1 }],
  timingFunction: [{ type: "linear" }],
  playState: ["running"],
  duration: [{ type: "seconds", value: 0 }],
  delay: [{ type: "seconds", value: 0 }],
};

export const defaultTransition: Required<ExtractedTransition> = {
  property: [],
  duration: [{ type: "seconds", value: 0 }],
  delay: [{ type: "seconds", value: 0 }],
  timingFunction: [{ type: "linear" }],
};
