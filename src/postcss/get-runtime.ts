import { hasDarkPseudoClass } from "../shared/selector";
import { AtRuleTuple, Style } from "../types/common";

export function getRuntime(
  selector: string,
  nativeDeclarations: Style,
  atRules: AtRuleTuple[] | undefined
) {
  const units: Map<string, string> = new Map();
  const topics: Set<string> = new Set();
  const declarations: Record<string, unknown> = { ...nativeDeclarations };

  if (hasDarkPseudoClass(selector)) topics.add("colorScheme");

  for (const [key, value] of Object.entries(declarations)) {
    if (valueHasUnit(value)) {
      if (value.unit === "vw") {
        units.set(key, "vw");
        topics.add("width");
      }
      if (value.unit === "vh") {
        units.set(key, "vh");
        topics.add("height");
      }
      declarations[key] = value.value;
    }
  }

  if (atRules) {
    for (const [atRule, params] of atRules) {
      if (atRule === "media" && params) {
        if (params.includes("width")) topics.add("width");
        if (params.includes("height")) topics.add("height");
        if (params.includes("orientation")) topics.add("orientation");
        if (params.includes("aspect-ratio")) topics.add("window");
      }
    }
  }

  return {
    declarations,
    units: units.size > 0 ? Object.fromEntries(units.entries()) : undefined,
    topics: topics.size > 0 ? [...topics.values()] : undefined,
  };
}

function valueHasUnit(
  value: unknown
): value is { unit: string; value: string } {
  return Boolean(typeof value === "object" && value && "unit" in value);
}
