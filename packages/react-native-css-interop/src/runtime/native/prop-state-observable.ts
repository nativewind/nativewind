import { ComponentState } from "react";
import {
  SharedValue,
  cancelAnimation,
  makeMutable,
  withRepeat,
  withSequence,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import {
  InteropComponentConfig,
  ExtractedAnimations,
  ExtractedTransition,
  StyleDeclaration,
} from "../../types";
import { Effect, cleanupEffect } from "../observable";
import { universalVariables } from "./globals";
import { UpgradeState } from "./render-component";
import {
  resolveValue,
  defaultValues,
  timeToMS,
  resolveAnimation,
  setDeep,
  resolveTransitionValue,
  getEasing,
} from "./resolve-value";
import { StyleRuleObservable } from "./style-rule-observable";
import { animationMap } from "./stylesheet";

/**
 * An observable that holds the current state for a prop
 */
export class PropStateObservable implements Effect {
  public dependencies: Set<() => void> = new Set();
  private styleRule: StyleRuleObservable;

  // props to be passed to the component
  public props: Record<string, any> = {};
  public variables: Record<string, any> = {};
  public containerNames: false | string[] | undefined;

  // a flattened version of the props, used for comparison and lookups
  public normalizedProps: Record<string, any> = {};
  private variableTracking = new Map<string, any>();
  private containerTracking = new Map<string, any>();

  private animationWaitingOnLayout = false;
  private animationNames = new Set<string>();
  private sharedValues = new Map<string, SharedValue<any>>();

  constructor(
    public config: InteropComponentConfig,
    public componentState: ComponentState,
    private inheritedVariables: Record<string, any>,
    private inheritedContainers: Record<string, any>,
  ) {
    this.rerun = this.rerun.bind(this);
    this.styleRule = new StyleRuleObservable(
      config.source,
      config.target,
      componentState,
      inheritedContainers,
      this.rerun,
    );
  }

  cleanup() {
    this.styleRule.cleanup();
    cleanupEffect(this);
    for (const value of this.sharedValues.values()) {
      cancelAnimation(value);
    }
  }

  getActive() {
    return this.componentState.getActive(this);
  }

  getHover() {
    return this.componentState.getActive(this);
  }

  getFocus() {
    return this.componentState.getActive(this);
  }

  getCSSVariable(name: string, style?: Record<string, any>) {
    if (!name) return;
    let value: any = undefined;
    value ??= this.styleRule.variables[name];
    value ??= universalVariables[name]?.get(this);
    if (value === undefined) {
      value = this.inheritedVariables[name];
      if (typeof value === "object" && "get" in value) {
        value = value.get(this);
      }
      this.variableTracking.set(name, value);
    }
    return resolveValue(this, value, style);
  }

  getContainer(name: string) {
    if (!name) return;
    const value = this.inheritedContainers[name];
    this.containerTracking.set(name, value);
    return value;
  }

  updateDuringRender(
    originalProps: Record<string, any>,
    variables: Record<string, any>,
    containers: Record<string, any>,
  ) {
    this.inheritedVariables = variables;
    this.inheritedContainers = containers;

    // Did our style rules update?
    let didUpdate = this.styleRule.updateDuringRender(
      originalProps,
      containers,
    );

    // What about the inherited variables?
    didUpdate ||= [...this.variableTracking.entries()].some(
      (entry) => variables[entry[0]] !== entry[1],
    );

    if (didUpdate) {
      this.rerun(true);
    }
  }

  /**
   * update can be called either during rendering, or by the StyleRuleObservable when something changes
   * @param isRendering
   */
  rerun(isRendering = false) {
    this.variables = this.styleRule.variables;
    this.containerNames = this.styleRule.containerNames;

    const props: Record<string, any> = {};
    const normalizedProps: Record<string, any> = {};
    const delayedValues: (() => void)[] = [];

    this.processDeclarations(
      this.styleRule.declarations,
      props,
      normalizedProps,
      delayedValues,
    );

    const seenAnimatedProps = new Set<string>();

    if (this.styleRule.animation) {
      this.processAnimations(
        props,
        normalizedProps,
        seenAnimatedProps,
        this.styleRule.animation,
      );
    }

    this.processDeclarations(
      this.styleRule.importantDeclarations,
      props,
      normalizedProps,
      delayedValues,
    );

    if (this.styleRule.transition) {
      this.processTransition(
        props,
        normalizedProps,
        seenAnimatedProps,
        this.styleRule.transition,
      );
    }

    for (const delayed of delayedValues) {
      delayed();
    }

    /**
     * If a sharedValue is not 'seen' by an animation or transition it should have it's animation cancelled
     * and value reset to the current type or default value.
     */
    for (const entry of this.sharedValues) {
      if (seenAnimatedProps.has(entry[0])) continue;
      entry[1].value =
        this.normalizedProps[entry[0]] ?? defaultValues[entry[0]];
    }

    if (this.config.target === "style" && this.config.nativeStyleToProp) {
      for (let move of Object.entries(this.config.nativeStyleToProp)) {
        const source = move[0];
        const sourceValue = props[this.config.target]?.[source];
        if (sourceValue === undefined) continue;
        const targetProp = move[1] === true ? move[0] : move[1];
        props[targetProp] = sourceValue;
        delete props[this.config.target][source];
      }
    }

    this.props = props;

    // We changed while not rerendering (e.g from a Media Query), so we need to notify React
    if (!isRendering) {
      this.componentState.rerender();
    }
  }

  processAnimations(
    props: Record<string, any>,
    normalizedProps: Record<string, any>,
    seenAnimatedProps: Set<string>,
    {
      name: animationNames,
      duration: durations,
      delay: delays,
      iterationCount: iterationCounts,
      timingFunction: easingFuncs,
    }: Required<ExtractedAnimations>,
  ) {
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

      if (
        this.animationNames.size === 0 || // If there were no previous animations
        !this.animationNames.has(name.value) // Or there is a new animation
      ) {
        shouldResetAnimations = true; // Then reset everything
      }
    }

    /*
     * Animations should only be updated if the animation name changes
     */
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
        const easingFunction = easingFuncs[index % easingFuncs.length];
        const iterations = iterationCounts[index % iterationCounts.length];

        for (const frame of animation.frames) {
          const animationKey = frame[0];
          const valueFrames = frame[1].values;
          const pathTokens = frame[1].pathTokens;

          if (seenAnimatedProps.has(animationKey)) continue;
          seenAnimatedProps.add(animationKey);

          const [initialValue, ...sequence] = resolveAnimation(
            this,
            valueFrames,
            animationKey,
            props,
            normalizedProps,
            delay,
            totalDuration,
            easingFunction,
          );

          if (animation.requiresLayoutWidth || animation.requiresLayoutHeight) {
            const needWidth =
              animation.requiresLayoutWidth &&
              props.style?.width === undefined &&
              this.componentState.getLayout(this)[0] === 0;

            const needHeight =
              animation.requiresLayoutHeight &&
              props.style?.height === undefined &&
              this.componentState.getLayout(this)[1] === 0;

            if (needWidth || needHeight) {
              this.animationWaitingOnLayout = true;
            }
          }

          let sharedValue = this.sharedValues.get(animationKey);
          if (!sharedValue) {
            sharedValue = makeMutable(initialValue);
            this.sharedValues.set(animationKey, sharedValue);
          } else {
            sharedValue.value = initialValue;
          }

          sharedValue.value = withRepeat(
            withSequence(...sequence),
            iterations.type === "infinite" ? -1 : iterations.value,
          );

          setDeep(props, pathTokens, sharedValue);
        }
      }
    } else {
      for (const name of names) {
        const keyframes = animationMap.get(name);
        if (!keyframes) continue;

        props[this.config.target] ??= {};

        for (const [animationKey, { pathTokens }] of keyframes.frames) {
          setDeep(props, pathTokens, this.sharedValues.get(animationKey));
          seenAnimatedProps.add(animationKey);
        }
      }
    }
  }

  processTransition(
    props: Record<string, any>,
    normalizedProps: Record<string, any>,
    seenAnimatedProps: Set<string>,
    {
      property: properties,
      duration: durations,
      delay: delays,
      timingFunction: timingFunctions,
    }: Required<ExtractedTransition>,
  ) {
    /**
     * If there is a 'none' transition we should skip this logic.
     * In the sharedValues cleanup step the animation will be cancelled as the properties were not seen.
     */
    if (!properties.includes("none")) {
      for (let index = 0; index < properties.length; index++) {
        const property = properties[index];
        if (seenAnimatedProps.has(property)) continue;
        let sharedValue = this.sharedValues.get(property);
        let { value, defaultValue } = resolveTransitionValue(
          this,
          props,
          normalizedProps,
          property,
        );
        if (value === undefined && !sharedValue) {
          // We have never seen this value, and its undefined so do nothing
          continue;
        } else if (!sharedValue) {
          // First time seeing this value. On the initial render don't transition,
          // otherwise transition from the default value
          const initialValue =
            this.componentState.upgrades.animated < UpgradeState.UPGRADED &&
            value !== undefined
              ? value
              : defaultValue;

          sharedValue = makeMutable(initialValue);
          this.sharedValues.set(property, sharedValue);
        } else if (value === undefined) {
          // We previously saw this value, but now its gone
          value = defaultValue;
        }
        seenAnimatedProps.add(property);
        const duration = timeToMS(durations[index % durations.length]);
        const delay = timeToMS(delays[index % delays.length]);
        const easing = timingFunctions[index % timingFunctions.length];
        if (value !== sharedValue.value) {
          sharedValue.value = withDelay(
            delay,
            withTiming(value, {
              duration,
              easing: getEasing(easing),
            }),
          );
        }
        setDeep(props.style, [property], sharedValue);
      }
    }
  }

  processDeclarations(
    declarations: StyleDeclaration[],
    props: Record<string, any>,
    normalizedProps: Record<string, any>,
    delayedValues: (() => void)[],
  ) {
    for (const declaration of declarations) {
      if (Array.isArray(declaration)) {
        if (declaration.length === 2) {
          const prop =
            declaration[0] === "style" ? this.config.target : declaration[0];

          if (typeof declaration[1] === "object") {
            props[prop] ??= {};
            Object.assign(props[prop], declaration[1]);
          } else {
            props[prop] = declaration[1];
          }
        } else {
          // em / rnw / rnh units use other declarations, so we need to delay them
          if (typeof declaration[2] === "object" && declaration[2].delay) {
            delayedValues.push(() => {
              const value = resolveValue(
                this,
                declaration[2],
                props[this.config.target],
              );
              setDeep(props, declaration[1], value);
              normalizedProps[declaration[0]] = value;
            });
          } else {
            const value = resolveValue(
              this,
              declaration[2],
              props[this.config.target],
            );
            setDeep(props, declaration[1], value);
            normalizedProps[declaration[0]] = value;
          }
        }
      } else {
        props[this.config.target] ??= {};
        Object.assign(props[this.config.target], declaration);
      }
    }
  }
}
