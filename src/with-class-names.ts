export interface WithClassNames {
  baseClassName?: string;
  className?: string;
  baseTw?: string;
  twClassName?: string;
  propsToTransform?: string[];
  componentProps: Record<string, unknown>;
  spreadProps?: string[];
  classProps?: string[];
}
export function withClassNames({
  baseClassName,
  className,
  baseTw,
  twClassName,
  componentProps,
  propsToTransform = [],
  spreadProps = [],
  classProps = [],
}: WithClassNames) {
  const classes = [
    baseTw ?? baseClassName ?? "",
    twClassName ?? className ?? "",
  ].join(" ");
  const isComponent = classes.split(/\s+/).includes("component");

  const allClasses = [classes];

  for (const prop of [...propsToTransform, ...spreadProps, ...classProps]) {
    const componentProp = componentProps[prop];
    if (typeof componentProp === "string") {
      allClasses.push(componentProp);
    }
  }

  return {
    classes,
    allClasses: allClasses.join(" "),
    isComponent,
  };
}
