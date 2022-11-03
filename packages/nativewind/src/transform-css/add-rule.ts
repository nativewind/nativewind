import { Rule, Block, walk, CssNode } from "css-tree";
import { border } from "./transforms/border";
import { boxShadow } from "./transforms/box-shadow";
import { defaultDeclaration } from "./transforms/default";
import { flex } from "./transforms/flex";
import { flexFlow } from "./transforms/flex-flow";
import { font } from "./transforms/font";
import { fontFamily } from "./transforms/font-family";
import { fontWeight } from "./transforms/font-weight";
import { placeContent } from "./transforms/place-content";
import { transform } from "./transforms/transform";
import { textDecoration } from "./transforms/text-decoration";
import { textDecorationLine } from "./transforms/text-decoration-line";
import { textShadow } from "./transforms/text-shadow";
import { AtomRecord, SelectorMeta, AtomStyle, skip } from "./types";

export function addRule(
  node: Rule,
  createOptions: AtomRecord,
  meta: SelectorMeta
) {
  const selectorList = node.prelude;
  if (selectorList.type === "Raw") return skip;

  const styles = getDeclarations(node.block, meta);

  // eslint-disable-next-line unicorn/no-array-for-each
  selectorList.children.forEach((selectorNode) => {
    // Duplicate the meta, as selectors may add their own subscriptions/atRules (eg .dark)
    const selectorMeta = { ...meta, subscriptions: [...meta.subscriptions] };

    const { selector, parentSelector, groups, interactionMeta } = getSelector(
      selectorNode,
      selectorMeta
    );

    // Invalid selector, skip it
    if (!selector) return;

    if (
      selector === ":root" ||
      selector === ":root[dark]" ||
      selector === "dark"
    ) {
      if (styles.fontSize) {
        selectorMeta.variables.push({ "--rem": styles.fontSize });
      }
      createOptions[selector] ??= {
        variables: [flatten(selectorMeta.variables)],
      };
      return;
    }

    if (Object.keys(styles).length === 0) return;

    createOptions[selector] ??= { styles: [] };

    if (parentSelector) {
      createOptions[selector] ??= { styles: [] };
      createOptions[parentSelector] ??= { styles: [], childClasses: [] };
      createOptions[parentSelector].childClasses = [
        ...(createOptions[parentSelector].childClasses ?? []),
        selector,
      ];
    }

    const conditionSet = new Set(selectorMeta.conditions);
    const subscriptionSet = new Set(selectorMeta.subscriptions);

    if (subscriptionSet.size > 0) {
      createOptions[selector].subscriptions = [...subscriptionSet];
    }

    if (conditionSet.size > 0) {
      createOptions[selector].conditions = [...conditionSet];
    }

    if (Object.keys(interactionMeta).length > 0) {
      createOptions[selector].meta = {
        ...createOptions[selector].meta,
        ...interactionMeta,
      };
    }

    const selectorOptions = createOptions[selector];
    if (selectorOptions.styles) {
      const currentStyleIndex = selectorOptions.styles.length;

      selectorOptions.styles.push(styles);

      if (groups.length > 0) {
        for (const group of groups) {
          createOptions[group] ??= {};
          createOptions[group].meta = {
            ...createOptions[group].meta,
            group,
          };
        }
      }

      if (selectorMeta.atRules.length > 0) {
        selectorOptions.atRules ??= {};
        selectorOptions.atRules[currentStyleIndex] = selectorMeta.atRules;
      }
    }
  });
}

export function getDeclarations(block: Block, meta: SelectorMeta) {
  const styles: AtomStyle[] = [];

  walk(block, {
    visit: "Declaration",
    enter(node) {
      switch (node.property) {
        case "border": {
          styles.push(...border(node, meta));
          break;
        }
        case "box-shadow": {
          styles.push(...boxShadow(node, meta));
          break;
        }
        case "flex": {
          styles.push(...flex(node, meta));
          break;
        }
        case "flex-flow": {
          styles.push(...flexFlow(node, meta));
          break;
        }
        case "font": {
          styles.push(...font(node, meta));
          break;
        }
        case "font-family": {
          styles.push(...fontFamily(node, meta));
          break;
        }
        case "font-weight": {
          styles.push(...fontWeight(node, meta));
          break;
        }
        case "place-content": {
          styles.push(...placeContent(node, meta));
          break;
        }
        case "text-decoration": {
          styles.push(...textDecoration(node, meta));
          break;
        }
        case "text-decoration-line": {
          styles.push(...textDecorationLine(node, meta));
          break;
        }
        case "text-shadow": {
          styles.push(...textShadow(node, meta));
          break;
        }
        case "transform": {
          styles.push(...transform(node, meta));
          break;
        }
        default: {
          styles.push(...defaultDeclaration(node, meta));
        }
      }
    },
  });

  return flatten(styles);
}

function getSelector(node: CssNode, meta: SelectorMeta) {
  const tokens: string[] = [];

  let hasParent = false;
  let groupName: string | undefined;
  const groups: string[] = [];
  const interactionMeta: Record<string, boolean> = {};

  walk(node, (node) => {
    switch (node.type) {
      case "TypeSelector":
      case "IdSelector": {
        // We don't support these, so bail early
        return { selector: "" };
      }
      case "Combinator": {
        groupName = undefined;
        // Ignore these
        break;
      }
      case "AttributeSelector": {
        if (node.name.name === "dark") {
          tokens.push(`[${node.name.name}]`);
        }
        break;
      }
      case "ClassSelector": {
        if (node.name === "group") {
          groupName = "group";
          groups.push(groupName);
          break;
        }

        if (node.name.startsWith("group\\/")) {
          groupName = `group/${node.name.split("\\/")[1]}`;
          groups.push(groupName);
          break;
        }

        if (node.name === "dark") {
          meta.subscriptions.push("--color-scheme");
          meta.atRules.push(["--color-scheme", "dark"]);
        }
        tokens.push(`.${node.name}`);
        break;
      }
      case "PseudoClassSelector": {
        if (node.name === "children") {
          hasParent = true;
          tokens.push(`:${node.name}`);
        } else if (node.name === "root") {
          tokens.push(`:${node.name}`);
        } else {
          switch (node.name) {
            case "active":
            case "hover":
            case "focus": {
              if (!groupName) {
                interactionMeta[node.name] = true;
              }
            }
          }

          groupName
            ? meta.conditions.push(`${groupName}:${node.name}`)
            : meta.conditions.push(node.name);
        }
      }
    }
  });

  const selector = tokens
    .join("")
    .trimStart()
    .replace(/^\.dark\./, "")
    .replace(/^\./, "")
    .replaceAll(/\\([\dA-Fa-f]{2}\s)/g, function (...args) {
      // Replace hex-string with their actual value
      // We need to do this before we remove slashes, otherwise we lose the hex values
      return String.fromCodePoint(Number.parseInt(args[1], 16));
    })
    .replaceAll("\\", "");

  const parentSelector = hasParent
    ? selector.replaceAll(":children", "")
    : undefined;

  return { selector, parentSelector, groups, interactionMeta };
}

function flatten<T extends Record<string, unknown>>(objectArray: T[]): T {
  let returnObject = {} as T;
  for (const object of objectArray) {
    for (const [key, value] of Object.entries(object)) {
      returnObject = setValue(returnObject, key, value);
    }
  }

  return returnObject;
}

function setValue<T extends Record<string, unknown>>(
  object: T,
  is: string | string[],
  value: unknown
): T {
  if (typeof is == "string") {
    return setValue<T>(object, is.split("."), value);
  } else if (is.length == 1) {
    (object as Record<string, unknown>)[is[0]] = value;
    return object;
  } else {
    (object as Record<string, unknown>)[is[0]] = setValue<T>(
      (object[is[0]] || {}) as T,
      is.slice(1),
      value
    );
    return object;
  }
}
