export function defaultCSSInterop(
  jsx: Function,
  type: any,
  { className, tw, ...props }: Record<string | number, unknown>,
  key: string,
) {
  className ??= tw;

  if (typeof className === "string") {
    const classNameStyle = { $$css: true, [className]: className };
    props.style = Array.isArray(props.style)
      ? [classNameStyle, ...props.style]
      : props.style
      ? [classNameStyle, props.style]
      : classNameStyle;
  }

  return jsx(type, props, key);
}
