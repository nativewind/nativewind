import { ReactNode, Children, cloneElement } from "react";
import { isFragment } from "react-is";
import { matchChildAtRule } from "./match-at-rule";
import { AtRuleRecord } from "./types/common";

export interface WithStyledChildrenOptions {
  componentChildren: ReactNode;
  childStyles?: AtRuleRecord[];
}

export function withStyledChildren({
  componentChildren,
  childStyles,
}: WithStyledChildrenOptions): ReactNode {
  let children = isFragment(componentChildren)
    ? // This probably needs to be recursive
      componentChildren.props.children
    : componentChildren;

  if (childStyles) {
    children = Children.map(children, (child, index) => {
      const matchingStyles = [];
      for (const { atRules, ...styles } of childStyles) {
        const matches = atRules.every(([rule, params]) => {
          return matchChildAtRule({
            nthChild: index + 1,
            rule,
            params,
          });
        });
        if (matches) {
          matchingStyles.push(styles);
        }
      }

      return cloneElement(child, {
        style: child.props.style
          ? [child.props.style, matchingStyles]
          : matchingStyles.length > 0
          ? matchingStyles
          : undefined,
      });
    });
  }

  return children;
}
