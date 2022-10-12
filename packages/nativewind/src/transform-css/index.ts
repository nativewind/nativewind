import { walk, parse, CssNode, Rule, Atrule, Block } from "css-tree";

import { AtomRecord, AtomStyle, SelectorMeta } from "./types";
import { parseMediaQuery } from "./media-query";

import { defaultDeclaration } from "./transforms/default";
import { border } from "./transforms/border";
import { boxShadow } from "./transforms/box-shadow";
import { flex } from "./transforms/flex";
import { flexFlow } from "./transforms/flex-flow";
import { font } from "./transforms/font";
import { fontFamily } from "./transforms/font-family";
import { placeContent } from "./transforms/place-content";
import { textDecoration } from "./transforms/text-decoration";
import { textDecorationLine } from "./transforms/text-decoration-line";
import { textShadow } from "./transforms/text-shadow";
import { transform } from "./transforms/transform";

const skip = (walk as unknown as Record<string, unknown>).skip;

export function getCreateOptions(css: string) {
  const createOptions: AtomRecord = {};
  walkAst(parse(css), createOptions);
  return createOptions;
}

/**
 * Recursively walk down the tree, collecting meta information
 * When a leaf is reached, mutate createOptions with a new rule
 * Each top level branch (atRule/rule) should have its own meta object
 */
function walkAst(
  ast: CssNode,
  createOptions: AtomRecord,
  existingMeta?: SelectorMeta
) {
  walk(ast, {
    enter(node: CssNode) {
      switch (node.type) {
        case "Atrule": {
          addAtRule(
            node,
            createOptions,
            existingMeta ?? {
              topics: [],
              atRules: [],
              conditions: [],
              variables: [],
            }
          );
          return skip;
        }
        case "Rule": {
          addRule(
            node,
            createOptions,
            existingMeta ?? {
              topics: [],
              atRules: [],
              conditions: [],
              variables: [],
            }
          );
          return skip;
        }
      }
    },
  });
}

export function addAtRule(
  node: Atrule,
  createOptions: AtomRecord,
  meta: SelectorMeta
) {
  if (node.name !== "media") return;
  if (!node.prelude || node.prelude.type === "Raw") return;

  const mediaQueryList = node.prelude.children.shift()?.data;
  const block = node.block;

  if (!block) return;
  if (mediaQueryList?.type !== "MediaQueryList") return;

  // eslint-disable-next-line unicorn/no-array-for-each
  mediaQueryList.children.forEach((child) => {
    if (child.type !== "MediaQuery") return;

    parseMediaQuery(child, meta);

    walkAst(block, createOptions, meta);
  });
}

function addRule(node: Rule, createOptions: AtomRecord, meta: SelectorMeta) {
  const selectorList = node.prelude;
  if (selectorList.type === "Raw") return skip;

  const styles = getDeclarations(node.block, meta);

  // eslint-disable-next-line unicorn/no-array-for-each
  selectorList.children.forEach((selectorNode) => {
    // Duplicate the meta, as selectors may add their own topics/atRules (eg .dark)
    const selectorMeta = { ...meta, topics: [...meta.topics] };

    const { selector, parentSelector } = getSelector(
      selectorNode,
      selectorMeta
    );

    // Invalid selector, skip it
    if (!selector) return;

    if (selector === ":root" || selector === "dark") {
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
      createOptions[parentSelector] ??= { styles: [], childClasses: [] };
      createOptions[parentSelector].childClasses = [
        ...(createOptions[parentSelector].childClasses ?? []),
        selector,
      ];
    }

    const conditionSet = new Set(selectorMeta.conditions);
    const topicSet = new Set(selectorMeta.topics);

    if (topicSet.size > 0) {
      createOptions[selector].topics = [...topicSet];
    }

    if (conditionSet.size > 0) {
      createOptions[selector].conditions = [...conditionSet];
    }

    const selectorOptions = createOptions[selector];
    if (selectorOptions.styles) {
      const currentStyleIndex = selectorOptions.styles.length;

      selectorOptions.styles.push(styles);

      if (selectorMeta.atRules.length > 0) {
        selectorOptions.atRules ??= {};
        selectorOptions.atRules[currentStyleIndex] = selectorMeta.atRules;
      }
    }
  });
}

function getDeclarations(block: Block, meta: SelectorMeta) {
  let styles: AtomStyle[] = [];

  walk(block, {
    visit: "Declaration",
    enter(node) {
      switch (node.property) {
        case "border":
          styles = border(node, meta);
        case "box-shadow":
          styles = boxShadow(node, meta);
        case "flex":
          styles = flex(node, meta);
        case "flex-flow":
          styles = flexFlow(node, meta);
        case "font":
          styles = font(node, meta);
        case "font-family":
          styles = fontFamily(node, meta);
        case "place-content":
          styles = placeContent(node, meta);
        case "text-decoration":
          styles = textDecoration(node, meta);
        case "text-decoration-line":
          styles = textDecorationLine(node, meta);
        case "text-shadow":
          styles = textShadow(node, meta);
        case "transform":
          styles = transform(node, meta);
        default:
          styles = defaultDeclaration(node, meta);
      }
    },
  });

  return flatten(styles);
}

function getSelector(node: CssNode, meta: SelectorMeta) {
  const tokens: string[] = [];

  let hasParent = false;

  walk(node, (node) => {
    switch (node.type) {
      case "TypeSelector":
        // We don't support these, so bail early
        return { selector: "" };
      case "Combinator":
        tokens.push(node.name);
        break;
      case "IdSelector":
        tokens.push(`#${node.name}`);
        break;
      case "ClassSelector":
        if (node.name === "dark") {
          meta.topics.push("--color-scheme");
          meta.atRules.push(["--color-scheme", "dark"]);
        } else {
          tokens.push(`.${node.name}`);
        }
        break;
      case "PseudoClassSelector": {
        if (node.name === "children") {
          hasParent = true;
          tokens.push(`:${node.name}`);
        } else if (node.name === "root") {
          tokens.push(`:${node.name}`);
        } else {
          meta.conditions.push(node.name);
        }
      }
    }
  });

  const selector = tokens
    .join("")
    .trimStart()
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

  return { selector, parentSelector };
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
