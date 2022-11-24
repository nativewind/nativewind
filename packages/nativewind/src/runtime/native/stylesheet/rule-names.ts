import { atoms } from "./runtime";

export function getRuleNames(classList: string) {
  const componentRules = new Set<string>();
  const childRules = new Set<string>();
  const subscriptions = new Set<string>();

  const classListTokens = classList.split(/\s+/);
  const ruleRecord = Object.fromEntries(
    classListTokens.map((rule) => [rule, atoms.get(rule)])
  );

  for (const atom of name.split(/\s+/)) {
  }
}
