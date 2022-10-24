import { atoms } from "../../style-sheet/native/runtime";
import { Atom } from "../../transform-css/types";

export interface ConditionalStateRecord {
  [key: string]: boolean | number | ConditionalStateRecord;
}

export function withConditionals(
  className = "",
  componentState: ConditionalStateRecord = {}
) {
  const keyTokens: string[] = [];
  let meta: Atom["meta"] = {};

  for (const atomName of className.split(/\s+/)) {
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
          case "not-first-child": {
            return (
              typeof source["nthChild"] === "number" && source["nthChild"] > 0
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

      if (conditionsPass) {
        keyTokens.push(atomName);
        meta = { ...meta, ...atom.meta };
      }
    } else if (atom) {
      keyTokens.push(atomName);
      meta = { ...meta, ...atom.meta };
    } else {
      keyTokens.push(atomName);
    }
  }

  return {
    className: keyTokens.join(" "),
    meta,
  };
}
