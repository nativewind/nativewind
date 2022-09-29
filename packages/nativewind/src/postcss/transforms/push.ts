import { FunctionNode, parse } from "css-tree";
import { validProperties } from "./valid-styles";
import {
  DeclarationAtom,
  StyleValue,
  VariableValue,
  FunctionValue,
  Transform,
  isFunctionValue,
  isCssNode,
} from "../types";

export function pushStyle(
  atom: DeclarationAtom,
  property: string,
  node?: StyleValue | null
) {
  if (!node) return;

  const topics: string[] = [];
  // This mutates topics, theres probably a better way to write this
  const value = parseStyleValue(node, topics);

  if (value === undefined || value === null) return;

  atom.topics ??= [];
  atom.topics.push(...topics);

  // To camelCase
  const styleProperty = property.replace(/-./g, (x) => x[1].toUpperCase());

  if (validProperties.has(styleProperty)) {
    atom.styles.push({
      [styleProperty]: value,
    });
  }
}

export function parseStyleValue(
  node: StyleValue | null | undefined,
  topics: string[]
): StyleValue | StyleValue[] | undefined {
  if (!node) return;

  if (typeof node === "string") {
    const maybeNumber = Number.parseFloat(node);
    return Number.isNaN(maybeNumber) ? node : maybeNumber;
  }

  if (typeof node === "number") {
    return node;
  }

  if (Array.isArray(node)) {
    return node.map((n) => parseStyleValue(n, topics)) as StyleValue[];
  }

  if (isFunctionValue(node)) {
    return node;
  }

  if (!isCssNode(node)) {
    return Object.fromEntries(
      Object.entries(node).map(([key, value]) => {
        return [key, parseStyleValue(value, topics)];
      })
    ) as unknown as Transform;
  }

  switch (node.type) {
    case "Identifier": {
      if (node.name.includes('__\\{\\"function')) {
        const [platform, ...other] = node.name.split("__");
        return `${platform}__${JSON.stringify(
          JSON.parse(other.join("").replaceAll(/\\/g, ""))
        )}`;
      }

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
    case "platformColor": {
      const children = node.children
        .toArray()
        .map((child) => parseStyleValue(child, topics))
        .filter((child) => Boolean(child));

      return {
        function: node.name,
        values: children as unknown as VariableValue[],
      };
    }
    case "var": {
      const children = node.children.toArray();
      const variableName = parseStyleValue(children[0], topics);

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
            const defaultValue = parseStyleValue(ast.children.toArray()[0], []);

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
        return parseStyleValue(child, topics) ?? [];
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
