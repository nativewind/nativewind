import { CompilerCollection } from "../runtime/pure/compiler/types";
import { EasingFunction } from "../runtime/pure/reanimated";
import { StyleRule } from "../runtime/pure/types";
import { RuntimeValueDescriptor } from "../types";

export type AddFn = ReturnType<typeof buildAddFn>;

export function buildAddFn(
  extractedStyle: StyleRule,
  collection: CompilerCollection,
) {
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
        if (value === undefined) {
          return;
        }

        if (property.startsWith("--")) {
          if (!collection.varUsageCount.has(property)) {
            return;
          }
          extractedStyle.v ??= [];
          extractedStyle.v.push([property, value as RuntimeValueDescriptor]);
          return;
        }
      }
    }
  }

  return Add;
}
