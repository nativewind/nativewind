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

export function parseMediaQuery(
  node: MediaQuery,
  topicsAndAtRules: SelectorMeta
) {
  // eslint-disable-next-line unicorn/no-array-for-each
  node.children.forEach((child) => {
    if (child.type === "Identifier" && platforms.has(child.name)) {
      topicsAndAtRules.conditions.push(child.name);
    } else if (child.type === "MediaFeature") {
      topicsAndAtRules.atRules ??= [];

      if (child.name.includes("prefers-color-scheme")) {
        topicsAndAtRules.topics.push("--color-scheme");
        topicsAndAtRules.atRules.push(["--color-scheme", "dark"]);
        return;
      }

      if (child.name.includes("width")) {
        topicsAndAtRules.topics.push("--device-width");
      }

      if (child.name.includes("height")) {
        topicsAndAtRules.topics.push("--device-height");
      }

      switch (child.value?.type) {
        case "Identifier":
          topicsAndAtRules.atRules.push([child.name, child.value.name]);
          break;
        case "Dimension":
          switch (child.value.unit) {
            case "px":
              topicsAndAtRules.atRules.push([
                child.name,
                Number.parseFloat(child.value.value),
              ]);
              break;
            default:
              topicsAndAtRules.atRules.push([child.name, child.value.value]);
              break;
          }
          break;
      }
    }
  });
}
