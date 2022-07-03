import { useTailwind } from "./use-tailwind";

export interface WithStyledPropsOptions<T extends string> {
  preprocessed: boolean;
  className: string;
  propsToTransform?: T[];
  componentProps: Record<string, unknown>;
  spreadProps?: T[];
  classProps?: T[];
}

export function withStyledProps<S, T extends string>({
  propsToTransform,
  componentProps,
  classProps,
  spreadProps,
  preprocessed,
  className,
}: WithStyledPropsOptions<T>) {
  const styledProps: Partial<Record<T, unknown>> = {};
  let mask = 0;

  if (preprocessed) {
    if (classProps) {
      const classPropsName = classProps.map((prop) => {
        styledProps[prop] = undefined;
        return componentProps[prop as keyof typeof componentProps] as string;
      });
      className = `${className} ${classPropsName.join(" ")}`;
    }

    return { styledProps, mask, className };
  }

  if (classProps) {
    for (const prop of classProps) {
      const style = useTailwind<S>({
        className: componentProps[prop] as string,
        flatten: true,
      });

      if (style.mask) {
        mask |= style.mask;
      }

      Object.assign(styledProps, { [prop]: undefined }, style);
    }
  }

  if (spreadProps) {
    for (const prop of spreadProps) {
      const style = useTailwind<S>({
        className: componentProps[prop] as string,
        flatten: true,
      });

      if (style.mask) {
        mask |= style.mask;
      }

      Object.assign(styledProps, { [prop]: undefined }, style);
    }
  }

  if (propsToTransform) {
    for (const prop of propsToTransform) {
      const style = useTailwind<S>({
        className: componentProps[prop] as string,
      });

      if (style.length === 0) {
        continue;
      }

      if (style.mask) {
        mask |= style.mask;
      }

      styledProps[prop] = style;
    }
  }

  return { styledProps, mask, className };
}
