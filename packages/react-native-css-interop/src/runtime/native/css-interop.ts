import {
  ComponentType,
  forwardRef,
  useContext,
  useMemo,
  useEffect,
  useReducer,
} from "react";
import { View, Pressable } from "react-native";

import {
  ContainerRuntime,
  CssInteropPropMapping,
  InteropMeta,
  JSXFunction,
  StyleMeta,
  StyleProp,
} from "../../types";
import { flattenStyleProps } from "./flatten-style";
import { ContainerContext, globalStyles, styleMetaMap } from "./globals";
import { useInteractionHandlers, useInteractionSignals } from "./interaction";
import { useComputation } from "../shared/signals";
import {
  StyleSheet,
  VariableContext,
  defaultVariables,
  rootVariables,
} from "./stylesheet";
import { DevHotReloadSubscription } from "../../shared";

type CSSInteropWrapperProps = {
  __component: ComponentType<unknown>;
  __jsx: JSXFunction;
  __mapping: CssInteropPropMapping<object>;
  __styledProps: Record<string, StyleProp>;
  __dependencies: unknown[];
} & Record<string, unknown>;

/**
 * This is the default implementation of the CSS interop function. It is used to add CSS styles to React Native components.
 * @param jsx The JSX function that should be used to create the React elements.
 * @param type The React component type that should be rendered.
 * @param props The props object that should be passed to the component.
 * @param key The optional key to use for the component.
 * @returns The element rendered via the supplied JSX function
 */
export function defaultCSSInterop(
  jsx: JSXFunction,
  type: ComponentType<unknown>,
  { ...props }: Record<string | number, unknown>,
  key: string,
  mapping: Map<string, unknown>,
) {
  let hasMeta = false;
  const dependencies: unknown[] = [];
  const styledProps: Record<string, StyleProp> = {};

  for (const [classNameKey, propKey] of mapping) {
    if (!propKey) continue;

    const classNames = props[classNameKey];
    delete props[classNameKey];

    dependencies.push(classNames);

    if (typeof classNames !== "string" || !classNames) {
      continue;
    }

    let styles: StyleProp = [];
    let targetKey: string | undefined;

    /**
     * This code checks if we can to bypass the CSSInteropWrapper
     *
     * If a style does not have any metadata, then it is completely static and the wrapper adds no value.
     * Instead of splitting the styles both here and inside the wrapper, we extract them and pass them down
     *
     * INVESTIGATE: Currently we're passing the props by simply giving them unlikely names (underscore prefix)
     *   Should we instead use a WeakMap?
     */
    for (const className of classNames.split(/\s+/)) {
      const style = globalStyles.get(className);
      if (!style) continue;
      styles.push(style);
    }

    if (typeof propKey === "string") {
      const existingStyle = props[propKey];
      dependencies.push(existingStyle);

      if (Array.isArray(existingStyle)) {
        styles = [...styles, ...existingStyle];
      } else if (existingStyle) {
        styles = [...styles, existingStyle];
      }

      targetKey = propKey;
    } else {
      targetKey = classNameKey;
    }

    if (styles.length > 0) {
      styledProps[targetKey] = styles.length === 1 ? styles[0] : styles;
    }

    hasMeta ||= stylePropHasMeta(styles);
  }

  if (!hasMeta) {
    return jsx(type, { ...props, ...styledProps }, key);
  }

  return jsx(
    CSSInteropWrapper,
    {
      ...props,
      __component: type,
      __jsx: jsx,
      __styledProps: styledProps,
      __dependencies: dependencies,
    },
    key,
  );
}

function stylePropHasMeta(style: StyleProp): boolean {
  if (!style) return false;
  if (Array.isArray(style)) return style.some((s) => stylePropHasMeta(s));
  return styleMetaMap.has(style);
}

/**
 * This component is a wrapper that handles the styling interop between React Native and CSS functionality
 *
 * @remarks
 * The CSSInteropWrapper function has an internal state, interopMeta, which holds information about the styling props,
 * like if it's animated, if it requires a layout listener, if it has inline containers, etc. When a style prop changes, the component
 * calculates the new style and meta again using a helper function called flattenStyle.
 *
 * @param __component - Component to be rendered
 * @param $props - Any other props to be passed to the component
 * @param ref - Ref to the component
 */
const CSSInteropWrapper = forwardRef(function CSSInteropWrapper(
  {
    __component: component,
    __jsx: jsx,
    __styledProps: styledProps,
    __dependencies: dependencies,
    ...$props
  }: CSSInteropWrapperProps,
  ref,
) {
  const rerender = useRerender();
  const inheritedContainers = useContext(ContainerContext);
  const interaction = useInteractionSignals();

  const $variables = useContext(VariableContext);

  const inheritedVariables = useComputation(
    () => {
      // $variables will be null if this is a top-level component
      if ($variables === null) {
        return rootVariables.get();
      } else {
        return {
          ...$variables,
          ...defaultVariables.get(),
        };
      }
    },
    [$variables],
    rerender,
  );

  /**
   * If the development environment is enabled, we should rerender all components if the StyleSheet updates.
   * This is because things like :root variables may have updated.
   */
  if (__DEV__) {
    useEffect(() => StyleSheet[DevHotReloadSubscription](rerender), []);
  }

  /**
   * Create a computation that will flatten the className and generate a interopMeta
   * Any signals read while the computation is running will be subscribed to.
   *
   * useComputation handles the reactivity/memoization
   * flattenStyle handles converting the classNames collecting the metadata
   */
  const interopMeta = useComputation(
    () => {
      const flatProps = flattenStyleProps(styledProps, {
        interaction,
        variables: inheritedVariables,
        containers: inheritedContainers,
      });

      /*
       * This is our guard to detect is anything has changed. If interopMeta !== $interopMeta
       *   then the interopMeta as updated
       */
      let interopMeta = initialMeta;

      /*
       * Recalculate the interop meta when a style change occurs, due to a style update.
       * Rather than comparing the changes, we recalculate the entire meta.
       * To update the interop meta, we modify the `styledProps` and `styledPropsMeta` properties,
       * which will be flattened later.
       */
      for (const [key, style] of flatProps) {
        const meta = styleMetaMap.get(style) ?? defaultMeta;

        interopMeta = {
          ...interopMeta,
          styledProps: { ...interopMeta.styledProps, [key]: style },
          styledPropsMeta: {
            ...interopMeta.styledPropsMeta,
            [key]: {
              animated: Boolean(meta.animations),
              transition: Boolean(meta.transition),
              requiresLayout: Boolean(meta.requiresLayout),
              variables: meta.variables,
              containers: meta.container?.names,
              hasActive: meta.pseudoClasses?.active,
              hasHover: meta.pseudoClasses?.hover,
              hasFocus: meta.pseudoClasses?.focus,
            },
          },
        };
      }

      let hasInlineVariables = false;
      let hasInlineContainers = false;
      let requiresLayout = false;
      let hasActive: boolean | undefined = false;
      let hasHover: boolean | undefined = false;
      let hasFocus: boolean | undefined = false;

      const variables = {};
      const containers: Record<string, ContainerRuntime> = {};
      const animatedProps = new Set<string>();
      const transitionProps = new Set<string>();

      for (const [key] of flatProps) {
        const meta = interopMeta.styledPropsMeta[key];

        Object.assign(variables, meta.variables);

        if (meta.variables) hasInlineVariables = true;
        if (meta.containers) {
          hasInlineContainers = true;
          const runtime: ContainerRuntime = {
            type: "normal",
            interaction,
            style: interopMeta.styledProps[key],
          };

          containers.__default = runtime;
          for (const name of meta.containers) {
            containers[name] = runtime;
          }
        }

        if (meta.animated) animatedProps.add(key);
        if (meta.transition) transitionProps.add(key);

        requiresLayout ||= hasInlineContainers || meta.requiresLayout;
        hasActive ||= hasInlineContainers || meta.hasActive;
        hasHover ||= hasInlineContainers || meta.hasHover;
        hasFocus ||= hasInlineContainers || meta.hasFocus;
      }

      let animationInteropKey: string | undefined;
      if (animatedProps.size > 0 || transitionProps.size > 0) {
        animationInteropKey = [...animatedProps, ...transitionProps].join(":");
      }

      return {
        ...interopMeta,
        variables,
        containers,
        animatedProps,
        transitionProps,
        requiresLayout,
        hasInlineVariables,
        hasInlineContainers,
        animationInteropKey,
        hasActive,
        hasHover,
        hasFocus,
      };
    },
    // Only rerun if the variables, containers or a prop has changed
    // styledPropKeys is static and will always return an array of the same length
    [inheritedVariables, inheritedContainers, ...dependencies],
    rerender,
  );

  if (
    component === View &&
    (interopMeta.hasActive || interopMeta.hasHover || interopMeta.hasFocus)
  ) {
    component = Pressable as ComponentType<unknown>;
  }

  /**
   * TODO: This isn't actually memoized property, as interopMeta.variables
   * is often a new object
   */
  const variables = useMemo(
    () => Object.assign({}, inheritedVariables, interopMeta.variables),
    [inheritedVariables, interopMeta.variables],
  );

  /**
   * TODO: This isn't actually memoized property, as interopMeta.containers,
   * is often a new object
   */
  const containers = useMemo(
    () => Object.assign({}, inheritedContainers, interopMeta.containers),
    [inheritedContainers, interopMeta.containers],
  );

  // This doesn't need to be memoized as it's values will be spread across the component
  const props: Record<string, unknown> = {
    ...$props,
    ...interopMeta.styledProps,
    ...useInteractionHandlers($props, interaction, interopMeta),
    ref,
  };

  let children = props.children as ComponentType<unknown>;

  // Call `jsx` directly so we can bypass the polyfill render method
  if (interopMeta.hasInlineVariables) {
    children = jsx(
      VariableContext.Provider,
      { value: variables, children },
      "variable",
    );
  }

  if (interopMeta.hasInlineContainers) {
    children = jsx(
      ContainerContext.Provider,
      { value: containers, children },
      "container",
    );
  }

  if (children) {
    props.children = Array.isArray(children) ? children : [children];
  }

  if (interopMeta.animationInteropKey) {
    return jsx(
      require("./animations").AnimationInterop,
      {
        ...props,
        __component: component,
        __variables: variables,
        __containers: inheritedContainers,
        __interaction: interaction,
        __interopMeta: interopMeta,
      },
      interopMeta.animationInteropKey,
    );
  } else {
    return jsx(component, props);
  }
});

/* Micro optimizations. Save these externally so they are not recreated every render  */
const useRerender = () => useReducer(rerenderReducer, 0)[1];
const rerenderReducer = (accumulator: number) => accumulator + 1;
const defaultMeta: StyleMeta = { container: { names: [], type: "normal" } };
const initialMeta: InteropMeta = {
  styledProps: {},
  styledPropsMeta: {},
  variables: {},
  containers: {},
  animatedProps: new Set(),
  transitionProps: new Set(),
  requiresLayout: false,
  hasInlineVariables: false,
  hasInlineContainers: false,
};
