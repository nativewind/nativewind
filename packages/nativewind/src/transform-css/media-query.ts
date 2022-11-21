import { MediaQuery } from "css-tree";
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
      selectorMeta.atRules.push(["--platform", child.name]);
    } else if (child.type === "MediaFeature") {
      selectorMeta.atRules ??= [];

      if (child.name.includes("prefers-color-scheme")) {
        selectorMeta.subscriptions.push("--color-scheme");
        selectorMeta.atRules.push(["--color-scheme", "dark"]);
        return;
      }

      if (child.name.includes("width")) {
        selectorMeta.subscriptions.push("--device-width");
      }

      if (child.name.includes("height")) {
        selectorMeta.subscriptions.push("--device-height");
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
