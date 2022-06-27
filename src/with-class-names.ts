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

const isGroupScopedRegex = /(?:^|\s)(group-scoped)(?:$|\s)/gi;
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

  const isGroupScoped = isGroupScopedRegex.test(className);
  const isParent = isParentRegex.test(className);

  const allClasses = [className];

  for (const prop of [...propsToTransform, ...spreadProps, ...classProps]) {
    const componentProp = componentProps[prop];
    if (typeof componentProp === "string") {
      allClasses.push(componentProp);
    }
  }

  return {
    className,
    allClasses: allClasses.join(" "),
    isGroupScoped,
    isParent,
  };
}
