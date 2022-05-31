export interface WithClassNames {
  baseClassName?: string;
  className?: string;
  twClassName?: string;
  propsToTransform?: string[];
  componentProps: Record<string, unknown>;
  spreadProps?: string[];
  classProps?: string[];
}
export function withClassNames({
  baseClassName = "",
  className,
  twClassName,
  componentProps,
  propsToTransform = [],
  spreadProps = [],
  classProps = [],
}: WithClassNames) {
  const classes = [baseClassName, twClassName ?? className ?? ""].join(" ");
  const isComponent = classes.split(/\s+/).includes("component");

  const allClasses = [];

  for (const prop of [...propsToTransform, ...spreadProps, ...classProps]) {
    if (typeof componentProps[prop] === "string") {
      allClasses.push(componentProps[prop]);
    }
  }

  return {
    classes,
    allClasses: allClasses.join(" "),
    isComponent,
  };
}
