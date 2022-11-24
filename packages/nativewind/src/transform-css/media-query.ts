import { MediaQuery } from "css-tree";
import { colorSchemeKey, vh, vw } from "../runtime/common";
import { SelectorMeta } from "./types";

const platforms = new Set([
  "native",
  "ios",
  "android",
  "windows",
  "macos",
  "web",
]);

export function parseMediaQuery(node: MediaQuery, selectorMeta: SelectorMeta) {
  // eslint-disable-next-line unicorn/no-array-for-each
  node.children.forEach((child) => {
    if (child.type === "Identifier" && platforms.has(child.name)) {
      selectorMeta.atRules ??= [];
      selectorMeta.atRules.push(["platform", child.name]);
    } else if (child.type === "MediaFeature") {
      selectorMeta.atRules ??= [];

      if (child.name.includes("prefers-color-scheme")) {
        selectorMeta.subscriptions.push(colorSchemeKey);
        selectorMeta.atRules.push([colorSchemeKey, "dark"]);
        return;
      }

      if (child.name.includes("width")) {
        selectorMeta.subscriptions.push(vw);
      }

      if (child.name.includes("height")) {
        selectorMeta.subscriptions.push(vh);
      }

      switch (child.value?.type) {
        case "Identifier": {
          selectorMeta.atRules.push([child.name, child.value.name]);
          break;
        }
        case "Dimension": {
          switch (child.value.unit) {
            case "px": {
              selectorMeta.atRules.push([
                child.name,
                Number.parseFloat(child.value.value),
              ]);
              break;
            }
            default: {
              selectorMeta.atRules.push([child.name, child.value.value]);
              break;
            }
          }
          break;
        }
      }
    }
  });
}
