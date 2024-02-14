import type {
  MediaQuery,
  Selector,
  SelectorComponent,
  SelectorList,
} from "lightningcss";
import {
  Specificity,
  ExtractRuleOptions,
  StyleRule,
  AttributeCondition,
} from "../types";

export type NormalizeSelector =
  | {
      type: "rootVariables" | "universalVariables";
      subtype: "light" | "dark";
    }
  | {
      type: "className";
      darkMode?: boolean;
      className: string;
      groupClassName?: string;
      pseudoClasses?: Record<string, true>;
      groupPseudoClasses?: Record<string, true>;
      groupAttrs?: AttributeCondition[];
      attrs?: AttributeCondition[];
      specificity: Pick<Specificity, "A" | "B" | "C">;
    };

/**
 * Turns a CSS selector into a `react-native-css-interop` selector.
 */
export function normalizeSelectors(
  extractedStyle: StyleRule,
  selectorList: SelectorList,
  options: ExtractRuleOptions,
  selectors: NormalizeSelector[] = [],
  defaults: Partial<NormalizeSelector> = {},
) {
  for (let cssSelector of selectorList) {
    // Ignore `:is()`, and just process its selectors
    if (isIsPseudoClass(cssSelector)) {
      normalizeSelectors(
        extractedStyle,
        cssSelector[0].selectors,
        options,
        selectors,
      );
      continue;
    }

    // Matches: :root {}
    if (isRootVariableSelector(cssSelector)) {
      if (isDarkModeMediaQuery(extractedStyle.media?.[0])) {
        selectors.push({
          type: "rootVariables",
          subtype: "dark",
        });
      } else {
        selectors.push({
          type: "rootVariables",
          subtype: "light",
        });
      }
      continue;
    }

    // Matches: .dark:root {}
    if (isRootDarkVariableSelector(cssSelector, options)) {
      selectors.push({
        type: "rootVariables",
        subtype: "dark",
      });
      continue;
    }

    // Matches: * {}
    if (isDefaultVariableSelector(cssSelector)) {
      if (isDarkModeMediaQuery(extractedStyle.media?.[0])) {
        selectors.push({
          type: "universalVariables",
          subtype: "dark",
        });
      } else {
        selectors.push({
          type: "universalVariables",
          subtype: "light",
        });
      }
      continue;
    }

    // Matches:  .dark * {}
    if (isDarkDefaultVariableSelector(cssSelector, options)) {
      selectors.push({
        type: "universalVariables",
        subtype: "dark",
      });
      continue;
    }

    // Matches:  .dark <selector> {}
    if (isDarkClassSelector(cssSelector, options)) {
      const [_, __, third, ...rest] = cssSelector;
      normalizeSelectors(
        extractedStyle,
        [[third, ...rest]],
        options,
        selectors,
        {
          darkMode: true,
        },
      );
      continue;
    }

    let isValid = true;
    let previousType: SelectorComponent["type"] = "combinator";
    let inGroup = false;

    const selector: NormalizeSelector = {
      ...defaults,
      type: "className",
      className: "",
      specificity: {},
    };

    /*
     * Loop over each token and the cssSelector and parse it into a `react-native-css-interop` selector
     */
    for (const component of cssSelector) {
      if (!isValid) {
        break;
      }

      switch (component.type) {
        case "universal":
        case "namespace":
        case "nesting":
        case "id":
        case "pseudo-element":
          // We don't support these selectors at all
          isValid = false;
          break;
        case "attribute": {
          // Turn attribute selectors into AttributeConditions
          selector.specificity.B ??= 0;
          selector.specificity.B++;

          let attrs: AttributeCondition[];
          if (inGroup) {
            selector.groupAttrs ??= [];
            attrs = selector.groupAttrs;
          } else {
            selector.attrs ??= [];
            attrs = selector.attrs;
          }

          if (component.name.startsWith("data-")) {
            attrs.push({
              ...component,
              name: toRNProperty(component.name.replace("data-", "")),
              type: "data-attribute",
            });
          } else {
            attrs.push(component);
          }
          break;
        }
        case "type": {
          selector.specificity.C ??= 0;
          selector.specificity.C++;
          /*
           * We only support type selectors as part of the selector prefix
           * For example: `html .my-class`
           */
          isValid = component.name === options.selectorPrefix;
          break;
        }
        case "combinator": {
          // We only support the descendant combinator, this is used for groups
          if (component.value !== "descendant") {
            isValid = false;
          }

          inGroup = false;

          break;
        }
        case "class": {
          selector.specificity.B ??= 0;
          selector.specificity.B++;

          // .class.otherClass is only valid if the previous class was a valid group, or the last token was a combinator
          switch (previousType) {
            // <something> .class
            case "combinator": {
              // We can only have two classnames in a selector if the first one is a valid group
              if (selector.className) {
                // .className .otherClassName
                // This will only occur if the first className is not a group
                isValid = false;
              } else if (component.name === options.selectorPrefix?.slice(1)) {
                // If the name matches the selectorPrefix, just ignore it!
                // E.g .dark .myClass
                break;
              } else {
                const groupingValid =
                  !selector.groupClassName &&
                  options.grouping.some((group) => {
                    return group.test(component.name);
                  });

                if (groupingValid) {
                  // Otherwise make the current className the group
                  selector.groupClassName = component.name;
                  selector.groupPseudoClasses = selector.pseudoClasses;
                  selector.pseudoClasses = {};
                  inGroup = true;
                } else if (!selector.className) {
                  selector.className = component.name;
                } else {
                  isValid = false;
                }
              }
              break;
            }
            // .class.otherClass
            case "class": {
              if (!inGroup) {
                isValid = false;
                break;
              }

              // We are in a group selector, so any additional classes are groupAttributes
              selector.groupAttrs ??= [];
              selector.groupAttrs.push({
                type: "attribute",
                name: "className",
                operation: { operator: "includes", value: component.name },
              });
              break;
            }
            default: {
              isValid = false;
            }
          }
          break;
        }
        case "pseudo-class": {
          selector.specificity.B ??= 0;
          selector.specificity.B++;

          let pseudoClasses: Record<string, true>;
          let attrs: AttributeCondition[];

          switch (previousType) {
            case "pseudo-class":
            case "class": {
              if (selector.className) {
                selector.pseudoClasses ??= {};
                pseudoClasses = selector.pseudoClasses;
                selector.attrs ??= [];
                attrs = selector.attrs;
              } else if (selector.groupClassName) {
                selector.groupPseudoClasses ??= {};
                pseudoClasses = selector.groupPseudoClasses;
                selector.groupAttrs ??= [];
                attrs = selector.groupAttrs;
              } else {
                isValid = false;
              }
              break;
            }
            default: {
              isValid = false;
            }
          }

          if (!isValid) {
            break;
          }

          switch (component.kind) {
            case "hover":
            case "active":
            case "focus":
              pseudoClasses ??= {};
              pseudoClasses[component.kind] = true;
              break;
            case "disabled":
              attrs ??= [];
              attrs.push({
                type: "attribute",
                name: "disabled",
                operation: { operator: "truthy" },
              });
              break;
            case "empty":
              attrs ??= [];
              attrs.push({
                type: "attribute",
                name: "children",
                operation: { operator: "empty" },
              });
              break;
          }
        }
      }

      previousType = component.type;
    }

    if (!selector.className) {
      isValid = false;
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

function isDarkModeMediaQuery(query?: MediaQuery): boolean {
  return Boolean(
    query?.condition &&
      query.condition.type === "feature" &&
      query.condition.value.type === "plain" &&
      query.condition.value.name === "prefers-color-scheme" &&
      query.condition.value.value.value === "dark",
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

export function toRNProperty(str: string) {
  return str.replace(/^-rn-/, "").replace(/-./g, (x) => x[1].toUpperCase());
}
