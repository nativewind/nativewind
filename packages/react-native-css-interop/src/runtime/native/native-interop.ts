import {
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from "react";
import { LayoutChangeEvent, View } from "react-native";
import {
  ReactComponent,
  InteropComponentConfig,
  StyleRule,
  Specificity,
  ProcessedStyleRules,
  StyleRuleSet,
  ExtractedAnimations,
  ExtractedTransition,
  ContainerRecord,
} from "../../types";
import { containerContext } from "./globals";
import { UpgradeState, renderComponent } from "./render-component";
import { testRule } from "./conditions";
import {
  SharedState,
  ReducerAction,
  ReducerState,
  Refs,
  ProcessedStyleDeclaration,
} from "./types";
import { Effect, cleanupEffect, observable } from "../observable";
import {
  defaultValues,
  getEasing,
  getHeight,
  getWidth,
  resolveAnimation,
  resolveTransitionValue,
  resolveValue,
  timeToMS,
} from "./resolve-value";

import {
  VariableContext,
  getAnimation,
  getOpaqueStyles,
  getStyle,
} from "./styles";
import { DEFAULT_CONTAINER_NAME } from "../../shared";

export function interop(
  component: ReactComponent<any>,
  configs: InteropComponentConfig[],
  originalProps: Record<string, any> | null,
  ref: any,
): ReactNode {
  // These are inherited from the parent components
  const inheritedVariables = useContext(VariableContext);
  const inheritedContainers = useContext(containerContext);

  const props = { ...originalProps };

  /*
   * Holds the shared state between all the configs
   * This value is mutated between renders and changes should not cause a re-render
   * While this is a React anti-pattern, the changes are only additive and should be
   * shared across all Renders
   *
   * For example 'upgrades' should be set during the initial render - even if that render fails
   * The other attributes are observables which are 'global' across renders and each render should
   * manage their own setup/cleanup
   */
  const sharedState = useState<SharedState>({
    originalProps,
    props: {},
    guardsEnabled: false,
    canUpgradeWarn: false,
    animated: UpgradeState.NONE,
    containers: UpgradeState.NONE,
    variables: UpgradeState.NONE,
    pressable: UpgradeState.NONE,
  })[0];

  /*
   * Capture the values of the props and context values for this render
   * We group them together as they will be passed around a lot
   *
   * IMPORTANT: If you need a reference to the current props (such as in a onClick handler), use `sharedState.originalProps`!!!
   */
  const refs: Refs = {
    sharedState,
    containers: inheritedContainers,
    props,
    variables: inheritedVariables,
  };

  /*
   * We use an inline reducer to capture the current `refs`
   *
   * TODO: This is a de-optimization for React, but I'm not sure how to get around it while keeping
   *       to the React philosophy
   */
  function reducer(state: ReducerState, action: ReducerAction) {
    switch (action.type) {
      case "rerender-declarations":
      case "new-declarations":
        const nextState = getDeclarations(state, refs, action);
        // If the declarations have changed, then we need to update the styles
        return Object.is(nextState, state)
          ? state
          : applyStyles(nextState, refs);
      case "styles":
        return applyStyles(state, refs);
    }
  }

  /**
   * This is the core logic for the interop runtime. Each config is handled separately.
   *
   * The reducer has two main actions:
   *  - declarations: This will determine the declarations for styling
   *  - styles: Converts the declarations into props
   *
   * TODO: Future plans are to break this down into more granular updates
   */
  const states: ReducerState[] = [];
  for (const config of configs) {
    const [state, dispatch] = useReducer(
      reducer,
      {
        // A dispatch function is passed into the reducer to create effects
        dispatch: (action: ReducerAction) => dispatch(action),
        // The reducer is called during `init` to create the initial state
        reducer,
        config,
        className: props?.[config.source],
      },
      initReducer,
    );

    // After the first render, we enable the guards. A guard is a function that will return true if the inputs
    // for that config has changed and needs to be updated
    if (sharedState.guardsEnabled) {
      if (state.declarationTracking.guards.some((guard) => guard(refs))) {
        // If needed, update the declarations
        dispatch({
          type: "new-declarations",
          className: props?.[config.source],
        });
      } else if (state.styleTracking.guards.some((guard) => guard(refs))) {
        // If needed, we can jump straight to updating the props
        dispatch({ type: "styles" });
      }
    }

    states.push(state);
    delete props?.[state.config.source];
  }

  /*
   * If any of our states have updated, then we need to merge them
   * This is a memoized value, as variables and containers are used for Context.Providers
   */
  const memoOutput = useMemo(() => {
    let variables = undefined;
    let containers: ContainerRecord = {};

    const possiblyAnimatedProps: Record<string, any> = {};
    const handlers: Record<string, any> = {};

    let hasNullContainer = false;

    /**
     * Loop over all the states and collect the props, variables and containers
     */
    for (const state of states) {
      Object.assign(possiblyAnimatedProps, state.props);

      if (state.variables) {
        variables ||= {};
        Object.assign(variables, state.variables);
      }

      if (state.containerNames !== undefined) {
        if (state.containerNames === false) {
          hasNullContainer = true;
        } else if (!hasNullContainer) {
          for (const container of state.containerNames) {
            containers[container] = sharedState;
          }
          containers[DEFAULT_CONTAINER_NAME] = sharedState;
        }
      }
    }

    if (sharedState.active) {
      handlers.onPressIn = (event: unknown) => {
        sharedState.originalProps?.onPressIn?.(event);
        sharedState.active!.set(true);
      };
      handlers.onPressOut = (event: unknown) => {
        sharedState.originalProps?.onPressOut?.(event);
        sharedState.active!.set(false);
      };
    }
    if (sharedState.hover) {
      handlers.onHoverIn = (event: unknown) => {
        sharedState.originalProps?.onHoverIn?.(event);
        sharedState.hover!.set(true);
      };
      handlers.onHoverOut = (event: unknown) => {
        sharedState.originalProps?.onHoverOut?.(event);
        sharedState.hover!.set(false);
      };
    }

    if (sharedState.focus) {
      handlers.onFocus = (event: unknown) => {
        sharedState.originalProps?.onFocus?.(event);
        sharedState.focus!.set(true);
      };
      handlers.onBlur = (event: unknown) => {
        sharedState.originalProps?.onBlur?.(event);
        sharedState.focus!.set(false);
      };
    }
    /**
     * Some React Native components (e.g Text) will not apply state event handlers
     * if `onPress` is not defined.
     */
    if (sharedState.active || sharedState.hover || sharedState.focus) {
      if (component === View) {
        sharedState.pressable ||= UpgradeState.SHOULD_UPGRADE;
      }
      handlers.onPress = (event: unknown) => {
        sharedState.originalProps?.onPress?.(event);
      };
    }

    if (sharedState.layout || sharedState.containers) {
      sharedState.layout ??= observable([0, 0]);
      handlers.onLayout = (event: LayoutChangeEvent) => {
        sharedState.originalProps?.onLayout?.(event);
        const layout = event.nativeEvent.layout;
        const prevLayout = sharedState.layout!.get();
        if (layout.width !== prevLayout[0] || layout.height !== prevLayout[0]) {
          sharedState.layout!.set([layout.width, layout.height]);
        }
      };
    }

    return {
      possiblyAnimatedProps,
      handlers,
      variables,
      containers:
        sharedState.containers && !hasNullContainer ? containers : undefined,
    };
  }, states);

  const variables = useMemo(() => {
    return Object.assign(
      {},
      inheritedVariables instanceof Map
        ? Object.fromEntries(inheritedVariables.entries())
        : inheritedVariables,
      memoOutput.variables,
    );
  }, [inheritedVariables, memoOutput.variables]);

  const containers = useMemo(() => {
    if (!memoOutput.containers) {
      return inheritedContainers;
    }

    return {
      ...inheritedContainers,
      ...memoOutput.containers,
    };
  }, [inheritedContainers, memoOutput.containers]);

  // Cleanup the effects when the component is unmounted
  useEffect(() => {
    return () => {
      for (const state of states) {
        cleanupEffect(state.declarationTracking.effect);
        cleanupEffect(state.styleTracking.effect);
      }
    };
  }, []);

  // Update the shared state with the latest values
  // sharedState.props = memoOutput.props;
  sharedState.originalProps = originalProps;
  sharedState.guardsEnabled = true;

  return renderComponent(
    component,
    sharedState,
    { ...props, ...memoOutput.handlers, ref },
    memoOutput.possiblyAnimatedProps,
    variables,
    containers,
  );
}

function initReducer({
  dispatch,
  config,
  reducer,
  className,
}: {
  config: InteropComponentConfig;
  dispatch: (action: ReducerAction) => void;
  reducer: (state: ReducerState, action: ReducerAction) => ReducerState;
  className?: string;
}) {
  // Run the declarations action to get the initial state
  return reducer(
    {
      config,
      className,
      props: {},
      styleLookup: {},
      normal: [],
      important: [],
      currentRenderAnimation: {},
      declarationTracking: {
        effect: {
          dependencies: new Set(),
          run: () => dispatch({ type: "rerender-declarations" }),
        },
        guards: [],
      },
      styleTracking: {
        effect: {
          dependencies: new Set(),
          run: () => dispatch({ type: "styles" }),
        },
        guards: [],
      },
    },
    { type: "new-declarations", className },
  );
}

function getDeclarations(
  previousState: ReducerState,
  refs: Refs,
  action: Extract<
    ReducerAction,
    { type: "new-declarations" | "rerender-declarations" }
  >,
): ReducerState {
  const config = previousState.config;
  cleanupEffect(previousState.declarationTracking.effect);

  const state: ReducerState = {
    ...previousState,
    // Reset the declarations
    normal: [],
    important: [],
    currentRenderAnimation: {},
    // Reset containers and variables
    containerNames: undefined,
    variables: undefined,
    // Reset the inline styles
    inline: refs.props?.[config.target],
    // Keep the same effect, but reset the guards
    declarationTracking: {
      effect: previousState.declarationTracking.effect,
      guards: [],
      previous: refs.props?.[config.source],
    },
  };

  if (action.type === "new-declarations") {
    state.className = action.className;
  }

  state.declarationTracking.guards.push(
    (refs) =>
      !Object.is(refs.props?.[config.source], state.className) ||
      !Object.is(refs.props?.[config.target], state.inline),
  );

  const normalRules: ProcessedStyleRules[] = [];
  const importantRules: ProcessedStyleRules[] = [];

  if (state.className) {
    for (const className of state.className.split(/\s+/)) {
      const ruleSet = getStyle(className, state.declarationTracking.effect);

      if (!ruleSet) {
        continue;
      }

      handleUpgrades(refs.sharedState, ruleSet);
      collectRules(state, refs, ruleSet, normalRules, "normal");
      collectRules(state, refs, ruleSet, importantRules, "important");
    }
  }

  if (config.source !== config.target && refs.props?.[config.target]) {
    collectInlineRules(
      state,
      refs,
      refs.props[config.target],
      state.declarationTracking.effect,
      normalRules,
      importantRules,
    );
  }

  state.normal = normalRules
    .filter(Boolean)
    .sort(specificityCompare)
    .flatMap((rule) => ("$type" in rule ? rule.declarations : rule));

  state.important = importantRules
    .filter(Boolean)
    .sort(specificityCompare)
    .flatMap((rule) => ("$type" in rule ? rule.declarations : [rule]));

  const areEqual =
    previousState.className === state.className &&
    previousState.inline === state.inline &&
    arraysAreEqual(previousState.normal, state.normal) &&
    arraysAreEqual(previousState.important, state.important) &&
    objectsAreEqual(previousState.variables, state.variables) &&
    containersAreEqual(previousState.containerNames, state.containerNames);

  return areEqual ? previousState : state;
}

function applyStyles(state: ReducerState, refs: Refs) {
  cleanupEffect(state.styleTracking.effect);

  // If we get this far it will always cause a rerender
  state = {
    ...state,
    props: {},
    styleLookup: {},
    styleTracking: { effect: state.styleTracking.effect, guards: [] },
  };

  const delayedValues: (() => void)[] = [];

  const seenAnimatedProps = new Set<string>();

  /**
   * Render order TLDR:
   *
   * 1. Normal styles
   * 2. Inline styles
   * 3. Animations
   * 4. Important styles
   * 5. Transitions
   *
   * @see: https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/Cascade_and_inheritance#understanding_the_cascade
   *
   * Important notes:
   *  - Animations cannot be important
   *  - Transitions overwrite animations, but only for the affected props
   *
   * Where break these rules:
   *
   * .my-font: {
   *   font-size: 16px !important
   * }
   *
   * .my-line-height: {
   *   line-height: 3em
   * }
   *
   * With this CSS, we cannot calculate the value of line-height until font-size has been resolved.
   * But font-size is important is calculated AFTER the normal styles.
   *
   * To fix this, we introduce a new layer "delayed styles". Delayed styles
   * cannot be calculated immediately and are processed between important and
   * transitions. So the actual order is:
   *
   * 1. Normal styles
   * 2. Inline styles
   * 3. Animations
   * 4. Important styles
   * 5. Delayed styles
   * 6. Transitions
   */

  // 1 & 2 normal and inline styles
  applyRules(state, refs, state.normal, delayedValues);

  // 3: Animations
  processAnimations(state, refs, seenAnimatedProps);

  // 4: Important
  applyRules(state, refs, state.important, delayedValues);

  // 5: Delayed values
  for (const delayed of delayedValues) {
    delayed();
  }
  // 6: Transitions
  processTransition(state, refs, seenAnimatedProps);

  // Animations and Transitions screw with things.
  // Once an component has been upgraded to an animated component
  // we need to retain these values
  retainSharedValues(state, seenAnimatedProps);

  // Moves styles to the correct props or removes the props if they shouldn't exist
  // { style: { fill: 'red' } -> { fill: 'red' }
  cleanup(state.props, state.config);

  return state;
}

function processAnimations(
  state: ReducerState,
  refs: Refs,
  seenAnimatedProps: Set<string>,
) {
  // TODO - check for animation: "none"
  if (state.currentRenderAnimation?.name?.length) {
    state.sharedValues ??= new Map();
    state.animationNames ??= new Set();

    state.props ??= {};
    const props = state.props;

    const {
      name: animationNames,
      duration: durations = defaultAnimation.duration,
      delay: delays = defaultAnimation.delay,
      timingFunction: baseEasingFuncs = defaultAnimation.timingFunction,
      iterationCount: iterations = defaultAnimation.iterationCount,
    } = state.currentRenderAnimation;

    const {
      name: prevAnimationNames = [],
      duration: prevDurations = defaultAnimation.duration,
      delay: prevDelays = defaultAnimation.delay,
      timingFunction: prevBaseEasingFuncs = defaultAnimation.timingFunction,
      iterationCount: prevIterations = defaultAnimation.iterationCount,
    } = state.previousAnimation || {};

    const waitingLayout = state.isWaitingLayout;

    const { makeMutable, withRepeat, withSequence } =
      require("react-native-reanimated") as typeof import("react-native-reanimated");

    let shouldResetAnimations =
      waitingLayout || // Always reset if we are waiting on an animation
      isDeepEqual(prevAnimationNames, animationNames) ||
      isDeepEqual(prevDurations, durations) ||
      isDeepEqual(prevDelays, delays) ||
      isDeepEqual(prevBaseEasingFuncs, baseEasingFuncs) ||
      isDeepEqual(prevIterations, iterations);

    let names: string[] = [];

    for (const name of animationNames) {
      if (name.type === "none") {
        resetAnimation(state);
        break;
      }

      names.push(name.value);

      if (
        state.animationNames.size === 0 || // If there were no previous animations
        !state.animationNames.has(name.value) // Or there is a new animation
      ) {
        shouldResetAnimations = true; // Then reset everything
      }
    }

    /*
     * Animations should only be updated if the animation name changes
     */
    if (shouldResetAnimations) {
      state.animationNames.clear();
      state.isWaitingLayout = false;

      // Loop in reverse order
      for (let index = names.length - 1; index >= 0; index--) {
        const name = names[index % names.length];
        state.animationNames.add(name);

        const animation = getAnimation(name, state.styleTracking.effect);
        if (!animation) {
          continue;
        }

        const baseEasingFunc = baseEasingFuncs[index % baseEasingFuncs.length];

        const easingFuncs =
          animation.easingFunctions?.map((value) => {
            return value.type === "!PLACEHOLDER!" ? baseEasingFunc : value;
          }) || baseEasingFunc;

        const totalDuration = timeToMS(durations[index % name.length]);
        const delay = timeToMS(delays[index % delays.length]);
        const iterationCount = iterations[index % iterations.length];

        for (const frame of animation.frames) {
          const animationKey = frame[0];
          const valueFrames = frame[1].values;
          const pathTokens = frame[1].pathTokens;

          if (seenAnimatedProps.has(animationKey)) continue;
          seenAnimatedProps.add(animationKey);

          const [initialValue, ...sequence] = resolveAnimation(
            state,
            refs,
            valueFrames,
            animationKey,
            delay,
            totalDuration,
            easingFuncs,
          );

          if (animation.requiresLayoutWidth || animation.requiresLayoutHeight) {
            const needWidth =
              animation.requiresLayoutWidth &&
              props.style?.width === undefined &&
              getWidth(state, refs, state.styleTracking) === 0;

            const needHeight =
              animation.requiresLayoutHeight &&
              props.style?.height === undefined &&
              getHeight(state, refs, state.styleTracking) === 0;

            if (needWidth || needHeight) {
              state.isWaitingLayout = true;
            }
          }

          let sharedValue = state.sharedValues.get(animationKey);
          if (!sharedValue) {
            sharedValue = makeMutable(initialValue);
            state.sharedValues.set(animationKey, sharedValue);
          } else {
            sharedValue.value = initialValue;
          }

          sharedValue.value = withRepeat(
            withSequence(...sequence),
            iterationCount.type === "infinite" ? -1 : iterationCount.value,
          );

          setDeep(props, pathTokens, sharedValue);
        }
      }
    } else {
      for (const name of names) {
        const keyframes = getAnimation(name, state.styleTracking.effect);
        if (!keyframes) continue;

        props[state.config.target] ??= {};

        for (const [animationKey, { pathTokens }] of keyframes.frames) {
          setDeep(props, pathTokens, state.sharedValues.get(animationKey));
          seenAnimatedProps.add(animationKey);
        }
      }
    }
  } else if (state.animationNames?.size) {
    resetAnimation(state);
  }
}

function resetAnimation(state: ReducerState) {
  if (!state.animationNames) return;

  for (const name of state.animationNames) {
    const animation = getAnimation(name, state.styleTracking.effect);

    if (!animation) {
      continue;
    }

    state.sharedValues ??= new Map();

    const { cancelAnimation } =
      require("react-native-reanimated") as typeof import("react-native-reanimated");

    for (const [propertyName] of animation.frames) {
      let defaultValue = defaultValues[propertyName];

      if (typeof defaultValue === "function") {
        defaultValue = defaultValue(state.styleTracking.effect);
      }

      let sharedValue = state.sharedValues.get(propertyName);
      if (sharedValue) {
        cancelAnimation(sharedValue);
        state.sharedValues.delete(propertyName);
      }
    }
  }
}

function processTransition(
  state: ReducerState,
  refs: Refs,
  seenAnimatedProps: Set<string>,
) {
  if (!state.transition) return;
  state.sharedValues ??= new Map();

  state.props ??= {};
  const props = state.props;

  const {
    property: properties,
    duration: durations,
    delay: delays,
    timingFunction: easingFunctions,
  } = state.transition;

  /**
   * Make this inline to avoid importing reanimated if we don't need it
   * This also fixes circular dependency issues where Reanimated may use the jsx transform
   */
  const { makeMutable, withTiming, withDelay, Easing } =
    require("react-native-reanimated") as typeof import("react-native-reanimated");

  /**
   * If there is a 'none' transition we should skip this logic.
   * In the sharedValues cleanup step the animation will be cancelled as the properties were not seen.
   */
  if (!properties.includes("none")) {
    for (let index = 0; index < properties.length; index++) {
      const property = properties[index];
      if (seenAnimatedProps.has(property)) continue;
      let sharedValue = state.sharedValues.get(property);
      let { value, defaultValue } = resolveTransitionValue(state, property);

      if (value === undefined && !sharedValue) {
        // We have never seen this value, and its undefined so do nothing
        continue;
      } else if (!sharedValue) {
        // First time seeing this value. On the initial render don't transition,
        // otherwise transition from the default value
        const initialValue =
          Number(refs.sharedState.animated) < UpgradeState.UPGRADED &&
          value !== undefined
            ? value
            : defaultValue;

        sharedValue = makeMutable(initialValue);
        state.sharedValues.set(property, sharedValue);
      } else {
        // If the value is undefined or null, then it should be the default
        value ??= defaultValue;

        if (value !== sharedValue.value) {
          const duration = timeToMS(durations[index % durations.length]);
          const delay = timeToMS(delays[index % delays.length]);
          const easing = easingFunctions[index % easingFunctions.length];
          sharedValue.value = withDelay(
            delay,
            withTiming(value, {
              duration,
              easing: getEasing(easing, Easing),
            }),
          );
        }
      }

      seenAnimatedProps.add(property);
      props.style ??= {};
      setDeep(props.style, [property], sharedValue);
    }
  }
}

function retainSharedValues(
  state: ReducerState,
  seenAnimatedProps: Set<string>,
) {
  if (!state.sharedValues?.size) return;

  state.props ??= {};
  const props = state.props;

  for (const entry of state.sharedValues) {
    if (seenAnimatedProps.has(entry[0])) continue;
    let value =
      props.style?.[entry[0]] ??
      state.styleLookup[entry[0]] ??
      defaultValues[entry[0]];
    if (typeof value === "function") {
      value = value(state.styleTracking.effect);
    }
    entry[1].value = value;
    props.style?.[entry[0]] ??
      state.styleLookup[entry[0]] ??
      defaultValues[entry[0]];
    setDeep(props.style, [entry[0]], entry[1]);
  }
}

function handleUpgrades(sharedState: SharedState, ruleSet: StyleRuleSet) {
  if (ruleSet.active) {
    sharedState.active ||= observable(false, {
      name: `${ruleSet.classNames}:active`,
    });
  }
  if (ruleSet.hover) {
    sharedState.hover ||= observable(false, {
      name: `${ruleSet.classNames}:hover`,
    });
  }
  if (ruleSet.focus) {
    sharedState.focus ||= observable(false, {
      name: `${ruleSet.classNames}:focus`,
    });
  }
  if (ruleSet.animation) sharedState.animated ||= UpgradeState.SHOULD_UPGRADE;
  if (ruleSet.variables) sharedState.variables ||= UpgradeState.SHOULD_UPGRADE;
  if (ruleSet.container) {
    sharedState.containers ||= UpgradeState.SHOULD_UPGRADE;
    sharedState.active ||= observable(false, {
      name: `${ruleSet.classNames}:active`,
    });
    sharedState.hover ||= observable(false, {
      name: `${ruleSet.classNames}:hover`,
    });
    sharedState.focus ||= observable(false, {
      name: `${ruleSet.classNames}:focus`,
    });
  }
}

/**
 * Mutates the props object to move native styles to props
 * @param props
 * @param config
 */
function cleanup(props: Record<string, any>, config: InteropComponentConfig) {
  if (!config.nativeStyleToProp) return;

  for (let move of Object.entries(config.nativeStyleToProp)) {
    const source = move[0];
    const sourceValue = props[config.target]?.[source];
    if (sourceValue === undefined) continue;
    const targetProp = move[1] === true ? move[0] : move[1];
    props[targetProp] = sourceValue;
    delete props[config.target][source];
  }

  if (config.removeTarget) {
    delete props[config.target];
  }
}

function arraysAreEqual(a: any[], b: any[]) {
  return a.length === b.length && a.every((value, index) => value === b[index]);
}

function objectsAreEqual(a?: Record<string, any>, b?: Record<string, any>) {
  return a && b && arraysAreEqual(Object.values(a), Object.values(b));
}

function containersAreEqual(
  a?: ReducerState["containerNames"],
  b?: ReducerState["containerNames"],
) {
  return a == b || (a && b && arraysAreEqual(a, b));
}

function applyRules(
  state: ReducerState,
  refs: Refs,
  declarations: ProcessedStyleDeclaration[],
  delayedValues: (() => void)[],
) {
  const target = state.config.target;
  const props = state.props;
  const lookup = state.styleLookup;

  for (const declaration of declarations) {
    if (Array.isArray(declaration)) {
      if (declaration.length === 2) {
        const prop = declaration[0] === "style" ? target : declaration[0];
        if (typeof declaration[1] === "object") {
          props[prop] ??= {};
          Object.assign(props[prop], declaration[1]);
        } else {
          props[prop] = declaration[1];
        }
      } else {
        const paths = [...declaration[1]];

        if (target !== "style" && paths[0] === "style") {
          paths[0] = target;
        }

        // em / rnw / rnh units use other declarations, so we need to delay them
        if (typeof declaration[2] === "object" && declaration[2].delay) {
          const uniquePlaceHolder = {};
          // Set a placeholder value, then later if the value is still the placeholder, we can resolve it
          lookup[declaration[0]] = uniquePlaceHolder;
          delayedValues.push(() => {
            if (lookup[declaration[0]] !== uniquePlaceHolder) return;
            const value = resolveValue(
              state,
              refs,
              state.styleTracking,
              declaration[2],
              props[target],
            );
            setDeep(props, paths, value);
            lookup[declaration[0]] = value;
          });
        } else {
          const value = resolveValue(
            state,
            refs,
            state.styleTracking,
            declaration[2],
            props[target],
          );
          setDeep(props, paths, value);
          lookup[declaration[0]] = value;
        }
      }
    } else {
      if (typeof props[target] === "object") {
        Object.assign(props[target], declaration);
      } else {
        // Make sure we clone this, as it may be a frozen style object
        props[target] = { ...declaration };
      }
    }
  }
}

const inlineSpecificity: Specificity = { inline: 1, I: 0 };
function specificityCompare(
  o1?: object | StyleRule | null,
  o2?: object | StyleRule | null,
) {
  if (!o1) return -1;
  if (!o2) return 1;

  const a = "specificity" in o1 ? o1.specificity : inlineSpecificity;
  const b = "specificity" in o2 ? o2.specificity : inlineSpecificity;

  if (a.I !== b.I) {
    return (a.I || 0) - (b.I || 0); /* Important */
  } else if (a.inline !== b.inline) {
    return (a.inline || 0) - (b.inline || 0); /* Inline */
  } else if (a.A !== b.A) {
    return (a.A || 0) - (b.A || 0); /* Ids */
  } else if (a.B !== b.B) {
    return (a.B || 0) - (b.B || 0); /* Classes */
  } else if (a.C !== b.C) {
    return (a.C || 0) - (b.C || 0); /* Styles */
  } else if (a.S !== b.S) {
    return (a.S || 0) - (b.S || 0); /* StyleSheet Order */
  } else if (a.O !== b.O) {
    return (a.O || 0) - (b.O || 0); /* Appearance Order */
  } else {
    return 0; /* Appearance Order */
  }
}

const transformKeys = new Set([
  "transform",
  "translateX",
  "translateY",
  "scale",
  "scaleX",
  "scaleY",
  "rotate",
  "rotateX",
  "rotateY",
  "rotateZ",
  "skewX",
  "skewY",
  "perspective",
  "matrix",
  "transformOrigin",
]);

function collectRules(
  state: ReducerState,
  refs: Refs,
  ruleSet: StyleRuleSet,
  collection: ProcessedStyleRules[],
  key: "normal" | "important",
) {
  const rules = ruleSet[key];

  if (!rules) return;

  for (const rule of rules) {
    // Check if the rule should be applied and also mutate the guards to add checks for next render
    if (testRule(rule, refs, state.declarationTracking)) {
      if ("$type" in rule) {
        if (rule.animations) {
          Object.assign(state.currentRenderAnimation, rule.animations);
        }

        if (rule.transition) {
          state.transition ??= { ...defaultTransition };
          Object.assign(state.transition, rule.transition);
        }

        if (rule.variables) {
          for (const variable of rule.variables) {
            state.variables ??= {};
            state.variables[variable[0]] = observable(variable[1]);
          }
        }

        if (rule.container) {
          state.containerNames = rule.container.names;
        }

        if (rule.declarations) {
          collection.push(rule as ProcessedStyleRules);
        }
      } else {
        collection.push(rule);
      }
    }
  }
}

/*
 * Styles are collected both from the source and the target
 * Target styles are merged into the 'normal' declarations
 */
function collectInlineRules(
  state: ReducerState,
  refs: Refs,
  target: Record<string, any> | Record<string, any>[],
  effect: Effect,
  normal: ProcessedStyleRules[],
  important: ProcessedStyleRules[],
) {
  if (Array.isArray(target)) {
    for (const t of target) {
      collectInlineRules(state, refs, t, effect, normal, important);
    }
  } else if (target) {
    const styles = getOpaqueStyles(target, effect);

    for (const style of styles) {
      if (typeof style === "object" && "$type" in style) {
        const ruleSet = style as StyleRuleSet;
        handleUpgrades(refs.sharedState, ruleSet);
        collectRules(state, refs, ruleSet, normal, "normal");
        collectRules(state, refs, ruleSet, important, "important");
      } else if (style) {
        normal.push(style);
      }
    }
  }
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

function setDeep(target: Record<string, any>, paths: string[], value: any) {
  const prop = paths[paths.length - 1];
  for (let i = 0; i < paths.length - 1; i++) {
    const token = paths[i];
    target[token] ??= {};
    target = target[token];
  }
  if (transformKeys.has(prop)) {
    if (target.transform) {
      const existing = target.transform.find(
        (t: any) => Object.keys(t)[0] === prop,
      );
      if (existing) {
        existing[prop] = value;
      } else {
        target.transform.push({ [prop]: value });
      }
    } else {
      target.transform ??= [];
      target.transform.push({ [prop]: value });
    }
  } else {
    target[prop] = value;
  }
}

/**
 * Perform a DeepEqual comparison that cares about order
 * of arrays and the order of object keys
 */
function isDeepEqual(a: any, b: any): boolean {
  if (a === b) return true;
  if (typeof a !== typeof b) return false;

  if (Array.isArray(a)) {
    return (
      a.length === b.length &&
      a.every((aValue, index) => isDeepEqual(aValue, b[index]))
    );
  } else if (typeof a === "object" && a && b) {
    // We need to do a truthy check, as typeof null === 'object'
    return isDeepEqual(Object.entries(a), Object.entries(b));
  }

  return a === b;
}
