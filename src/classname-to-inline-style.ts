import { UseTailwindOptions } from "./use-tailwind";

const cacheKey = Symbol("tailwind-cache-key");

let stylesheet: CSSStyleSheet & {
  [cacheKey]: Record<string, Record<string, unknown>>;
};

/**
 * When preview = true, all the styles are compiled to CSS.
 * This means useTailwind and spreadProps need to pull their values
 * from the CSS StyleSheet to get their runtime values.
 *
 * This hasn't been benched-marked, but is assumed to be slow and unreliable.
 * This is why we recommend people avoid using useTailwind()/spreadProps for runtime values.
 */
export function classNameToInlineStyle(
  className: string,
  options: UseTailwindOptions = {}
) {
  if (!stylesheet) findStyleSheet(className);

  const styles = {};
  for (const name of className.split(/\s+/)) {
    if (!name) continue;
    Object.assign(styles, getStyles(CSS.escape(name), options));
  }

  return styles;
}

/**
 * Finds a stylesheet that includes this css selector
 */
function findStyleSheet(className: string) {
  if (stylesheet) return stylesheet;

  const firstClassName = className.split(/\s+/).find(Boolean) as string;
  const maybeStyleSheet = [
    ...(document.styleSheets as unknown as CSSStyleSheet[]),
  ].find((stylesheet) => {
    return [...(stylesheet.cssRules as unknown as CSSRule[])].find(
      (cssRule) => {
        return (
          isCSSStyleRule(cssRule) &&
          cssRule.selectorText.includes(`.${CSS.escape(firstClassName)}`)
        );
      }
    );
  });

  if (maybeStyleSheet) {
    stylesheet = Object.assign(maybeStyleSheet, { [cacheKey]: {} });
  }
}

function getStyles(
  className: string,
  { active, focus, hover }: UseTailwindOptions
) {
  const classNameCacheKey = `${className}:${active}:${focus}:${hover}`;

  if (stylesheet[cacheKey][classNameCacheKey]) {
    return stylesheet[cacheKey][classNameCacheKey];
  }

  const rule = [
    ...(stylesheet.cssRules as unknown as CSSRule[]),
  ].find<CSSStyleRule>((cssRule): cssRule is CSSStyleRule => {
    if (
      isCSSStyleRule(cssRule) &&
      cssRule.selectorText.includes(`.${className}`)
    ) {
      const states = [];

      // We cannot just test for `:active` as it will match hover\\:active-foobar:hover
      // Due to how classNames are escaped, we can just check for :active and ensure
      // it doesn't have an escape character before it.
      if (/[^\\]:active/.test(cssRule.selectorText)) states.push(active);
      if (/[^\\]:focus/.test(cssRule.selectorText)) states.push(focus);
      if (/[^\\]:hover/.test(cssRule.selectorText)) states.push(hover);

      return states.every(Boolean);
    }

    return false;
  });

  stylesheet[cacheKey][classNameCacheKey] = {};

  if (rule) {
    for (const key of rule.style as unknown as string[]) {
      stylesheet[cacheKey][classNameCacheKey][toCamelCase(key)] =
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (rule.style as any)[key];
    }
  }

  return stylesheet[cacheKey][className];
}

function isCSSStyleRule(rule: CSSRule): rule is CSSStyleRule {
  return "selectorText" in rule;
}

function toCamelCase(value: string) {
  return value
    .toLowerCase()
    .replace(/[^\dA-Za-z]+(.)/g, (_, chr) => chr.toUpperCase());
}
