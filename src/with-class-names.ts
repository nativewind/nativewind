export interface WithClassNames {
  className?: string;
  twClassName?: string;
  propsToTransform?: string[];
  componentProps: Record<string, unknown>;
  spreadProps?: string[];
  cssProps?: string[];
}
export function withClassNames({
  className,
  twClassName,
  componentProps,
  propsToTransform = [],
  spreadProps = [],
  cssProps = [],
}: WithClassNames) {
  const classes = twClassName ?? className ?? "";
  const isComponent = classes.split(/\s+/).includes("component");

  const allClasses = [];

  for (const prop of [...propsToTransform, ...spreadProps, ...cssProps]) {
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
