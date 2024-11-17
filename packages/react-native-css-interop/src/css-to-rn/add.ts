import {
  AnimationDirection,
  AnimationFillMode,
  AnimationPlayState,
} from "lightningcss";

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
    property:
      | "animation-delay"
      | "animation-direction"
      | "animation-duration"
      | "animation-fill-mode"
      | "animation-iteration-count"
      | "animation-name"
      | "animation-play-state",
    value: RuntimeValueDescriptor,
  ): void;
  function Add(
    type: "transition",
    property: "transition-timing-function",
    value: EasingFunction[],
  ): void;
  function Add(
    type: "transition",
    property:
      | "transition-delay"
      | "transition-duration"
      | "transition-property",
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
    if (value === undefined) {
      return;
    }

    switch (type) {
      case "transform":
        return;
      case "transition":
        switch (property) {
          case "transition-timing-function":
            rule.t ??= {};
            rule.t.e ??= [];
            rule.t.e.push(...(value as EasingFunction[]));
            break;
          case "transition-delay":
            rule.t ??= {};
            rule.t.de = value as number[];
            break;
          case "transition-duration":
            rule.t ??= {};
            rule.t.du = value as number[];
            break;
          case "transition-property":
            rule.t ??= {};
            rule.t.p = value as string[];
            break;
        }
        return;
      case "animation":
        switch (property) {
          case "animation-timing-function":
            rule.a ??= {};
            rule.a.e ??= [];
            rule.a.e.push(...(value as EasingFunction[]));
            break;
          case "animation-delay":
            rule.a ??= {};
            rule.a.de = value as number[];
            break;
          case "animation-direction":
            rule.a ??= {};
            rule.a.di = value as AnimationDirection[];
            break;
          case "animation-duration":
            rule.a ??= {};
            rule.a.du = value as number[];
            break;
          case "animation-fill-mode":
            rule.a ??= {};
            rule.a.f = value as AnimationFillMode[];
            break;
          case "animation-iteration-count":
            rule.a ??= {};
            rule.a.i = value as number[];
            break;
          case "animation-name":
            rule.a ??= {};
            rule.a.n = value as string[];
            break;
          case "animation-play-state":
            rule.a ??= {};
            rule.a.p = value as AnimationPlayState[];
            break;
          case "animation-timeline":
            return;
        }

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
