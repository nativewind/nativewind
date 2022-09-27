import { walk, CssNode } from "css-tree";

export function getSelector(node: CssNode) {
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
