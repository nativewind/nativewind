/* eslint-disable -- disable all rules */
/**
 * Sections of the source code are licensed under the MIT license found in the
 * LICENSE file in the directory of this source tree. Copyright (c) Facebook, Inc. and its affiliates.
 */

"use strict";
const visit = require("unist-util-visit-parents");
const u = require("unist-builder");
const dedent = require("dedent");

const { processNodeV2 } = require("./snack-v2");
const { processNodeV4 } = require("./snack-v4");

const processNode = (node, parent) => {
  const searchParams = new URLSearchParams(node.meta);
  return searchParams.get("version") === "4"
    ? processNodeV4(node, parent)
    : processNodeV2(node, parent);
};

const SnackPlayer = () => {
  return (tree) =>
    new Promise(async (resolve, reject) => {
      const nodesToProcess = [];
      // Parse all CodeBlocks
      visit(tree, "code", (node, parent) => {
        // Add SnackPlayer CodeBlocks to processing queue
        if (node.lang == "SnackPlayer") {
          nodesToProcess.push(processNode(node, parent));
        }
      });

      // Wait for all promises to be resolved
      Promise.all(nodesToProcess).then(resolve()).catch(reject());
    });
};

module.exports = SnackPlayer;
