import { InteropComponentConfig, StyleDeclaration } from "../../types";
import { observable } from "../observable";
import { UpgradeState } from "./render-component";
import {
  defaultValues,
  getEasing,
  resolveAnimation,
  resolveTransitionValue,
  resolveValue,
  setDeep,
  timeToMS,
} from "./resolve-value";
import { animationMap } from "./stylesheet";
import { PropState } from "./native-interop";

export function processDeclarations(
  propState: PropState,
  declarations: (StyleDeclaration | object)[] | undefined,
  props: Record<string, any>,
  normalizedProps: Record<string, any>,
  delayedValues: (() => void)[],
) {
  if (!declarations) return;

  for (const declaration of declarations) {
    if (Array.isArray(declaration)) {
      if (declaration.length === 2) {
        const prop =
          declaration[0] === "style" ? propState.target : declaration[0];
        if (typeof declaration[1] === "object") {
          props[prop] ??= {};
          Object.assign(props[prop], declaration[1]);
        } else {
          props[prop] = declaration[1];
        }
      } else {
        // em / rnw / rnh units use other declarations, so we need to delay them
        if (typeof declaration[2] === "object" && declaration[2].delay) {
          const uniqueValue = {};
          // Set a placeholder value
          normalizedProps[declaration[0]] = uniqueValue;

          delayedValues.push(() => {
            // If the placeholder value has changed, then a more specific style overrode it
            if (normalizedProps[declaration[0]] !== uniqueValue) {
              return;
            }

            const value = resolveValue(
              propState,
              declaration[2],
              props[propState.target],
            );
            setDeep(props, declaration[1], value);
            normalizedProps[declaration[0]] = value;
          });
        } else {
          const value = resolveValue(
            propState,
            declaration[2],
            props[propState.target],
          );
          setDeep(props, declaration[1], value);
          normalizedProps[declaration[0]] = value;
        }
      }
    } else {
      if (typeof props[propState.target] === "object") {
        Object.assign(props[propState.target], declaration);
      } else {
        // Make sure we clone this, as it may be a frozen style object
        props[propState.target] = { ...declaration };
      }
    }
  }
}

export function processAnimations(
  props: Record<string, any>,
  normalizedProps: Record<string, any>,
  seenAnimatedProps: Set<string>,
  propState: PropState,
) {
  if (!propState.animation) return;
  propState.sharedValues ??= new Map();
  propState.animationNames ??= new Set();

  const {
    name: animationNames,
    duration: durations,
    delay: delays,
    iterationCount: iterationCounts,
    timingFunction: easingFuncs,
    waitingLayout,
  } = propState.animation;

  const { makeMutable, withRepeat, withSequence } =
    require("react-native-reanimated") as typeof import("react-native-reanimated");

  props.style ??= {};
  let names: string[] = [];
  // Always reset if we are waiting on an animation
  let shouldResetAnimations = waitingLayout;

  for (const name of animationNames) {
    if (name.type === "none") {
      names = [];
      propState.animationNames.clear();
      break;
    }

    names.push(name.value);

    if (
      propState.animationNames.size === 0 || // If there were no previous animations
      !propState.animationNames.has(name.value) // Or there is a new animation
    ) {
      shouldResetAnimations = true; // Then reset everything
    }
  }

  /*
   * Animations should only be updated if the animation name changes
   */
  if (shouldResetAnimations) {
    propState.animationNames.clear();
    propState.animation.waitingLayout = false;

    // Loop in reverse order
    for (let index = names.length - 1; index >= 0; index--) {
      const name = names[index % names.length];
      propState.animationNames.add(name);

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
          propState,
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
            getWidth(propState) === 0;

          const needHeight =
            animation.requiresLayoutHeight &&
            props.style?.height === undefined &&
            getHeight(propState) === 0;

          if (needWidth || needHeight) {
            propState.animation.waitingLayout = true;
          }
        }

        let sharedValue = propState.sharedValues.get(animationKey);
        if (!sharedValue) {
          sharedValue = makeMutable(initialValue);
          propState.sharedValues.set(animationKey, sharedValue);
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

      props[propState.target] ??= {};

      for (const [animationKey, { pathTokens }] of keyframes.frames) {
        setDeep(props, pathTokens, propState.sharedValues.get(animationKey));
        seenAnimatedProps.add(animationKey);
      }
    }
  }
}

export function processTransition(
  props: Record<string, any>,
  normalizedProps: Record<string, any>,
  seenAnimatedProps: Set<string>,
  propState: PropState,
) {
  if (!propState.transition) return;
  propState.sharedValues ??= new Map();

  const {
    property: properties,
    duration: durations,
    delay: delays,
    timingFunction: timingFunctions,
  } = propState.transition;

  /**
   * Make this inline to avoid importing reanimated if we don't need it
   * This also fixes circular dependency issues where Reanimated may use the jsx transform
   */
  const { makeMutable, withDelay, withTiming, Easing } =
    require("react-native-reanimated") as typeof import("react-native-reanimated");

  /**
   * If there is a 'none' transition we should skip this logic.
   * In the sharedValues cleanup step the animation will be cancelled as the properties were not seen.
   */
  if (!properties.includes("none")) {
    for (let index = 0; index < properties.length; index++) {
      const property = properties[index];
      if (seenAnimatedProps.has(property)) continue;
      let sharedValue = propState.sharedValues.get(property);
      let { value, defaultValue } = resolveTransitionValue(
        propState,
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
          Number(propState.upgrades.animated) < UpgradeState.UPGRADED &&
          value !== undefined
            ? value
            : defaultValue;

        sharedValue = makeMutable(initialValue);
        propState.sharedValues.set(property, sharedValue);
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
            easing: getEasing(easing, Easing),
          }),
        );
      }
      setDeep(props.style, [property], sharedValue);
    }
  }
}

export function retainSharedValues(
  props: Record<string, any>,
  normalizedProps: Record<string, any>,
  seenAnimatedProps: Set<string>,
  propState: PropState,
) {
  if (!propState.sharedValues?.size) return;

  for (const entry of propState.sharedValues) {
    if (seenAnimatedProps.has(entry[0])) continue;
    let value =
      props.style?.[entry[0]] ??
      normalizedProps[entry[0]] ??
      defaultValues[entry[0]];
    if (typeof value === "function") {
      value = value(propState.styleEffect);
    }
    entry[1].value = value;
    props.style?.[entry[0]] ??
      normalizedProps[entry[0]] ??
      defaultValues[entry[0]];
    setDeep(props.style, [entry[0]], entry[1]);
  }
}

/**
 * Mutates the props object to move native styles to props
 * @param props
 * @param config
 */
export function nativeStyleToProp(
  props: Record<string, any>,
  config: InteropComponentConfig,
) {
  if (config.target !== "style" || !config.nativeStyleToProp) return;

  for (let move of Object.entries(config.nativeStyleToProp)) {
    const source = move[0];
    const sourceValue = props[config.target]?.[source];
    if (sourceValue === undefined) continue;
    const targetProp = move[1] === true ? move[0] : move[1];
    props[targetProp] = sourceValue;
    delete props[config.target][source];
  }
}

function getLayout(state: PropState, interaction = state.interaction) {
  interaction.layout ??= observable([0, 0]);
  return interaction.layout.get(state.styleEffect);
}
export function getWidth(state: PropState) {
  return getLayout(state)[0];
}
export function getHeight(state: PropState) {
  return getLayout(state)[1];
}
