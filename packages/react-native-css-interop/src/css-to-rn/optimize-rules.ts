import { assignToTarget } from "../shared";
import {
  StyleDeclaration,
  StyleRule,
  StyleSheetRegisterCompiledOptions,
} from "../types";

export function optimizeRules(
  rules: StyleSheetRegisterCompiledOptions["rules"],
): StyleSheetRegisterCompiledOptions["rules"] {
  return rules?.map(([name, ruleSet]) => {
    let isDynamic = ruleSet.important && ruleSet.important?.length > 0;

    if (isDynamic) {
      return [name, ruleSet];
    }

    if (ruleSet.normal) {
      for (const rule of ruleSet.normal) {
        // Static styles only have $type & declarations
        if (!("declarations" in rule) || Object.keys(rules).length > 2) {
          continue;
        }
        rule.declarations = mergeDeclarations(rule.declarations);
      }
    }

    return [name, ruleSet];
  });
}

/**
 * Merges static declarations into a single object
 * There maybe multiple static object if there are different target props
 * Static declarations only have 2 tokens in the path, so transform/shadows are not counted
 */
function mergeDeclarations(declarations: StyleRule["declarations"]) {
  if (!declarations) {
    return;
  }

  /*
   * We need to loop from last->first, so we can skip already processed styles e.g
   * .myClass {
   *   color: red; // We can skip this
   *   color: blue;
   * }
   */

  const seenProperties = new Set<string>();
  const staticStyles = new Map<string, Record<string, unknown>>();
  let result: StyleDeclaration[] = [];

  for (let index = declarations.length - 1; index >= 0; index--) {
    const declaration = declarations[index];

    let [value, pathTokens, delayed] = declaration;

    // This won't actually occur, as its this function that creates this type of StyleDeclaration
    if (!pathTokens) continue;

    const key = Array.isArray(pathTokens) ? pathTokens.join(".") : pathTokens;

    // Skip already seen keys
    if (seenProperties.has(key)) {
      continue;
    }

    seenProperties.add(key);

    // We cannot merge complex styles. This includes functions or arrays of values
    // We cannot optimize delayed values
    if (typeof value === "object" || delayed) {
      result.push(declaration);
      continue;
    }

    // The static key is the path without the property
    // e.g `style`
    const staticKey = Array.isArray(pathTokens)
      ? pathTokens.slice(0, -1)?.join(".")
      : "style";

    // This is only the property of the path.
    // e.g color
    const property = Array.isArray(pathTokens)
      ? pathTokens[pathTokens.length - 1]
      : pathTokens;

    let staticDeclaration = staticStyles.get(staticKey);
    if (!staticDeclaration) {
      const styles = {};
      assignToTarget(styles, value, [property], {
        allowTransformMerging: true,
      });
      staticStyles.set(staticKey, styles);
    } else {
      Object.assign(staticDeclaration, { [property]: value });
    }
  }

  // Because we looped in reverse, our declarations are in reverse
  // I'm not sure if this matters, but it makes the output easier to debug
  result = result.reverse();

  // Now the staticStyles have been merged, add them to the result
  for (const [key, value] of staticStyles) {
    // These are special, they don't need pathTokens
    if (key === "style") {
      result.push([value]);
    } else {
      if (key === "") {
        result.push([value, []]);
      } else {
        const pathTokens = key.split(".");
        result.push([value, pathTokens]);
      }
    }
  }

  return result;
}
