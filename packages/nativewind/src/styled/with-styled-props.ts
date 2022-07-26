import { useTailwind } from "./use-tailwind";
import type { StyledOptions } from "./index";

export interface WithStyledPropsOptions<P> {
  preprocessed: boolean;
  className: string;
  propsToTransform?: StyledOptions<P>["props"];
  componentProps: Record<string, unknown>;
  classProps?: StyledOptions<P>["classProps"];
}

export function withStyledProps<S, T>({
  propsToTransform,
  componentProps,
  classProps,
  preprocessed,
  className,
}: WithStyledPropsOptions<T>) {
  const styledProps: Partial<Record<keyof T, unknown>> = {};
  let mask = 0;

  if (classProps) {
    if (preprocessed) {
      for (const prop of classProps) {
        styledProps[prop] = undefined;
        className += ` ${componentProps[prop as keyof typeof componentProps]}`;
      }
    } else {
      for (const prop of classProps) {
        const style = useTailwind<S>({
          className: componentProps[prop] as string,
          flatten: true,
        });

        if (style.mask) {
          mask |= style.mask;
        }

        Object.assign(styledProps, { [prop]: undefined }, style[0]);
      }
    }
  }

  if (propsToTransform && !preprocessed) {
    for (const [prop, styleKey] of Object.entries(propsToTransform)) {
      const styleArray = useTailwind<S>({
        className: componentProps[prop] as string,
        flatten: styleKey !== true,
      });

      if (styleArray.length === 0) {
        continue;
      }

      if (styleArray.mask) {
        mask |= styleArray.mask;
      }

      if (typeof styleKey === "boolean") {
        styledProps[prop as keyof T] = styleArray;
      } else {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        styledProps[prop as keyof T] = (styleArray[0] as any)[styleKey as any];
      }
    }
  }

  return { styledProps, mask, className };
}
