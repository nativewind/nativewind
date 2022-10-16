import context, { Meta } from "../style-sheet/context";

export function withConditionals(
  className: string,
  componentState: Record<string, boolean | number> = {}
) {
  const keyTokens: string[] = [];
  const conditions = new Set<string>();
  let meta: Meta = {};

  for (const atomName of className.split(/\s+/)) {
    const atom = context.atoms.get(atomName);

    if (!atom) {
      if (context.meta.has(atomName)) {
        meta = { ...meta, ...context.meta.get(atomName) };
      }
      continue;
    }

    if (atom.conditions) {
      let conditionsPass = true;
      for (const condition of atom.conditions) {
        conditions.add(condition);

        if (conditionsPass) {
          switch (condition) {
            case "not-first-child":
              conditionsPass =
                typeof componentState["nthChild"] === "number" &&
                componentState["nthChild"] > 0;
              break;
            case "odd":
              conditionsPass =
                typeof componentState["nthChild"] === "number" &&
                componentState["nthChild"] % 2 === 1;
              break;
            case "even":
              conditionsPass =
                typeof componentState["nthChild"] === "number" &&
                componentState["nthChild"] % 2 === 0;
              break;
            default: {
              conditionsPass = Boolean(componentState[condition]);
            }
          }
        }
      }

      if (conditionsPass) {
        keyTokens.push(atomName);
        meta = { ...meta, ...context.meta.get(atomName) };
      }
    } else {
      keyTokens.push(atomName);
      meta = { ...meta, ...context.meta.get(atomName) };
    }
  }

  return {
    className: keyTokens.join(" "),
    meta,
  };
}
