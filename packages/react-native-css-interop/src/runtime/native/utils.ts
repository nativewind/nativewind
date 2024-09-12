import { InteropComponentConfig } from "../../types";

type ArrayMergeStyles = "push";
type ObjectMergeStyles = "assign" | "toArray";

export function getTargetValue(
  target: Record<string, any> | undefined | null,
  config: InteropComponentConfig,
) {
  for (let index = 0; index < config.target.length && target; index++) {
    const prop = config.target[index];
    target = target[prop];
  }

  return target || undefined;
}

export function assignToTarget(
  parent: Record<string, any>,
  value: any,
  config: InteropComponentConfig | string[],
  {
    arrayMergeStyle = "push",
    objectMergeStyle = "assign",
    allowTransformMerging = false,
  }: {
    arrayMergeStyle?: ArrayMergeStyles;
    objectMergeStyle?: ObjectMergeStyles;
    allowTransformMerging?: boolean;
  } = {},
) {
  let prop: string | number;

  const props = Array.isArray(config) ? config : config.target;

  for (let index = 0; index < props.length - 1; index++) {
    prop = props[index];

    if (Array.isArray(parent) && isFinite(Number(prop))) {
      prop = Number(prop);
    }

    if (typeof parent[prop] !== "object") {
      parent[prop] = {};
    }

    parent = parent[prop];
  }

  // Now use the last value
  prop = props[props.length - 1];

  if (allowTransformMerging && transformKeys.has(prop)) {
    let existing;
    if (!Array.isArray(parent.transform)) {
      parent.transform = [];
    } else {
      existing = parent.transform.find((t: object) => prop in t);
    }

    if (existing) {
      existing[prop] = value;
    } else {
      parent.transform.push({ [prop]: value });
    }
  } else {
    const target = parent[prop];

    if (Array.isArray(target)) {
      switch (arrayMergeStyle) {
        case "push":
          target.push(value);
      }
    } else if (typeof target === "object" && target) {
      switch (objectMergeStyle) {
        case "assign": {
          if (typeof value === "object") {
            parent[prop] = Object.assign({}, parent[prop], value);
          } else {
            parent[prop] = value;
          }
          break;
        }
        case "toArray": {
          parent[prop] = [target, value];
        }
      }
    } else {
      parent[prop] = value;
    }
  }
}

const transformKeys = new Set([
  "transform",
  "translateX",
  "translateY",
  "scale",
  "scaleX",
  "scaleY",
  "rotate",
  "rotateX",
  "rotateY",
  "rotateZ",
  "skewX",
  "skewY",
  "perspective",
  "matrix",
  "transformOrigin",
]);
