import { walk, parse, CssNode, Atrule } from "css-tree";

import { AtomRecord, SelectorMeta, skip } from "./types";
import { parseMediaQuery } from "./media-query";
import { addKeyFrames } from "./key-frames";
import { addRule } from "./add-rule";

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
          if (node.name === "keyframes") {
            addKeyFrames(
              node,
              createOptions,
              existingMeta ?? {
                subscriptions: [],
                atRules: [],
                conditions: [],
                variables: [],
              }
            );
          } else if (node.name === "media") {
            addMediaAtRule(
              node,
              createOptions,
              existingMeta ?? {
                subscriptions: [],
                atRules: [],
                conditions: [],
                variables: [],
              }
            );
          }
          return skip;
        }
        case "Rule": {
          addRule(
            node,
            createOptions,
            existingMeta ?? {
              subscriptions: [],
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

export function addMediaAtRule(
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
