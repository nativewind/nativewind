import type { ConfigReducerState } from "../state/config";
import type { InlineStyle } from "../types";

export function getValue(
  state: ConfigReducerState,
  props: Record<string, any>,
  paths: string | string[],
) {
  const target = state.config.target;

  if (typeof paths === "string") {
    return getFinalValue(state, props, paths);
  }

  for (let i = 0; i < paths.length; i++) {
    let path = paths[i];

    if (!props) {
      return;
    }

    if (i === 0 && path.startsWith("^")) {
      path = path.slice(1);
      props = props[target];
    }

    if (i === paths.length - 1) {
      return getFinalValue(state, props, path);
    }

    props = props[path];
  }
}

function getFinalValue(
  state: ConfigReducerState,
  props: Record<string, any>,
  path: string,
) {
  if (path.startsWith("^")) {
    const target = state.config.target;
    path = path.slice(1);
    props = props?.[target];
  }

  if (transformKeys.has(path)) {
    props = props.transform.find(
      (obj: Record<string, unknown>) => obj[path] !== undefined,
    );
  }

  return props?.[path] || defaultValues[path as keyof typeof defaultValues];
}

export function setValue(
  target: Record<string, any> = {},
  paths: string | string[],
  value: string | number | InlineStyle,
  state?: ConfigReducerState,
  // Only set the value if the current value is a placeholder
  placeholder?: Record<string, any>,
) {
  let props = target;
  const configTarget = state?.config.target;

  if (typeof paths === "string") {
    paths = [paths];
  }

  for (let i = 0; i < paths.length; i++) {
    let path = paths[i];

    if (i === 0 && path.startsWith("^")) {
      if (!configTarget) {
        throw new Error("Cannot use ^ without a config target");
      }
      path = path.slice(1);
      props ??= {};
      props[configTarget] ??= {};
      props = props[configTarget];
    }

    if (i === paths.length - 1) {
      setFinalValue(props, path, value, placeholder);
      return target;
    }

    props ??= {};
    props[path] ??= {};
    props = props[path];
  }

  return target;
}

function setFinalValue(
  props: Record<string, any>,
  path: string,
  value: unknown,
  // Only set the value if the current value is a placeholder
  placeholder?: Record<string, any>,
): void {
  if (transformKeys.has(path)) {
    props ??= {};
    props.transform ??= [];

    let transformObj = props.transform.find(
      (obj: Record<string, unknown>) => obj[path] !== undefined,
    );

    if (!transformObj) {
      transformObj = {};
      props.transform.push(transformObj);
    }

    // If we have a placeholder, only set the value if the current value is the placeholder
    if (placeholder && transformObj[path] !== placeholder) {
      return;
    }

    transformObj[path] = value;
  } else {
    // If we have a placeholder, only set the value if the current value is the placeholder
    if (placeholder && props[path] !== placeholder) {
      return;
    }

    props[path] = value;
  }
}

export function assignStyleObjects(
  target: Record<string, any>,
  source: Record<string, any>,
) {
  const style = {
    ...target,
    ...source,
  };

  if (target.transform || source.transform) {
    style.transform = Object.entries(
      Object.assign({}, ...target.transform, ...source.transform),
    ).map((entry) => {
      return { [entry[0]]: entry[1] };
    });
  }

  if (target.transformOrigin || source.transformOrigin) {
    style.transformOrigin = Object.assign(
      {},
      target.transformOrigin,
      source.transformOrigin,
    );
  }

  if (target.transformOrigin || source.transformOrigin) {
    style.transformOrigin = Object.assign(
      {},
      target.transformOrigin,
      source.transformOrigin,
    );
  }

  for (const key in source) {
    if (transformKeys.has(key)) {
      target.transform ??= [];
      target.transform.push(source[key]);
    } else {
      target[key] = source[key];
    }
  }
}

export const transformKeys = new Set([
  "translateX",
  "translateY",
  "scale",
  "scaleX",
  "scaleY",
  "rotate",
  "rotateX",
  "rotateY",
  "rotateZ",
  "skewX",
  "skewY",
  "perspective",
  "matrix",
  "transformOrigin",
]);

export const defaultValues: Record<string, any> = {
  backgroundColor: "transparent",
  borderBottomColor: "transparent",
  borderBottomLeftRadius: 0,
  borderBottomRightRadius: 0,
  borderBottomWidth: 0,
  borderColor: "transparent",
  borderLeftColor: "transparent",
  borderLeftWidth: 0,
  borderRadius: 0,
  borderRightColor: "transparent",
  borderRightWidth: 0,
  borderTopColor: "transparent",
  borderTopWidth: 0,
  borderWidth: 0,
  bottom: 0,
  color: "black",
  flex: 1,
  flexBasis: 1,
  flexGrow: 1,
  flexShrink: 0,
  fontSize: 14,
  fontWeight: "400",
  gap: 0,
  left: 0,
  lineHeight: 14,
  margin: 0,
  marginBottom: 0,
  marginLeft: 0,
  marginRight: 0,
  marginTop: 0,
  maxHeight: 99999,
  maxWidth: 99999,
  minHeight: 0,
  minWidth: 0,
  opacity: 1,
  padding: 0,
  paddingBottom: 0,
  paddingLeft: 0,
  paddingRight: 0,
  paddingTop: 0,
  perspective: 1,
  right: 0,
  rotate: "0deg",
  rotateX: "0deg",
  rotateY: "0deg",
  rotateZ: "0deg",
  scale: 1,
  scaleX: 1,
  scaleY: 1,
  skewX: "0deg",
  skewY: "0deg",
  textShadowRadius: 0,
  top: 0,
  transformOrigin: "50%",
  translateX: 0,
  translateY: 0,
  width: 0,
  zIndex: 0,
};
