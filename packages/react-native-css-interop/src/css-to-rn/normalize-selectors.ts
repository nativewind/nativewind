import type { Selector, SelectorList } from "lightningcss";
import { CSSSpecificity, ExtractRuleOptions } from "../types";

export type NormalizeSelector =
  | {
      type: "variables";
      darkMode?: boolean;
      rootVariables?: boolean;
      defaultVariables?: boolean;
    }
  | {
      type: "className";
      darkMode?: boolean;
      className: string;
      groupClassName?: string;
      pseudoClasses?: Record<string, true>;
      groupPseudoClasses?: Record<string, true>;
      specificity: Pick<CSSSpecificity, "A" | "B" | "C">;
    };

export function normalizeSelectors(
  selectorList: SelectorList,
  options: ExtractRuleOptions,
  selectors: NormalizeSelector[] = [],
  defaults: Partial<NormalizeSelector> = {},
) {
  for (let lightningCssSelector of selectorList) {
    // Ignore `:is()`, and just process its selectors
    if (isIsPseudoClass(lightningCssSelector)) {
      normalizeSelectors(lightningCssSelector[0].selectors, options, selectors);
      continue;
    }

    // Matches: :root {}
    if (isRootVariableSelector(lightningCssSelector)) {
      selectors.push({
        type: "variables",
        rootVariables: true,
      });
      continue;
    }

    // Matches: .dark {}
    if (isRootDarkVariableSelector(lightningCssSelector, options)) {
      selectors.push({
        type: "variables",
        darkMode: true,
        rootVariables: true,
      });
      continue;
    }

    // Matches:   * {}
    if (isDefaultVariableSelector(lightningCssSelector)) {
      selectors.push({
        type: "variables",
        defaultVariables: true,
      });
      continue;
    }

    // Matches:  .dark * {}
    if (isDarkDefaultVariableSelector(lightningCssSelector, options)) {
      selectors.push({
        type: "variables",
        darkMode: true,
        defaultVariables: true,
      });
      continue;
    }

    // Matches:  .dark <selector> {}
    if (isDarkClassSelector(lightningCssSelector, options)) {
      const [_, __, third, ...rest] = lightningCssSelector;
      normalizeSelectors([[third, ...rest]], options, selectors, {
        darkMode: true,
      });
      continue;
    }

    let isValid = true;

    const selector: NormalizeSelector = {
      ...defaults,
      type: "className",
      className: "",
      specificity: { A: 0, B: 0, C: 0 },
    };

    let previousWasCombinator = true;

    for (const component of lightningCssSelector) {
      switch (component.type) {
        case "universal":
        case "namespace":
        case "nesting":
          isValid = false;
          break;
        case "id":
          selector.specificity.A++;
          isValid = false;
          break;
        case "attribute":
          selector.specificity.B++;
          isValid = false;
          break;
        case "pseudo-element":
          selector.specificity.C++;
          isValid = false;
          break;
        case "type": {
          selector.specificity.C++;
          isValid = component.name === options.selectorPrefix;
          break;
        }
        case "combinator": {
          if (component.value !== "descendant") {
            isValid = false;
          } else {
            previousWasCombinator = true;
          }
          break;
        }
        case "class": {
          // .class.otherClass is not valid, you need a combinator in between
          if (!previousWasCombinator) {
            isValid = false;
            break;
          }

          selector.specificity.B++;

          // We can only have two classnames in a selector if the first one is a valid group
          if (selector.className) {
            const groupingValid = options.grouping.some((group) => {
              return group.test(selector.className);
            });

            if (!groupingValid) {
              // If its invalid, dismiss the entire rule
              isValid = false;
            } else {
              // Otherwise make the current className the group
              selector.groupClassName = selector.className;
              selector.className = component.name;
              selector.groupPseudoClasses = selector.pseudoClasses;
              selector.pseudoClasses = {};
            }
          } else if (component.name === options.selectorPrefix?.slice(1)) {
            // Need to remove the leading `.`
            break;
          } else {
            selector.className = component.name;
          }
          break;
        }
        case "pseudo-class": {
          if (!selector.className) {
            isValid = false;
            break;
          }

          selector.specificity.B++;

          switch (component.kind) {
            case "hover":
            case "active":
            case "focus":
              selector.pseudoClasses ??= {};
              selector.pseudoClasses[component.kind] = true;
              break;
            default: {
              isValid = false;
            }
          }
        }
      }

      if (!isValid) {
        break;
      }
    }

    if (!isValid) {
      continue;
    }

    selectors.push(selector);
  }

  return selectors;
}

function isIsPseudoClass(
  selector: Selector,
): selector is [{ type: "pseudo-class"; kind: "is"; selectors: Selector[] }] {
  return (
    selector.length === 1 &&
    selector[0].type === "pseudo-class" &&
    selector[0].kind === "is"
  );
}

// Matches:  .dark <selector> {}
function isDarkClassSelector(
  [first, second, third]: Selector,
  options: ExtractRuleOptions,
) {
  return (
    options.darkMode?.type === "class" &&
    first &&
    second &&
    third &&
    first.type === "class" &&
    first.name === options.darkMode?.value &&
    second.type === "combinator" &&
    second.value === "descendant" &&
    third.type === "class"
  );
}

// Matches:  :root {}
function isRootVariableSelector([first, second]: Selector) {
  return (
    first && !second && first.type === "pseudo-class" && first.kind === "root"
  );
}

// Matches:  * {}
function isDefaultVariableSelector([first, second]: Selector) {
  return first && !second && first.type === "universal";
}

// Matches:  .dark:root  {}
function isRootDarkVariableSelector(
  [first, second]: Selector,
  options: ExtractRuleOptions,
) {
  return (
    options.darkMode?.type === "class" &&
    first.type === "class" &&
    first.name === options.darkMode.value &&
    second &&
    second.type === "pseudo-class" &&
    second.kind === "root"
  );
}

// Matches:  .dark * {}
function isDarkDefaultVariableSelector(
  [first, second, third]: Selector,
  options: ExtractRuleOptions,
) {
  return (
    options.darkMode?.type === "class" &&
    first &&
    second &&
    third &&
    first.type === "class" &&
    first.name === options.darkMode.value &&
    second.type === "combinator" &&
    second.value === "descendant" &&
    third.type === "universal"
  );
}
