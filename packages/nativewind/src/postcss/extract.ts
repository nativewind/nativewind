import postcss from "postcss";
import { walk, parse, CssNode, Rule, Atrule, Block } from "css-tree";

import tailwind, { Config } from "tailwindcss";

import { AtomRecord, DeclarationAtom } from "./types";
import { parseMediaQuery, MediaQueryMeta } from "./media-query";

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

export function extractStyles(
  tailwindConfig: Config,
  cssInput = "@tailwind components;@tailwind utilities;"
) {
  const css = postcss([tailwind(tailwindConfig)]).process(cssInput).css;
  return getCreateOptions(css);
}

export function getCreateOptions(css: string) {
  const createOptions: AtomRecord = {};

  walkAst(parse(css), createOptions);

  return createOptions;
}

function walkAst(
  ast: CssNode,
  createOptions: AtomRecord,
  existingMeta?: MediaQueryMeta
) {
  walk(ast, {
    enter(node: CssNode) {
      switch (node.type) {
        case "Atrule": {
          addAtRule(
            node,
            createOptions,
            existingMeta ?? { topics: [], atRules: [], conditions: [] }
          );
          return skip;
        }
        case "Rule": {
          addRule(
            node,
            createOptions,
            existingMeta ?? { topics: [], atRules: [], conditions: [] }
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
  meta: MediaQueryMeta
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

function addRule(
  node: Rule,
  createOptions: AtomRecord,
  {
    topics: atRuleTopics,
    conditions: atRuleConditions,
    atRules,
  }: MediaQueryMeta
) {
  const selectorList = node.prelude;
  if (selectorList.type === "Raw") return skip;

  const { styles, topics: ruleTopics, variables } = getDeclarations(node.block);

  // eslint-disable-next-line unicorn/no-array-for-each
  selectorList.children.forEach((selectorNode) => {
    const {
      selector,
      conditions: selectorConditions,
      parentSelector,
    } = getSelector(selectorNode);

    // Invalid selector, skip it
    if (!selector) return;

    if (selector === ":root" || selector === "dark") {
      if (styles.fontSize) {
        variables.push({ "--rem": styles.fontSize });
      }
      createOptions[selector] ??= { variables: [flatten(variables)] };
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

    const conditionSet = new Set([...atRuleConditions, ...selectorConditions]);
    const topicSet = new Set([...atRuleTopics, ...ruleTopics]);

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

      if (atRules.length > 0) {
        selectorOptions.atRules ??= {};
        selectorOptions.atRules[currentStyleIndex] = atRules;
      }
    }
  });
}

function getDeclarations(block: Block) {
  const atom: DeclarationAtom = {
    styles: [],
    topics: [],
    variables: [],
  };

  walk(block, {
    visit: "Declaration",
    enter(node) {
      switch (node.property) {
        case "border":
          return border(atom, node);
        case "box-shadow":
          return boxShadow(atom, node);
        case "flex":
          return flex(atom, node);
        case "flex-flow":
          return flexFlow(atom, node);
        case "font":
          return font(atom, node);
        case "font-family":
          return fontFamily(atom, node);
        case "place-content":
          return placeContent(atom, node);
        case "text-decoration":
          return textDecoration(atom, node);
        case "text-decoration-line":
          return textDecorationLine(atom, node);
        case "text-shadow":
          return textShadow(atom, node);
        case "transform":
          return transform(atom, node);
        default: {
          return defaultDeclaration(atom, node);
        }
      }
    },
  });

  return {
    ...atom,
    styles: flatten(atom.styles),
  };
}

function getSelector(node: CssNode) {
  const tokens: string[] = [];

  const conditions: string[] = [];

  let hasParent = false;

  walk(node, (node) => {
    switch (node.type) {
      case "TypeSelector":
        // We don't support these, so bail early
        return { selector: "", conditions };
      case "Combinator":
        tokens.push(node.name);
        break;
      case "IdSelector":
        tokens.push(`#${node.name}`);
        break;
      case "ClassSelector":
        tokens.push(`.${node.name}`);
        break;
      case "PseudoClassSelector": {
        if (node.name === "children") {
          hasParent = true;
          tokens.push(`:${node.name}`);
        } else if (node.name === "root") {
          tokens.push(`:${node.name}`);
        } else {
          conditions.push(node.name);
        }
      }
    }
  });

  const selector = tokens
    .join("")
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

  return { selector, conditions, parentSelector };
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
