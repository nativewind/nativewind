import { useContext, useEffect, useState } from "react";
import { Effect, Observable, cleanupEffect } from "../observable";
import {
  AttributeDependency,
  ExtractedAnimations,
  ExtractedTransition,
  InteropComponentConfig,
  ReactComponent,
  Specificity,
  StyleDeclaration,
  StyleRule,
  StyleRuleSet,
} from "../../types";
import { containerContext, variableContext } from "./globals";
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
    attributes?: AttributeDependency[];
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

export function interop(
  baseComponent: ReactComponent<any>,
  configs: InteropComponentConfig[],
  props: Record<string, any> | null,
  ref: any,
) {
  let variables = useContext(variableContext);
  let containers = useContext(containerContext);

  const [componentState, setState] = useState(() => {
    const componentState: ComponentState = {
      refs: { props, containers, variables },
      interaction: {},
      upgrades: {},
      propStates: [],
      rerender: () => {
        setState((state) => ({ ...state }));
      },
    };
    componentState.propStates = configs.map((config) => {
      return createPropState(componentState, config);
    });

    return componentState;
  });

  useEffect(() => {
    return () => {
      for (const prop of componentState.propStates) {
        cleanupEffect(prop.declarationEffect);
        cleanupEffect(prop.styleEffect);
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

  componentState.refs.props = props;
  componentState.refs.containers = containers;
  componentState.refs.variables = variables;

  // Clone the props into a new object, as props will be frozen
  props = { ...props, ref };

  // We need to rerun all the prop states to get the styled props
  for (const propState of componentState.propStates) {
    propState.declarationEffect.rerun(true);

    // Set the styled props
    Object.assign(props, propState.props);

    // Remove any source props
    if (propState.target !== propState.source) {
      delete props[propState.source];
    }

    if (propState.variables) {
      variables = { ...variables, ...propState.variables };
    }
    if (propState.containerNames) {
      containers = { ...containers };
      for (const name of propState.containerNames) {
        containers[name] = componentState;
      }
      containers[DEFAULT_CONTAINER_NAME] = componentState;
    }
  }

  return renderComponent(
    baseComponent,
    componentState,
    props,
    variables,
    containers,
  );
}

function createPropState(
  componentState: ComponentState,
  config: InteropComponentConfig,
) {
  const propState: PropState = {
    ...config,
    upgrades: componentState.upgrades,
    interaction: componentState.interaction,
    refs: componentState.refs,
    testID: componentState.refs.props?.testID,

    tracking: {
      index: 0,
      rules: [],
      changed: false,
    },
    declarationEffect: {
      dependencies: new Set<() => void>(),
      rerun(isRendering: boolean = false) {
        cleanupEffect(propState.declarationEffect);

        const tracking = propState.tracking;
        const classNames = propState.refs.props?.[propState.source];
        const inlineStyles = propState.refs.props?.[config.target];

        if (propState.refs.props?.testID) {
          console.log("1", classNames);
        }

        tracking.index = 0;
        tracking.changed = tracking.inlineStyles !== inlineStyles;
        tracking.inlineStyles = inlineStyles;

        const normal: StyleRule[] = [];
        const important: StyleRule[] = [];

        if (typeof classNames === "string") {
          for (const className of classNames.split(/\s+/)) {
            addStyle(propState, className, normal, important);
          }
        }

        tracking.changed ||=
          tracking.rules.length !== normal.length + important.length;

        if (!tracking.changed) return false;

        normal.sort(specificityCompare);
        important.sort(specificityCompare);

        /*
         * Inline styles are applied after classNames.
         * They may be StyleRuleSets, but they are applied as if they were inline styles
         */
        if (Array.isArray(inlineStyles)) {
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

        addDeclarations(propState, normal, propState.declarations);
        addDeclarations(propState, important, propState.importantDeclarations);

        if (tracking.changed) {
          propState.styleEffect.rerun(isRendering);
        }

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

        processDeclarations(
          propState,
          propState.declarations,
          props,
          normalizedProps,
          delayedValues,
        );

        processAnimations(props, normalizedProps, seenAnimatedProps, propState);

        processDeclarations(
          propState,
          propState.importantDeclarations,
          props,
          normalizedProps,
          delayedValues,
        );

        for (const delayed of delayedValues) {
          delayed();
        }

        processTransition(props, normalizedProps, seenAnimatedProps, propState);

        retainSharedValues(
          props,
          normalizedProps,
          seenAnimatedProps,
          propState,
        );

        nativeStyleToProp(props, config);

        // We changed while not rerendering (e.g from a Media Query), so we need to notify React
        if (!isRendering) {
          componentState.rerender();
        }

        propState.props = props;
      },
    },
  };
  return propState;
}

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

  if (!ruleSet) return;

  if (!("$$type" in ruleSet)) {
    normal.push(ruleSet);
    return;
  }

  const upgrades = propState.upgrades;
  if (ruleSet.animation) upgrades.animated ||= UpgradeState.SHOULD_UPGRADE;
  if (ruleSet.variables) upgrades.variables ||= UpgradeState.SHOULD_UPGRADE;
  if (ruleSet.container) upgrades.containers ||= UpgradeState.SHOULD_UPGRADE;

  const tracking = propState.tracking;
  if (ruleSet.normal) {
    for (const rule of ruleSet.normal) {
      if (testRule(propState, rule, propState.refs.props)) {
        tracking.index++;
        tracking.changed ||= tracking.rules[tracking.index] !== rule;
        tracking.rules[tracking.index] = rule;
        normal.push(rule);
      }
    }
  }

  if (ruleSet.important) {
    for (const rule of ruleSet.important) {
      if (testRule(propState, rule, propState.refs.props)) {
        tracking.index++;
        tracking.changed ||= tracking.rules[tracking.index] !== rule;
        tracking.rules[tracking.index] = rule;
        important.push(rule);
      }
    }
  }
}

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
        for (const [key, value] of rule.variables) {
          propState.variables[key] = value;
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
  } else if (a.O && b.O && a.O !== b.O) {
    return a.O - b.O; /* Appearance Order */
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
