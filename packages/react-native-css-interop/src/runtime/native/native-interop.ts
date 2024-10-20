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
  assignToTarget,
  DEFAULT_CONTAINER_NAME,
  getTargetValue,
  inlineSpecificity,
  PLACEHOLDER_SYMBOL,
  SpecificityIndex,
  StyleRuleSetSymbol,
  StyleRuleSymbol,
} from "../../shared";
import {
  ContainerRecord,
  ExtractedAnimations,
  ExtractedTransition,
  InteropComponentConfig,
  ProcessedStyleRules,
  ReactComponent,
  StyleDeclaration,
  StyleDeclarationOrInline,
  StyleRule,
  StyleRuleSet,
} from "../../types";
import { cleanupEffect, Effect, observable } from "../observable";
import { testRule } from "./conditions";
import { containerContext } from "./globals";
import { renderComponent, UpgradeState } from "./render-component";
import {
  defaultValues,
  getBaseValue,
  getEasing,
  getHeight,
  getTarget,
  getWidth,
  resolveAnimation,
  resolveValue,
  timeToMS,
} from "./resolve-value";
import {
  getAnimation,
  getOpaqueStyles,
  getStyle,
  VariableContext,
} from "./styles";
import { ReducerAction, ReducerState, Refs, SharedState } from "./types";

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
    initialRender: true,
    originalProps,
    props: {},
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
    if (!sharedState.initialRender) {
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
  sharedState.initialRender = false;

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
    inline: getTarget(refs.props, config),
    // Keep the same effect, but reset the guards
    declarationTracking: {
      effect: previousState.declarationTracking.effect,
      guards: [],
      previous: refs.props?.[config.source],
    },
    // If we previously had a transition, we need to keep it
    // So we 'reset' to the defaultTransition
    transition: previousState.transition ? { ...defaultTransition } : undefined,
  };

  if (action.type === "new-declarations") {
    state.className = action.className;
  }

  state.declarationTracking.guards.push(
    (refs) =>
      !Object.is(refs.props?.[config.source], state.className) ||
      !Object.is(getTarget(refs.props, config), state.inline),
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
      collectRules(state, refs, ruleSet, normalRules, "n");
      collectRules(state, refs, ruleSet, importantRules, "i");
    }
  }

  if (config.inlineProp && refs.props?.[config.inlineProp]) {
    collectInlineRules(
      state,
      refs,
      refs.props[config.inlineProp],
      state.declarationTracking.effect,
      normalRules,
      importantRules,
    );
  }

  state.normal = normalRules
    .filter(Boolean)
    .sort(specificityCompare)
    .flatMap((rule) => (StyleRuleSymbol in rule ? rule.d : rule));

  state.important = importantRules
    .filter(Boolean)
    .sort(specificityCompare)
    .flatMap((rule) => (StyleRuleSymbol in rule ? rule.d : rule));

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
          const valueFrames = frame[1];
          const pathTokens = ["style", animationKey];

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

          assignToTarget(props, sharedValue, pathTokens, {
            allowTransformMerging: true,
          });
        }
      }
    } else {
      for (const name of names) {
        const keyframes = getAnimation(name, state.styleTracking.effect);
        if (!keyframes) continue;

        for (const [animationKey] of keyframes.frames) {
          assignToTarget(
            props,
            state.sharedValues.get(animationKey),
            ["style", animationKey],
            {
              allowTransformMerging: true,
            },
          );
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
      let defaultValue =
        defaultValues[propertyName as keyof typeof defaultValues];

      if (typeof defaultValue === "function") {
        defaultValue = defaultValue(state.styleTracking.effect);
      }

      let sharedValue = state.sharedValues.get(propertyName);
      if (sharedValue) {
        cancelAnimation(sharedValue);
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
  if (properties.length === 0 || properties.includes("none")) {
    return;
  }

  for (let index = 0; index < properties.length; index++) {
    const property = properties[index];
    if (seenAnimatedProps.has(property)) continue;
    let sharedValue = state.sharedValues.get(property);
    let { value, defaultValue } = getBaseValue(state, [property]);

    if (value === undefined && !sharedValue) {
      // We have never seen this value, and its undefined so do nothing
      continue;
    } else if (refs.sharedState.initialRender) {
      // On the initial render don't transition
      const initialValue = value !== undefined ? value : defaultValue;
      sharedValue = makeMutable(initialValue);
      state.sharedValues.set(property, sharedValue);
    } else {
      if (!sharedValue) {
        // First time seeing this value, but its not the initial render!
        // We need to create the sharedValue
        sharedValue = makeMutable(defaultValue);
        state.sharedValues.set(property, sharedValue);
      }

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
    assignToTarget(props.style, sharedValue, [property], {
      allowTransformMerging: true,
    });
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
      defaultValues[entry[0] as keyof typeof defaultValues];
    if (typeof value === "function") {
      value = value(state.styleTracking.effect);
    }
    entry[1].value = value;
    props.style ??= {};
    props.style?.[entry[0]] ??
      defaultValues[entry[0] as keyof typeof defaultValues];
    assignToTarget(props.style, entry[1], [entry[0]], {
      allowTransformMerging: true,
    });
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

  for (let move of config.nativeStyleToProp) {
    const source = move[0];

    const target = getTarget(props, config);

    if (!target || !(source in target)) continue;

    assignToTarget(props, target[source], move[1], {
      allowTransformMerging: true,
    });
    delete target[source];
  }

  if (config.propToRemove) {
    delete props[config.propToRemove];
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
  declarations: StyleDeclarationOrInline[],
  delayedValues: (() => void)[],
) {
  const props = state.props;

  for (const declaration of declarations) {
    if (Array.isArray(declaration)) {
      let [descriptor, pathTokens] = declaration;

      const assignToTargetPath =
        pathTokens === undefined
          ? state.config.target
          : typeof pathTokens === "string"
            ? [...state.config.target, pathTokens]
            : pathTokens.length === 0
              ? [...state.config.target.slice(0, -1)]
              : [...state.config.target.slice(0, -1), ...pathTokens];

      const castToArray =
        assignToTargetPath[assignToTargetPath.length - 1] === "transform";

      // Static styles are non-array objects
      if (typeof descriptor === "object" && !Array.isArray(descriptor)) {
        assignToTarget(props, descriptor, assignToTargetPath, {
          allowTransformMerging: true,
        });
      } else {
        // Some styles (e.g em unit) rely on other styles so we delay calculating their values
        if (isDelayedDeclaration(declaration)) {
          const uniquePlaceHolder = { [PLACEHOLDER_SYMBOL]: true };
          // Set a placeholder value, then later if the value is still the placeholder, we can resolve it
          assignToTarget(props, uniquePlaceHolder, assignToTargetPath, {
            allowTransformMerging: true,
          });
          delayedValues.push(() => {
            let currentValue = getTargetValue(props, assignToTargetPath);

            if (currentValue === uniquePlaceHolder) {
              const value = resolveValue(
                state,
                refs,
                state.styleTracking,
                descriptor,
                getTarget(props, state.config),
                castToArray,
              );
              assignToTarget(props, value, assignToTargetPath, {
                allowTransformMerging: true,
              });
            }
          });
        } else {
          const value = resolveValue(
            state,
            refs,
            state.styleTracking,
            descriptor,
            getTarget(props, state.config),
            castToArray,
          );
          assignToTarget(props, value, assignToTargetPath, {
            allowTransformMerging: true,
          });
        }
      }
    } else {
      // Make sure we clone this, as it may be a frozen style object
      assignToTarget(props, { ...declaration }, state.config, {
        objectMergeStyle: "assign",
      });
    }
  }
}

function specificityCompare(
  o1?: object | StyleRule | null,
  o2?: object | StyleRule | null,
) {
  if (!o1) return -1;
  if (!o2) return 1;

  const aSpec = StyleRuleSymbol in o1 ? o1.s : inlineSpecificity;
  const bSpec = StyleRuleSymbol in o2 ? o2.s : inlineSpecificity;

  if (aSpec[SpecificityIndex.Important] !== bSpec[SpecificityIndex.Important]) {
    return (
      (aSpec[SpecificityIndex.Important] || 0) -
      (bSpec[SpecificityIndex.Important] || 0)
    );
  } else if (
    aSpec[SpecificityIndex.Inline] !== bSpec[SpecificityIndex.Inline]
  ) {
    return (
      (aSpec[SpecificityIndex.Inline] || 0) -
      (bSpec[SpecificityIndex.Inline] || 0)
    );
  } else if (
    aSpec[SpecificityIndex.PseudoElements] !==
    bSpec[SpecificityIndex.PseudoElements]
  ) {
    return (
      (aSpec[SpecificityIndex.PseudoElements] || 0) -
      (bSpec[SpecificityIndex.PseudoElements] || 0)
    );
  } else if (
    aSpec[SpecificityIndex.ClassName] !== bSpec[SpecificityIndex.ClassName]
  ) {
    return (
      (aSpec[SpecificityIndex.ClassName] || 0) -
      (bSpec[SpecificityIndex.ClassName] || 0)
    );
  } else if (aSpec[SpecificityIndex.Order] !== bSpec[SpecificityIndex.Order]) {
    return (
      (aSpec[SpecificityIndex.Order] || 0) -
      (bSpec[SpecificityIndex.Order] || 0)
    );
  } else {
    return 0;
  }
}

function collectRules(
  state: ReducerState,
  refs: Refs,
  ruleSet: StyleRuleSet,
  collection: ProcessedStyleRules[],
  key: "n" | "i",
) {
  const rules = ruleSet[key];

  if (!rules) return;

  for (const rule of rules) {
    // Check if the rule should be applied and also mutate the guards to add checks for next render
    if (testRule(rule, refs, state.declarationTracking)) {
      if (StyleRuleSymbol in rule) {
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

        if (rule.d) {
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
      if (!style) {
        continue;
      }

      if (StyleRuleSetSymbol in style) {
        const ruleSet = style as StyleRuleSet;
        handleUpgrades(refs.sharedState, ruleSet);
        collectRules(state, refs, ruleSet, normal, "n");
        collectRules(state, refs, ruleSet, important, "i");
      } else {
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
  timeline: [{ type: "none" }],
};
const defaultTransition: Required<ExtractedTransition> = {
  property: [],
  duration: [{ type: "seconds", value: 0 }],
  delay: [{ type: "seconds", value: 0 }],
  timingFunction: [{ type: "linear" }],
};

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

function isDelayedDeclaration(
  declaration: StyleDeclaration,
): declaration is Extract<StyleDeclaration, [any, any, true]> {
  return declaration[2] === 1;
}
