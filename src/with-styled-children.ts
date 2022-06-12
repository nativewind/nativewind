import { ReactNode, Children, cloneElement } from "react";
import { isFragment } from "react-is";
import { StylesArray, StyleSheetStore } from "./style-sheet-store";

export interface WithStyledChildrenOptions {
  componentChildren: ReactNode;
  store: StyleSheetStore;
  stylesArray: StylesArray<unknown>;
  parentHover: boolean;
  parentFocus: boolean;
  parentActive: boolean;
}

export function withStyledChildren({
  componentChildren,
  store,
  stylesArray,
  parentHover,
  parentFocus,
  parentActive,
}: WithStyledChildrenOptions): ReactNode {
  if (!stylesArray.childStyles) {
    return componentChildren;
  }

  const children = isFragment(componentChildren)
    ? // This probably needs to be recursive
      componentChildren.props.children
    : componentChildren;

  return Children.map(children, (child, index) => {
    const style = store.getChildStyles(stylesArray, {
      nthChild: index + 1,
      parentHover,
      parentFocus,
      parentActive,
    });

    if (!style || style.length === 0) {
      return child;
    }

    return child.props.style
      ? cloneElement(child, { style: [child.props.style, style] })
      : cloneElement(child, { style });
  });
}
