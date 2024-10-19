import { isDescriptorArray } from "../../../shared";
import { defaultValues } from "../resolve-value";
import type { ShorthandResolveFn, ShorthandResultArray } from "../types";
import { ShorthandSymbol } from "./shared";

type ShorthandRequiredValue =
  | readonly [
      string | readonly string[],
      "string" | "number" | "length" | "color",
    ]
  | ShorthandDefaultValue;

type ShorthandDefaultValue = readonly [
  string | readonly string[],
  "string" | "number" | "length" | "color",
  keyof typeof defaultValues,
];

export function shorthandHandler(
  mappings: ShorthandRequiredValue[][],
  defaults: ShorthandDefaultValue[],
) {
  const resolveFn: ShorthandResolveFn = (
    resolve,
    state,
    refs,
    tracking,
    descriptor,
    style,
  ) => {
    if (!isDescriptorArray(descriptor)) return;

    const resolved = descriptor.flatMap((value) => {
      return resolve(state, refs, tracking, value, style);
    });

    const match = mappings.find((mapping) => {
      return mapping.every((map, index) => {
        const type = map[1];
        const value = resolved[index];

        switch (type) {
          case "string":
          case "number":
            return typeof value === type;
          case "color":
            return typeof value === "string" || typeof value === "object";
          case "length":
            return typeof value === "string"
              ? value.endsWith("%")
              : typeof value === "number";
        }
      });
    });

    if (!match) return;

    const seenDefaults = new Set(defaults);

    const result: ShorthandResultArray = [
      ...match.map((map, index) => {
        if (map.length === 3) {
          seenDefaults.delete(map);
        }
        return [map[0], resolved[index]] as const;
      }),
      ...Array.from(seenDefaults).map((map) => {
        const value = defaultValues[map[2]];
        return [
          map[0],
          typeof value === "function" ? value(tracking.effect) : value,
        ] as const;
      }),
    ];

    return Object.assign(result, { [ShorthandSymbol]: true });
  };

  return resolveFn;
}
