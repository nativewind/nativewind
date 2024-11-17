import { CompilerCollection } from "../runtime/pure/compiler/types";
import { EasingFunction } from "../runtime/pure/reanimated";
import { RuntimeFunction, StyleRule } from "../runtime/pure/types";
import { isDescriptorArray } from "../shared";
import { MoveTokenRecord, RuntimeValueDescriptor } from "../types";
import { toRNProperty } from "./normalize-selectors";

export type AddFn = ReturnType<typeof buildAddFn>;

export function buildAddFn(
  rule: StyleRule,
  collection: CompilerCollection,
  mapping: MoveTokenRecord,
) {
  let staticDeclarations: Record<string, unknown> | undefined;

  function Add(
    type: "transform",
    property: string,
    value: RuntimeValueDescriptor,
  ): void;
  function Add(
    type: "animation",
    property: "animation-timing-function",
    value: EasingFunction[],
  ): void;
  function Add(
    type: "animation",
    property: string,
    value: RuntimeValueDescriptor,
  ): void;
  function Add(
    type: "transition",
    property: "transition-timing-function",
    value: EasingFunction[],
  ): void;
  function Add(
    type: "transition",
    property: string,
    value: RuntimeValueDescriptor,
  ): void;
  function Add(
    type: "style",
    property: string,
    value: RuntimeValueDescriptor,
  ): void;
  function Add(
    type: string,
    property: string,
    value: RuntimeValueDescriptor | EasingFunction[],
  ) {
    switch (type) {
      case "transform":
      case "animation":
      case "transition":
        return;
      case "style": {
        value = value as RuntimeValueDescriptor;

        if (value === undefined) {
          return;
        }

        if (property.startsWith("--")) {
          if (!collection.varUsageCount.has(property)) {
            return;
          }
          rule.v ??= [];
          rule.v.push([property, value]);
          return;
        }

        property = toRNProperty(property);

        const rename = mapping[property] ?? mapping["*"];

        if (Array.isArray(value)) {
          rule.d ??= [];
          const [strippedValue, delayed] = stripDelay(value);

          if (delayed) {
            rule.d.push([
              strippedValue as RuntimeFunction,
              rename || property,
              1,
            ]);
          } else {
            rule.d.push([strippedValue as RuntimeFunction, rename || property]);
          }
        } else if (
          rename &&
          (rename.length > 1 || !rename[0].startsWith("^"))
        ) {
          rule.d ??= [];
          rule.d.push([value, rename]);
        } else {
          if (rename) {
            property = rename[0].slice(1);
          }

          if (!staticDeclarations) {
            staticDeclarations = {};
            rule.d ??= [];
            rule.d.push(staticDeclarations);
          }
          staticDeclarations[property] = value;
        }
      }
    }
  }

  return Add;
}

function stripDelay(
  value: RuntimeValueDescriptor,
): [RuntimeValueDescriptor, boolean] {
  if (!Array.isArray(value)) {
    return [value, false];
  }

  if (isDescriptorArray(value)) {
    let didDelay = false;
    const results: RuntimeValueDescriptor[] = [];

    for (const v of value) {
      const [result, delayed] = stripDelay(v);
      if (delayed) {
        didDelay = true;
      }
      results.push(result);
    }

    return [results, didDelay];
  }

  const [newArgs, didArgsDelay] = stripDelay(value[2]);

  const isDelayed = value[3] === 1 || didArgsDelay;

  if (isDelayed) {
    return [[value[0], value[1], newArgs as RuntimeValueDescriptor[]], true];
  }

  return [value, false];
}
