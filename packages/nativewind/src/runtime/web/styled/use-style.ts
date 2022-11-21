import { CSSProperties, useMemo } from "react";
import { Style } from "../../../transform-css/types";
import { mergeClassNames } from "../stylesheet";

export function useStyle(classValue?: string, style?: CSSProperties) {
  return useMemo(() => {
    const mergedClassName = classValue
      ? mergeClassNames(classValue)
      : undefined;

    if (mergedClassName && style) {
      return [
        { $$css: true, [mergedClassName]: mergedClassName } as Style,
        style,
      ];
    } else if (mergedClassName) {
      return { $$css: true, [mergedClassName]: mergedClassName } as Style;
    } else if (style) {
      return style;
    }
  }, [style, classValue]);
}
