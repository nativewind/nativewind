import { StyleValueSubResolver } from ".";
import { RuntimeFunction } from "../types";
import { defaultValues } from "../utils/properties";

type ShorthandType =
  | "string"
  | "number"
  | "length"
  | "color"
  | Readonly<string[]>;

type ShorthandRequiredValue =
  | readonly [string | readonly string[], ShorthandType]
  | ShorthandDefaultValue;

type ShorthandDefaultValue = readonly [
  string | readonly string[],
  ShorthandType,
  any,
];

export function shorthandHandler(
  mappings: ShorthandRequiredValue[][],
  defaults: ShorthandDefaultValue[],
) {
  const resolveFn: StyleValueSubResolver<RuntimeFunction> = (
    resolveValue,
    func,
    options,
  ) => {
    const args = func[2] || [];

    const resolved = args.flatMap((value) => {
      return resolveValue(value, options);
    });

    const match = mappings.find((mapping) => {
      return (
        resolved.length === mapping.length &&
        mapping.every((map, index) => {
          const type = map[1];
          const value = resolved[index];

          if (Array.isArray(type)) {
            return type.includes(value);
          }

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
        })
      );
    });

    if (!match) return;

    const seenDefaults = new Set(defaults);

    return [
      ...match.map((map, index) => {
        if (map.length === 3) {
          seenDefaults.delete(map);
        }

        let value = resolved[index];
        if (options.castToArray && value && !Array.isArray(value)) {
          value = [value];
        }

        return [map[0], value] as const;
      }),
      ...Array.from(seenDefaults).map((map) => {
        let value = defaultValues[map[2]] ?? map[2];
        if (options.castToArray && value && !Array.isArray(value)) {
          value = [value];
        }

        return [map[0], value] as const;
      }),
    ];
  };

  return resolveFn;
}
