import { ReactNode, Children, cloneElement, isValidElement } from "react";
import { StyleProp } from "react-native";
import { isFragment } from "react-is";
import { StylesArray, StyleSheetRuntime } from "../style-sheet";
import { matchesMask, PARENT } from "../utils/selector";
import { ComponentState } from "./use-component-state";

export interface WithStyledChildrenOptions {
  componentChildren: ReactNode;
  store: StyleSheetRuntime;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  stylesArray: StylesArray<any>;
  mask: number;
  componentState: ComponentState;
}

export function withStyledChildren({
  componentChildren,
  componentState,
  mask,
  store,
  stylesArray,
}: WithStyledChildrenOptions): ReactNode {
  const isParent = matchesMask(mask, PARENT);

  if (!stylesArray.childClassNames && !isParent) {
    return componentChildren;
  }

  const children = isFragment(componentChildren)
    ? // This probably needs to be recursive
      componentChildren.props.children
    : componentChildren;

  return Children.toArray(children)
    .filter(Boolean)
    .map((child, index) => {
      if (!isValidElement<{ style?: StyleProp<unknown> }>(child)) {
        return child;
      }

      const style = store.getChildStyles(stylesArray, {
        nthChild: index + 1,
        parentHover: componentState.hover,
        parentFocus: componentState.focus,
        parentActive: componentState.active,
      });

      if (!style || style.length === 0) {
        return child;
      }

      return child.props.style
        ? cloneElement(child, { style: [child.props.style, style] })
        : cloneElement(child, { style });
    });
}
