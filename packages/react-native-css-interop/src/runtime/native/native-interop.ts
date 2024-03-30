import { useContext, useEffect, useState } from "react";
import { Effect, Observable, cleanupEffect, observable } from "../observable";
import {
  ExtractedAnimations,
  ExtractedTransition,
  InteropComponentConfig,
  ReactComponent,
  Specificity,
  StyleDeclaration,
  StyleRule,
  StyleRuleSet,
} from "../../types";
import {
  containerContext,
  externalCallbackRef,
  variableContext,
} from "./globals";
import {
  nativeStyleToProp,
  processAnimations,
  processDeclarations,
  processTransition,
  retainSharedValues,
} from "./utils";
import type { SharedValue } from "react-native-reanimated";
import { globalStyles, opaqueStyles } from "./style-store";
import { UpgradeState, renderComponent } from "./render-component";
import { testRule } from "./conditions";
import { DEFAULT_CONTAINER_NAME } from "../../shared";

export type ComponentState = {
  refs: {
    props: Record<string, any> | null;
    containers: Record<string, ComponentState>;
    variables: Record<string, any>;
  };
  interaction: {
    active?: Observable<boolean>;
    hover?: Observable<boolean>;
    focus?: Observable<boolean>;
    layout?: Observable<[number, number]>;
  };
  rerender(): void;
  upgrades: {
    animated?: number;
    variables?: number;
    containers?: number;
    pressable?: number;
    canWarn?: boolean;
  };
  propStates: ReturnType<typeof createPropState>[];
};

export type PropState = InteropComponentConfig & {
  upgrades: ComponentState["upgrades"];
  refs: ComponentState["refs"];
  interaction: ComponentState["interaction"];
  testID?: string;

  props?: Record<string, any>;

  classNames?: string;
  inlineStyles?: any;

  tracking: {
    inlineStyles?: any;
    index: number;
    rules: StyleRule[];
    changed: boolean;
  };

  declarations?: StyleDeclaration[];
  importantDeclarations?: StyleDeclaration[];

  variables?: Record<string, any>;
  variableTracking?: Map<string, any>;

  containerNames?: false | string[];
  containerTracking?: Map<string, any>;

  declarationEffect: Effect;
  styleEffect: Effect;

  animation?: Required<ExtractedAnimations> & { waitingLayout: boolean };
  transition?: Required<ExtractedTransition>;
  sharedValues?: Map<string, SharedValue<any>>;
  animationNames?: Set<string>;
};

/**
 * The
 * @param component
 * @param configs
 * @param props
 * @param ref
 * @returns
 */
export function interop(
  component: ReactComponent<any>,
  configs: InteropComponentConfig[],
  props: Record<string, any> | null,
  ref: any,
) {
  // These are inherited from the parent components
  let variables = useContext(variableContext);
  let containers = useContext(containerContext);

  /*
   * We need to keep track of the state of the component
   */
  const [componentState, setState] = useState(() => {
    const componentState: ComponentState = {
      // Refs are values that should be updated every time the component is rendered
      refs: { props, containers, variables },
      // This stores the state of 'active', 'hover', 'focus', and 'layout'
      interaction: {},
      // Should the component be upgraded? E.g View->Pressable, View->Animated.View
      upgrades: {},
      // The current state of each `className` prop
      propStates: [],
      // This is how we force a component to rerender
      rerender: () => setState((state) => ({ ...state })),
    };
    /*
     * Generate the propStates is the mapping of `className`->`style` props
     * You can have multiple propStates if you have multiple `className` props
     */
    componentState.propStates = configs.map((config) => {
      return createPropState(componentState, config);
    });

    return componentState;
  });

  // Components can subscribe to the event handlers of other components
  // So we need to ensure that everything is cleaned up when the component is unmounted
  useEffect(() => {
    return () => {
      for (const prop of componentState.propStates) {
        /*
         * Effects are a two-way dependency system, so we need to cleanup the references to avoid a memory leak
         */
        cleanupEffect(prop.declarationEffect);
        cleanupEffect(prop.styleEffect);
        /*
         * If we have any shared values, we need to cancel any running animations
         */
        if (prop.sharedValues?.size) {
          const { cancelAnimation } =
            require("react-native-reanimated") as typeof import("react-native-reanimated");

          for (const value of prop.sharedValues.values()) {
            cancelAnimation(value);
          }
        }
      }
    };
  }, [componentState.propStates]);

  // Update the refs so we don't have stale data
  componentState.refs.props = props;
  componentState.refs.containers = containers;
  componentState.refs.variables = variables;

  // Clone the props into a new object, as props will be frozen
  props = Object.assign({ ref }, props);

  // We need to rerun all the prop states to get the styled props
  for (const propState of componentState.propStates) {
    // This line is the magic and impure part of the code. It will mutate propState
    // and regenerate styles & props
    propState.declarationEffect.rerun(true);

    // Once propState has mutated, we can retrieve the data from it

    // Set the styled props
    Object.assign(props, propState.props);

    // Remove any source props
    // e.g remove props.className as React Native will throw a warning about unknown props
    if (propState.target !== propState.source) {
      delete props[propState.source];
    }

    // Collect any inline variables being set
    if (propState.variables) {
      variables = Object.assign({}, variables, propState.variables);
    }

    // Connect the containers being set
    if (propState.containerNames) {
      containers = Object.assign({}, containers);
      for (const name of propState.containerNames) {
        containers[name] = componentState;
      }
      containers[DEFAULT_CONTAINER_NAME] = componentState;
    }
  }

  /*
   * Render out the base component with the new styles.
   */
  return renderComponent(
    component,
    componentState,
    props,
    variables,
    containers,
  );
}

/**
 * A propState is the state of a single `className`->`style` prop
 *
 * It contains two effects:
 *  - declarationEffect: This effect will run when the `className` or `style` prop changes
 *                       and stores the style declarations
 *  - styleEffect: This effect will run when the style declarations change.
 *                 It generates the new props (new style objects)
 * @param componentState
 * @param config
 * @returns
 */
function createPropState(
  componentState: ComponentState,
  config: InteropComponentConfig,
) {
  const propState: PropState = {
    // What is the source prop? e.g className
    source: config.source,
    // WHat is the target prop? e.g style
    target: config.target,
    // Should we move styles to props? e.g { style: { fill: 'red' } -> { fill: 'red' }
    nativeStyleToProp: config.nativeStyleToProp,
    // These are object references from the parent component
    // They should never be replaced, only mutated
    upgrades: componentState.upgrades,
    interaction: componentState.interaction,
    refs: componentState.refs,
    testID: componentState.refs.props?.testID,

    // Tracks what the classNames were last render and if anything has changed
    tracking: {
      index: 0,
      rules: [],
      changed: false,
    },

    /**
     * The first effect. This will run when props change and will determine which styles to apply
     * e.g className="active:text-red-500" should only apply when the component is active
     * Other conditions are
     *  : Media Queries
     *  - Container Queries
     *  - Pseudo Classes
     *
     * Once it works out which rules are relevant, it will then sort them by specificity
     * From MDN:
     * "Specificity is the algorithm used by browsers to determine the CSS declaration that
     *  is the most relevant to an element, which in turn, determines the property value to
     *  apply to the element. The specificity algorithm calculates the weight of a CSS selector
     *  to determine which rule from competing CSS declarations gets applied to an element."
     * @see https://developer.mozilla.org/en-US/docs/Web/CSS/Specificity
     */
    declarationEffect: {
      dependencies: new Set<() => void>(),
      rerun(isRendering: boolean = false) {
        // Clean up any previous effects which may have subscribed to external event handlers
        cleanupEffect(propState.declarationEffect);

        const tracking = propState.tracking;
        const classNames = propState.refs.props?.[propState.source];
        const inlineStyles = propState.refs.props?.[config.target];

        tracking.index = 0;
        tracking.changed = tracking.inlineStyles !== inlineStyles;
        tracking.inlineStyles = inlineStyles;

        const normal: StyleRule[] = [];
        const important: StyleRule[] = [];

        if (typeof classNames === "string") {
          // ClassNames will be space separated (any number of spaces)
          for (const className of classNames.split(/\s+/)) {
            /*
             * 1. Get the StyleRuleSet from the global style map
             * 2. Loop over the rules and determine if they should be applied
             * 3. Add it to either the normal or important array
             */
            addStyle(propState, className, normal, important);
            externalCallbackRef.current?.(className);
          }
        }

        // Check if the number of matching rules have changed
        tracking.changed ||=
          tracking.rules.length !== normal.length + important.length;

        // If nothing has changed, we can skip the rest of the process
        if (!tracking.changed) return false;

        // Sort the styles by their specificity
        normal.sort(specificityCompare);
        important.sort(specificityCompare);

        /*
         * Inline styles are applied after classNames.
         * They may be StyleRuleSets, but they are applied as if they were inline styles
         * These are added after storing, as they 'win' in specificity.
         * They are also applied Left->Right instead of following specificity order
         *
         * NOTE: This is relevant for remapProps, which change `className` to inline styles
         *       It these upgraded styles don't follow specificity order - they follow inline order
         */
        if (Array.isArray(inlineStyles)) {
          // RN styles can be an array, we need to flatten them so they can be added to `normal` and `important`
          const flat = inlineStyles.flat(10).sort(specificityCompare);
          for (const style of flat) {
            addStyle(propState, style, normal, important);
          }
        } else if (inlineStyles) {
          addStyle(propState, inlineStyles, normal, important);
        }

        propState.declarations = [];
        propState.importantDeclarations = [];
        propState.animation = undefined;
        propState.transition = undefined;
        propState.variables = undefined;
        propState.containerNames = undefined;

        // Loop over the matching StyleRules and get their style properties/variables/animations
        // Because they are sorted by specificity, the last rule will 'win'
        addDeclarations(propState, normal, propState.declarations);
        addDeclarations(propState, important, propState.importantDeclarations);

        // Now everything is sorted, we need to actually apply the declarations
        propState.styleEffect.rerun(isRendering);

        return tracking.changed;
      },
    },
    styleEffect: {
      dependencies: new Set<() => void>(),
      rerun(isRendering = false) {
        cleanupEffect(propState.styleEffect);

        const props: Record<string, any> = {};
        const normalizedProps: Record<string, any> = {};
        const delayedValues: (() => void)[] = [];
        const seenAnimatedProps = new Set<string>();

        /**
         * Apply the matching declarations to the props in Cascading order
         * From MDN:
         * "The cascade lies at the core of CSS, as emphasized by the name: Cascading Style Sheets."
         * "The cascade is an algorithm that defines how user agents combine property values originating from different sources. "
         * @see https://developer.mozilla.org/en-US/docs/Web/CSS/Cascade
         *
         * TLDR: The order is (lowest to highest)
         *  - Normal Declarations
         *  - Animations
         *  - Important Declarations
         *  - Transitions
         */

        // This loops over the declarations, calculates the values, and applies them to the correct props
        // E.g ["color", "red"] -> { color: "red" }
        processDeclarations(
          propState,
          propState.declarations,
          props,
          normalizedProps,
          delayedValues,
        );

        // Same as processDeclarations, but for animations (working with SharedValues)
        processAnimations(props, normalizedProps, seenAnimatedProps, propState);

        // Important declarations are applied after normal declarations and animations
        processDeclarations(
          propState,
          propState.importantDeclarations,
          props,
          normalizedProps,
          delayedValues,
        );

        // Some declarations will have values that had dependencies on other styles
        // e.g
        //  - lineHeight: '2rem' depends on the fontSize
        //  - color: var(--theme-fg) depends on the --theme-fg variable that could be present
        for (const delayed of delayedValues) {
          delayed();
        }

        // Look at what has changed between renders, replace their values with SharedValues
        // that interpolate between the old and new values
        processTransition(props, normalizedProps, seenAnimatedProps, propState);

        // Animations and Transitions screw with things. Once an component has been upgraded to an
        // animated component, some of its props will be SharedValues. We need to keep these props
        // as shared values.
        retainSharedValues(
          props,
          normalizedProps,
          seenAnimatedProps,
          propState,
        );

        // Moves styles to the correct props
        // { style: { fill: 'red' } -> { fill: 'red' }
        nativeStyleToProp(props, config);

        // We changed while not rerendering (e.g from a Media Query), so we need to notify React
        if (!isRendering) {
          componentState.rerender();
        }

        // Mutate the propState with the new props
        propState.props = props;
      },
    },
  };
  return propState;
}

/**
 * 1. Get the StyleRuleSet from the global style map
 * 2. Loop over the rules and determine if they should be applied
 * 3. Add it to either the normal or important array
 * @param propState
 * @param style
 * @param normal
 * @param important
 * @returns
 */
function addStyle(
  propState: PropState,
  style: string | StyleRuleSet,
  normal: StyleRule[],
  important: StyleRule[],
) {
  const ruleSet =
    typeof style === "string"
      ? globalStyles.get(style)?.get(propState.declarationEffect)
      : opaqueStyles.has(style)
      ? opaqueStyles.get(style)
      : style;

  if (!ruleSet) {
    // This doesn't exist now, but it might in the future.
    // So we create a placeholder style that we can observe
    if (typeof style === "string") {
      const styleObservable = observable<StyleRuleSet>(
        { $$type: "StyleRuleSet" },
        { name: style },
      );
      styleObservable.get(propState.declarationEffect);
      globalStyles.set(style, styleObservable);
    }
    return;
  }

  // This is an inline style object and not one we have generated
  if (!("$$type" in ruleSet)) {
    normal.push(ruleSet);
    return;
  }

  // Will the component need to be upgraded
  const upgrades = propState.upgrades;
  if (ruleSet.animation) upgrades.animated ||= UpgradeState.SHOULD_UPGRADE;
  if (ruleSet.variables) upgrades.variables ||= UpgradeState.SHOULD_UPGRADE;
  if (ruleSet.container) upgrades.containers ||= UpgradeState.SHOULD_UPGRADE;

  // 2. Loop over the rules and determine if they should be applied
  // 3. Add it to either the normal or important array
  const tracking = propState.tracking;
  if (ruleSet.normal) {
    for (const rule of ruleSet.normal) {
      if (testRule(propState, rule, propState.refs.props)) {
        // Add the rule
        normal.push(rule);
        // Track is the rule changed
        tracking.index++;
        tracking.changed ||= tracking.rules[tracking.index] !== rule;
        tracking.rules[tracking.index] = rule;
      }
    }
  }

  if (ruleSet.important) {
    for (const rule of ruleSet.important) {
      if (testRule(propState, rule, propState.refs.props)) {
        // Add the rule
        important.push(rule);
        // Track is the rule changed
        tracking.index++;
        tracking.changed ||= tracking.rules[tracking.index] !== rule;
        tracking.rules[tracking.index] = rule;
      }
    }
  }
}

/**
 * Apply the matching declarations to the props
 * @param propState
 * @param rules
 * @param target
 */
function addDeclarations(
  propState: PropState,
  rules: StyleRule[],
  target: StyleDeclaration[],
) {
  for (const rule of rules) {
    if ("$$type" in rule) {
      if (rule.animations) {
        propState.animation ??= { ...defaultAnimation, waitingLayout: false };
        Object.assign(propState.animation, rule.animations);
      }

      if (rule.transition) {
        propState.transition ??= { ...defaultTransition };
        Object.assign(propState.transition, rule.transition);
      }

      if (rule.variables) {
        propState.variables ??= {};
        for (const variable of rule.variables) {
          propState.variables[variable[0]] = variable[1];
        }
      }

      if (rule.container) {
        propState.containerNames = rule.container.names;
      }

      if (rule.declarations) {
        target.push(...rule.declarations);
      }
    } else {
      target.push(rule);
    }
  }
}

export function specificityCompare(
  o1?: object | StyleRule | null,
  o2?: object | StyleRule | null,
) {
  if (!o1) return -1;
  if (!o2) return 1;

  const a = "specificity" in o1 ? o1.specificity : inlineSpecificity;
  const b = "specificity" in o2 ? o2.specificity : inlineSpecificity;

  if (a.I && b.I && a.I !== b.I) {
    return a.I - b.I; /* Important */
  } else if (a.inline && b.inline && a.inline !== b.inline) {
    return a.inline ? 1 : -1; /* Inline */
  } else if (a.A && b.A && a.A !== b.A) {
    return a.A - b.A; /* Ids */
  } else if (a.B && b.B && a.B !== b.B) {
    return a.B - b.B; /* Classes */
  } else if (a.C && b.C && a.C !== b.C) {
    return a.C - b.C; /* Styles */
  } else if (a.S && b.S && a.S !== b.S) {
    return a.S - b.S; /* StyleSheet Order */
  } else {
    return 0; /* Appearance Order */
  }
}

const inlineSpecificity: Specificity = { inline: 1 };
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
