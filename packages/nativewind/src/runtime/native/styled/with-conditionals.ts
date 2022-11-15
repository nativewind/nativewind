import { Atom } from "../../../transform-css/types";
import { atoms } from "../stylesheet/runtime";

export interface ConditionalStateRecord {
  [key: string]: boolean | number | ConditionalStateRecord;
}

export function withConditionals(
  classValue = "",
  componentState: ConditionalStateRecord = {}
) {
  const keyTokens: string[] = [];
  let interactionMeta: Atom["meta"] = {};

  for (const atomName of classValue.split(/\s+/)) {
    const atom = atoms.get(atomName);

    if (atom?.conditions) {
      const conditionsPass = atom.conditions.every((condition) => {
        let source = componentState;
        let key = condition;

        if (condition.includes(":")) {
          const [newSourceKey, newKey] = condition.split(":");
          const newSource = componentState[newSourceKey];
          if (typeof newSource === "object") {
            source = newSource;
            key = newKey;
          }
        }

        switch (key) {
          case "first-child": {
            return (
              typeof source["nthChild"] === "number" && source["nthChild"] === 1
            );
          }
          case "last-child": {
            return source["lastChild"];
          }
          case "not-first-child": {
            return (
              typeof source["nthChild"] === "number" && source["nthChild"] > 1
            );
          }
          case "odd": {
            return (
              typeof source["nthChild"] === "number" &&
              source["nthChild"] % 2 === 1
            );
          }
          case "even": {
            return (
              typeof source["nthChild"] === "number" &&
              source["nthChild"] % 2 === 0
            );
          }
          default: {
            return Boolean(source[key]);
          }
        }
      });

      interactionMeta = { ...interactionMeta, ...atom.meta };

      if (conditionsPass) {
        keyTokens.push(atomName);
      }
    } else if (atom) {
      keyTokens.push(atomName);
      interactionMeta = { ...interactionMeta, ...atom.meta };
    } else {
      keyTokens.push(atomName);
    }
  }

  const className = keyTokens
    .sort((a, b) => {
      const aImportant = a.startsWith("!");
      const bImportant = b.startsWith("!");

      return aImportant && bImportant
        ? 0
        : aImportant
        ? 1
        : bImportant
        ? -1
        : 0;
    })
    .join(" ");

  return {
    className,
    interactionMeta,
  };
}
