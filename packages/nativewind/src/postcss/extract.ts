import postcss from "postcss";
import { walk, parse, CssNode, Rule, Atrule } from "css-tree";

import tailwind, { Config } from "tailwindcss";

import { CreateOptions } from "../style-sheet";

import { parseMediaQuery, MediaQueryMeta } from "./media-query";
import { getDeclarations } from "./declarations";
import { getSelector } from "./selector";

const skip = (walk as unknown as Record<string, unknown>).skip;

export function extractStyles(
  tailwindConfig: Config,
  cssInput = "@tailwind components;@tailwind utilities;"
) {
  const tailwindOutput = postcss([tailwind(tailwindConfig)]).process(
    cssInput
  ).css;

  const createOptions: CreateOptions = {};

  walkAst(parse(tailwindOutput), createOptions);

  return createOptions;
}

function walkAst(
  ast: CssNode,
  createOptions: CreateOptions,
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
  createOptions: CreateOptions,
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
  createOptions: CreateOptions,
  {
    topics: atRuleTopics,
    conditions: atRuleConditions,
    atRules,
  }: MediaQueryMeta
) {
  const selectorList = node.prelude;
  if (selectorList.type === "Raw") return skip;

  const { styles, topics: ruleTopics } = getDeclarations(node.block);

  // eslint-disable-next-line unicorn/no-array-for-each
  selectorList.children.forEach((selectorNode) => {
    const {
      selector,
      conditions: selectorConditions,
      parentSelector,
    } = getSelector(selectorNode);

    // Invalid selector, skip it
    if (!selector) return;
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
