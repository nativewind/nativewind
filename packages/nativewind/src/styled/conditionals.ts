import { atoms } from "../style-sheet/runtime";

export function withConditionals(
  className: string,
  componentState: Record<string, boolean | number> = {}
) {
  const keyTokens: string[] = [];
  let meta: Record<string, boolean> = {};

  for (const atomName of className.split(/\s+/)) {
    const atom = atoms.get(atomName);

    if (!atom) continue;

    if (atom.conditions) {
      const conditionsPass = atom.conditions.every((condition) => {
        if (conditionsPass) {
          switch (condition) {
            case "not-first-child":
              return (
                typeof componentState["nthChild"] === "number" &&
                componentState["nthChild"] > 0
              );
            case "odd":
              return (
                typeof componentState["nthChild"] === "number" &&
                typeof componentState["nthChild"] === "number" &&
                componentState["nthChild"] % 2 === 1
              );
            case "even":
              return (
                typeof componentState["nthChild"] === "number" &&
                componentState["nthChild"] % 2 === 0
              );
            default: {
              return Boolean(componentState[condition]);
            }
          }
        }
      });

      if (conditionsPass) {
        keyTokens.push(atomName);
        meta = { ...meta, ...atom.meta };
      }
    } else {
      keyTokens.push(atomName);
      meta = { ...meta, ...atom.meta };
    }
  }

  return {
    className: keyTokens.join(" "),
    meta,
  };
}
