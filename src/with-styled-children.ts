import { ReactNode, Children, cloneElement } from "react";
import { isFragment } from "react-is";
import { matchChildAtRule } from "./match-at-rule";
import { AtRuleRecord } from "./types/common";

export interface WithStyledChildrenOptions {
  componentChildren: ReactNode;
  childStyles: AtRuleRecord[];
  isParent: boolean;
  parentHover: boolean;
  parentFocus: boolean;
  parentActive: boolean;
}

export function withStyledChildren({
  componentChildren,
  childStyles,
  isParent,
  parentHover,
  parentFocus,
  parentActive,
}: WithStyledChildrenOptions): ReactNode {
  if (!childStyles && !isParent) {
    return componentChildren;
  }

  let children = isFragment(componentChildren)
    ? // This probably needs to be recursive
      componentChildren.props.children
    : componentChildren;

  children = Children.map(children, (child, index) => {
    /**
     * For every child:
     *  For every style:
     *    For every atRule:
     *      Ensure all atRules match
     *    If all atRules match, push the style
     *  Add the styles to the child
     * Return the children
     *
     * This is a inefficient and makes parent: selectors a bit slow
     * as we repeat the logic for nearly every child. Sometimes that's required (eg. nthChild)
     * but typically not.
     *
     * We should split the childStyles into static and dynamic and only loop the dynamic
     * ones for each child.
     */
    const matchingStyles = [];

    for (const { atRules, ...styles } of childStyles) {
      const matches = atRules.every(([rule, params]) => {
        return matchChildAtRule({
          nthChild: index + 1,
          rule,
          params,
          parentHover,
          parentFocus,
          parentActive,
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

  return children;
}
