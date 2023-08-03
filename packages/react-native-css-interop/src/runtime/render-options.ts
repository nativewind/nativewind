import {
  CSSInteropClassNamePropConfig,
  InteropFunctionOptions,
} from "../types";

export function getInteropFunctionOptions<P>(
  props: P,
  _options: Map<keyof P & string, CSSInteropClassNamePropConfig<P>>,
): InteropFunctionOptions<P> {
  return {
    remappedProps: props,
    configMap: new Map(),
    dependencies: [],
    hasMeta: false,
  };
}

export function getRemappedProps<P>(
  props: P,
  _options: Map<keyof P & string, CSSInteropClassNamePropConfig<P>>,
) {
  return props;
}
