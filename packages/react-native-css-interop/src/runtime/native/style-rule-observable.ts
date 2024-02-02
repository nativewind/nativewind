import type {
  StyleDeclaration,
  RuntimeValueDescriptor,
  ExtractedAnimations,
  ExtractedTransition,
  StyleRuleSet,
  StyleRule,
  Specificity,
  AttributeDependency,
} from "../../types";
import type { ComponentState } from "./native-interop";

import { UpgradeState } from "./render-component";
import { Effect, cleanupEffect } from "../observable";
import { testRule } from "./conditions";
import { globalStyles, opaqueStyles } from "./style-store";

/**
 * An observable that returns the current StyleRules
 * This may change externally due to Media Queries, or during render because of pseudo classes/attributes/container queries
 */
export class StyleRuleObservable implements Effect {
  public dependencies: Set<() => void> = new Set();

  private classNames: string | undefined;
  private inlineStyles: any;
  public originalProps: Record<string, any> | null | undefined;

  private trackedRules: StyleRule[] = [];
  public attributeDependencies: AttributeDependency[] = [];

  public declarations: StyleDeclaration[] | undefined;
  public importantDeclarations: StyleDeclaration[] | undefined;
  public variables: Record<string, RuntimeValueDescriptor> | undefined;
  public containerNames: false | string[] | undefined;
  public animation: Required<ExtractedAnimations> | undefined;
  public transition: Required<ExtractedTransition> | undefined;

  constructor(
    private source: string,
    private target: string,
    public component: ComponentState,
    private inheritedContainers: Record<string, any>,
    private notifyChanged: () => void,
  ) {
    this.rerun = this.rerun.bind(this);
  }

  cleanup() {
    cleanupEffect(this);
  }

  updateDuringRender(
    originalProps: Record<string, any> | null,
    inheritedContainers: Record<string, any>,
  ) {
    this.originalProps = originalProps;
    const classNames = originalProps?.[this.source];
    const inlineStyles = originalProps?.[this.target];
    let didUpdate = false;

    if (
      classNames !== this.classNames ||
      inlineStyles !== this.inlineStyles ||
      this.inheritedContainers !== inheritedContainers ||
      this.attributeDependencies.some((dependency) => {
        const value =
          dependency.type === "data-attribute"
            ? originalProps?.dataSet?.[dependency.name]
            : originalProps?.[dependency.name];
        return dependency.previous !== value;
      })
    ) {
      if (this.classNames) {
      }
      // Get the new StyleRule
      this.classNames = classNames;
      const forceChange = this.inlineStyles !== inlineStyles;
      this.inlineStyles = inlineStyles;
      didUpdate = this.rerun(true, forceChange);
    }
    this.inheritedContainers = inheritedContainers;
    return didUpdate;
  }

  rerun(isRendering = false, forceChange = false) {
    // Cleanup the previous dependencies
    cleanupEffect(this);

    let didChange = false;

    let trackingIndex = 0;
    const trackedRules: StyleRule[] = [];

    const normal: StyleRule[] = [];
    const important: StyleRule[] = [];
    this.attributeDependencies = [];

    const addStyle = (style: string | StyleRuleSet) => {
      const ruleSet =
        typeof style === "string"
          ? globalStyles.get(style)?.get(this)
          : opaqueStyles.has(style)
          ? opaqueStyles.get(style)
          : style;

      if (!ruleSet) return;

      if (!("$$type" in ruleSet)) {
        normal.push(ruleSet);
        return;
      }

      if (ruleSet.animation && !this.component.upgrades.animated) {
        this.component.upgrades.animated = UpgradeState.SHOULD_UPGRADE;
      }

      if (ruleSet.variables && !this.component.upgrades.variables) {
        this.component.upgrades.variables = UpgradeState.SHOULD_UPGRADE;
      }

      if (ruleSet.container && !this.component.upgrades.containers) {
        this.component.upgrades.containers = UpgradeState.SHOULD_UPGRADE;
      }

      if (ruleSet.normal) {
        for (const rule of ruleSet.normal) {
          if (testRule(this, rule, this.originalProps)) {
            trackingIndex++;
            didChange ||= this.trackedRules[trackingIndex] !== rule;
            normal.push(rule);
            trackedRules.push(rule);
          }
        }
      }

      if (ruleSet.important) {
        for (const rule of ruleSet.important) {
          if (testRule(this, rule, this.originalProps)) {
            trackingIndex++;
            didChange ||= this.trackedRules[trackingIndex] !== rule;
            important.push(rule);
            trackedRules.push(rule);
          }
        }
      }
    };

    if (typeof this.classNames === "string") {
      for (const className of this.classNames.split(/\s+/)) {
        addStyle(className);
      }
    }

    if (
      !forceChange &&
      !didChange &&
      normal.length + important.length === this.trackedRules.length
    ) {
      return false;
    }

    normal.sort(specificityCompare);
    important.sort(specificityCompare);

    /*
     * Inline styles are applied after classNames.
     * They may be StyleRuleSets, but they are applied as if they were inline styles
     */
    if (Array.isArray(this.inlineStyles)) {
      const flat = this.inlineStyles.flat(10).sort(specificityCompare);
      for (const style of flat) {
        addStyle(style);
      }
    } else if (this.inlineStyles) {
      addStyle(this.inlineStyles);
    }

    this.trackedRules = trackedRules;
    this.declarations = [];
    this.importantDeclarations = [];
    this.animation = undefined;
    this.transition = undefined;
    this.variables = undefined;
    this.containerNames = undefined;

    const addDeclarations = (
      rules: StyleRule[],
      target: StyleDeclaration[],
    ) => {
      for (const rule of rules) {
        if ("$$type" in rule) {
          if (rule.animations) {
            this.animation ??= { ...defaultAnimation };
            Object.assign(this.animation, rule.animations);
          }

          if (rule.transition) {
            this.transition ??= { ...defaultTransition };
            Object.assign(this.transition, rule.transition);
          }

          if (rule.variables) {
            this.variables ??= {};
            for (const [key, value] of rule.variables) {
              this.variables[key] = value;
            }
          }

          if (rule.container) {
            this.containerNames = rule.container.names;
          }

          if (rule.declarations) {
            target.push(...rule.declarations);
          }
        } else {
          target.push(rule);
        }
      }
    };

    addDeclarations(normal, this.declarations);
    addDeclarations(important, this.importantDeclarations);

    // We changed while not rerendering (e.g from a Media Query), so we need to notify React
    if (!isRendering) {
      this.notifyChanged();
    }

    return true;
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
