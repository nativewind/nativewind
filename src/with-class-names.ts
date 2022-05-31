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

const isComponentRegex = /(?:^|\s)(component)(?:$|\s)/gi;
const isParentRegex = /(?:^|\s)(parent)(?:$|\s)/gi;

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

  const isComponent = isComponentRegex.test(classes);
  const isParent = isParentRegex.test(classes);

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
    isParent,
  };
}
