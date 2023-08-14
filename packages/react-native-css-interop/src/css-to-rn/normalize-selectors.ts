import type { Selector, SelectorList } from "lightningcss";
import { ExtractRuleOptions } from "../types";

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
    };

export function normalizeSelectors(
  selectorList: SelectorList,
  options: ExtractRuleOptions,
  normalizedSelectors: NormalizeSelector[] = [],
  defaults: Partial<NormalizeSelector> = {},
) {
  for (let selector of selectorList) {
    // Ignore `:is()`, and just process its selectors
    if (isIsPseudoClass(selector)) {
      normalizeSelectors(selector[0].selectors, options, normalizedSelectors);
      continue;
    }

    // Matches: :root {}
    if (isRootVariableSelector(selector)) {
      normalizedSelectors.push({
        type: "variables",
        rootVariables: true,
      });
      continue;
    }

    // Matches: .dark {}
    if (isRootDarkVariableSelector(selector, options)) {
      normalizedSelectors.push({
        type: "variables",
        darkMode: true,
        rootVariables: true,
      });
      continue;
    }

    // Matches:   * {}
    if (isDefaultVariableSelector(selector)) {
      normalizedSelectors.push({
        type: "variables",
        defaultVariables: true,
      });
      continue;
    }

    // Matches:  .dark * {}
    if (isDarkDefaultVariableSelector(selector, options)) {
      normalizedSelectors.push({
        type: "variables",
        darkMode: true,
        defaultVariables: true,
      });
      continue;
    }

    // Matches:  .dark <selector> {}
    if (isDarkClassSelector(selector, options)) {
      const [_, __, third, ...rest] = selector;
      normalizeSelectors([[third, ...rest]], options, normalizedSelectors, {
        darkMode: true,
      });
      continue;
    }

    let isValid = true;

    const normalizedSelector: NormalizeSelector = {
      ...defaults,
      type: "className",
      className: "",
    };

    let previousWasCombinator = true;

    for (const component of selector) {
      switch (component.type) {
        case "universal":
        case "namespace":
        case "id":
        case "attribute":
        case "pseudo-element":
        case "nesting":
          isValid = false;
          break;
        case "type": {
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

          // We can only have two classnames in a selector if the first one is a valid group
          if (normalizedSelector.className) {
            const groupingValid = options.grouping.some((group) =>
              group.test(normalizedSelector.className),
            );

            if (!groupingValid) {
              // If its invalid, dismiss the entire rule
              isValid = false;
            } else {
              // Otherwise make the current className the group
              normalizedSelector.groupClassName = normalizedSelector.className;
              normalizedSelector.className = component.name;
              normalizedSelector.groupPseudoClasses =
                normalizedSelector.pseudoClasses;
              normalizedSelector.pseudoClasses = {};
            }
          } else if (component.name === options.selectorPrefix?.slice(1)) {
            // Need to remove the leading `.`
            break;
          } else {
            normalizedSelector.className = component.name;
          }
          break;
        }
        case "pseudo-class": {
          if (!normalizedSelector.className) {
            isValid = false;
            break;
          }

          switch (component.kind) {
            case "hover":
            case "active":
            case "focus":
              normalizedSelector.pseudoClasses ??= {};
              normalizedSelector.pseudoClasses[component.kind] = true;
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

    normalizedSelectors.push(normalizedSelector);
  }

  return normalizedSelectors;
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
