import { FunctionNode } from "css-tree";
import { parse } from "css-tree";
import {
  StyleValue,
  isFunctionValue,
  isCssNode,
  Transform,
  VariableValue,
  FunctionValue,
} from "./types";

export function encodeValue(
  node: StyleValue | null | undefined,
  topics: string[],
  maybeAst = false
): StyleValue | StyleValue[] | undefined {
  if (!node) return;

  if (maybeAst) {
    const ast = parse(node.toString(), { context: "value" });

    if (ast.type !== "Value") {
      return "";
    }

    return encodeValue(ast.children.toArray()[0], topics);
  }

  if (typeof node === "string") {
    const maybeNumber = Number.parseFloat(node);
    return Number.isNaN(maybeNumber) ? node : maybeNumber;
  }

  if (typeof node === "number") {
    return node;
  }

  if (Array.isArray(node)) {
    return node.map((n) => encodeValue(n, topics)) as StyleValue[];
  }

  if (isFunctionValue(node)) {
    return node;
  }

  if (!isCssNode(node)) {
    return Object.fromEntries(
      Object.entries(node).map(([key, value]) => {
        return [key, encodeValue(value, topics)];
      })
    ) as unknown as Transform;
  }

  switch (node.type) {
    case "Identifier": {
      return node.name;
    }
    case "Number":
      return Number.parseFloat(node.value.toString());
    case "String":
      return node.value;
    case "Hash":
      return `#${node.value}`;
    case "Percentage":
      return `${node.value}%`;
    case "Function":
      return parseFunction(node, topics);
    case "Dimension":
      switch (node.unit) {
        case "px":
          return Number.parseFloat(node.value.toString());
        case "rem":
          topics.push("--rem");
          return {
            function: node.unit,
            values: [Number.parseFloat(node.value.toString())],
          };
        case "vw":
          topics.push("--window-width");
          return {
            function: node.unit,
            values: [Number.parseFloat(node.value.toString())],
          };
        case "vh":
          topics.push("--window-height");
          return {
            function: node.unit,
            values: [Number.parseFloat(node.value.toString())],
          };
        default:
          return `${node.value}${node.unit}`;
      }
  }
}

function parseFunction(node: FunctionNode, topics: string[]) {
  switch (node.name) {
    case "pixelRatio":
    case "platformSelect":
    case "platformColor":
    case "hairlineWidth": {
      const children = node.children
        .toArray()
        .map((child) => encodeValue(child, topics))
        .filter(Boolean);

      return {
        function: node.name,
        values: children as unknown as VariableValue[],
      };
    }
    case "var": {
      const children = node.children.toArray();
      const variableName = encodeValue(children[0], topics);

      if (typeof variableName !== "string") return [];

      const values: FunctionValue["values"] = [variableName];
      topics.push(variableName);

      if (children.length === 3) {
        const defaultChild = children[2];

        if (defaultChild.type === "Raw") {
          const ast = parse(defaultChild.value, {
            context: "value",
          });

          if (ast.type === "Value") {
            const defaultValue = encodeValue(ast.children.toArray()[0], []);

            if (typeof defaultValue === "object") {
              if ("function" in defaultValue) {
                values.push(defaultValue);
              }
            } else if (defaultValue) {
              values.push(defaultValue);
            }
          }
        }
      }

      return {
        function: "var",
        values,
      };
    }
    default: {
      const values = node.children.toArray().flatMap((child) => {
        return encodeValue(child, topics) ?? [];
      });

      const hasVariableValues = values.some(
        (value) => typeof value === "object"
      );

      return hasVariableValues
        ? {
            function: "inbuilt",
            values: [node.name, ...(values as string[])],
          }
        : `${node.name}(${values.join(", ")})`;
    }
  }
}
