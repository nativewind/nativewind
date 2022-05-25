const cacheKey = Symbol("tailwind-cache-key");

let stylesheet: CSSStyleSheet & {
  [cacheKey]: Record<string, Record<string, unknown>>;
};

export function classNameToInline(className: string) {
  if (!stylesheet) findStyleSheet(className);

  const styles = {};
  for (const name of className.split(/\s+/)) {
    if (!name) continue;
    Object.assign(styles, getStyles(name));
  }

  return styles;
}

/**
 * Finds a stylesheet that includes this css selector
 */
function findStyleSheet(className: string) {
  const firstClassName = className.split(/\s+/).find(Boolean);
  if (stylesheet) return stylesheet;
  const maybeStyleSheet = [
    ...(document.styleSheets as unknown as CSSStyleSheet[]),
  ].find((stylesheet) => {
    return [...(stylesheet.cssRules as unknown as CSSRule[])].find(
      (cssRule) => {
        return (
          isCSSStyleRule(cssRule) &&
          cssRule.selectorText.includes(`.${firstClassName}`)
        );
      }
    );
  });

  if (maybeStyleSheet) {
    stylesheet = Object.assign(maybeStyleSheet, { [cacheKey]: {} });
  }
}

function getStyles(className: string) {
  if (stylesheet[cacheKey][className]) {
    return stylesheet[cacheKey][className];
  }

  const rule = [
    ...(stylesheet.cssRules as unknown as CSSRule[]),
  ].find<CSSStyleRule>((cssRule): cssRule is CSSStyleRule => {
    return (
      isCSSStyleRule(cssRule) && cssRule.selectorText.includes(`.${className}`)
    );
  });

  stylesheet[cacheKey][className] = {};

  if (rule) {
    for (const key of rule.style as unknown as string[]) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      stylesheet[cacheKey][className][key] = (rule.style as any)[key];
    }
  }

  return stylesheet[cacheKey][className];
}

function isCSSStyleRule(rule: CSSRule): rule is CSSStyleRule {
  return "selectorText" in rule;
}
