const ForwardRefSymbol = Symbol.for("react.forward_ref");
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getComponentType(component: any) {
  switch (typeof component) {
    case "function":
    case "object":
      return "$$typeof" in component && component.$$typeof === ForwardRefSymbol
        ? "forwardRef"
        : component.prototype?.isReactComponent
          ? "class"
          : typeof component;
    default:
      return "unknown";
  }
}
