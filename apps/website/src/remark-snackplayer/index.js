/* eslint-disable -- disable all rules */
/**
 * Sections of the source code are licensed under the MIT license found in the
 * LICENSE file in the directory of this source tree. Copyright (c) Facebook, Inc. and its affiliates.
 */

"use strict";

const processNodeV2 = require("./snack-v2");
const processNodeV4 = require("./snack-v4");

const processNode = (node, parent) => {
  const searchParams = new URLSearchParams(node.meta);
  return searchParams.get("version") === "4"
    ? processNodeV4(node, parent)
    : processNodeV2(node, parent);
};

const SnackPlayer = () => {
  return async (tree) => {
    const { visitParents: visit } = await import(
      "unist-util-visit-parents/lib/index.js"
    );
    const nodesToProcess = [];
    visit(tree, "code", (node, parent) => {
      if (node.lang === "SnackPlayer") {
        nodesToProcess.push(processNode(node, parent));
      }
    });
    await Promise.all(nodesToProcess);
  };
};

module.exports = SnackPlayer;
