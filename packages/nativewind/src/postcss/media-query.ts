import { MediaQuery } from "css-tree";
import { AtRuleTuple } from "./types";

const platforms = new Set([
  "native",
  "ios",
  "android",
  "windows",
  "macos",
  "web",
]);

export interface MediaQueryMeta {
  topics: string[];
  conditions: string[];
  atRules: AtRuleTuple[];
}

export function parseMediaQuery(
  node: MediaQuery,
  topicsAndAtRules: MediaQueryMeta
) {
  // eslint-disable-next-line unicorn/no-array-for-each
  node.children.forEach((child) => {
    if (child.type === "Identifier" && platforms.has(child.name)) {
      topicsAndAtRules.conditions.push(child.name);
    } else if (child.type === "MediaFeature") {
      topicsAndAtRules.atRules ??= [];

      switch (child.name) {
        case "min-width":
          topicsAndAtRules.topics.push("device-width");
          break;
      }

      switch (child.value?.type) {
        case "Identifier":
          topicsAndAtRules.atRules.push([child.name, child.value.name]);

          switch (child.name) {
            case "prefers-color-scheme":
              topicsAndAtRules.topics.push("--color-scheme");
              break;
          }

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
