export interface WithClassNames {
  className?: string;
  twClassName?: string;
  propsToTransform?: string[];
  componentProps: Record<string, unknown>;
  spreadProps?: string[];
  classProps?: string[];
}

const isComponentRegex = /(?:^|\s)(component)(?:$|\s)/gi;
const isParentRegex = /(?:^|\s)(parent)(?:$|\s)/gi;

export function withClassNames({
  className,
  twClassName,
  componentProps,
  propsToTransform = [],
  spreadProps = [],
  classProps = [],
}: WithClassNames) {
  const classes = twClassName ?? className ?? "";
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
