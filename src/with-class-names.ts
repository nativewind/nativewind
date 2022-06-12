export interface WithClassNames {
  baseClassName?: string;
  propClassName?: string;
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
  propClassName,
  baseTw,
  twClassName,
  componentProps,
  propsToTransform = [],
  spreadProps = [],
  classProps = [],
}: WithClassNames) {
  const className = [
    baseTw ?? baseClassName ?? "",
    twClassName ?? propClassName ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  const isComponent = isComponentRegex.test(className);
  const isParent = isParentRegex.test(className);

  const allClasses = [];

  for (const prop of [...propsToTransform, ...spreadProps, ...classProps]) {
    if (typeof componentProps[prop] === "string") {
      allClasses.push(componentProps[prop]);
    }
  }

  return {
    className,
    allClasses: allClasses.join(" "),
    isComponent,
    isParent,
  };
}
