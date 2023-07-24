import {
  ComponentType,
  forwardRef,
  useContext,
  useMemo,
  useEffect,
  useReducer,
  useState,
} from "react";
import { View, Pressable } from "react-native";

import { ContainerRuntime, InteropMeta, StyleMeta } from "../../types";
import { AnimationInterop } from "./animations";
import { flattenStyle } from "./flatten-style";
import { ContainerContext, globalStyles, styleMetaMap } from "./globals";
import { useInteractionHandlers, useInteractionSignals } from "./interaction";
import { useComputation } from "../shared/signals";
import { StyleSheet, VariableContext, useVariables } from "./stylesheet";

type CSSInteropWrapperProps = {
  __component: ComponentType<any>;
  __jsx: Function;
} & Record<string, any>;

/**
 * This is the default implementation of the CSS interop function. It is used to add CSS styles to React Native components.
 * @param jsx The JSX function that should be used to create the React elements.
 * @param type The React component type that should be rendered.
 * @param props The props object that should be passed to the component.
 * @param key The optional key to use for the component.
 * @returns The element rendered via the suppled JSX function
 */
export function defaultCSSInterop(
  jsx: Function,
  type: ComponentType<any>,
  props: any,
  key: string,
) {
  const classNames: string[] | undefined = props.className?.split(/\s+/);

  // Normal component without className prop
  if (!classNames) {
    return jsx(type, props, key);
  }

  const styles = classNames.map((s) => globalStyles.get(s)).filter(Boolean);

  // The wrapper will affect performance, so only include it if needed
  if (styles.some((s) => s && styleMetaMap.has(s))) {
    return jsx(
      CSSInteropWrapper,
      { ...props, className: classNames, __component: type, __jsx: jsx },
      key,
    );
  }

  // Merge the static styles with the props.style
  let style = Array.isArray(props.style)
    ? [...styles, ...props.style]
    : props.style
    ? [...styles, props.style]
    : styles;

  // If there is only one style in the resulting array, replace the array with the single style.
  if (Array.isArray(style) && style.length <= 1) {
    style = style[0];
  }

  return jsx(type, { ...props, style }, key);
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
    className,
    ...$props
  }: CSSInteropWrapperProps,
  ref,
) {
  const rerender = useRerender();
  const inheritedVariables = useVariables();
  const inheritedContainers = useContext(ContainerContext);
  const interaction = useInteractionSignals();

  /**
   * If the development environment is enabled, we should rerender all components if the StyleSheet updates.
   * This is because things like :root variables may have updated.
   */
  if (__DEV__) {
    useEffect(() => StyleSheet.__subscribe(rerender), []);
  }

  /**
   * The purpose of interopMeta is to reduce the number of operations performed in the render function.
   * The meta is entirely derived from the computed styles, so we only need to calculate it when a style changes.
   *
   * The interopMeta object holds information about the styling props, like if it's animated, if it requires layout,
   * if it has inline containers, etc.
   *
   * The object is updated using the derived state pattern. The computation is done in the for loop below and
   * is stored in a variable $interopMeta. After that, the component checks if $interopMeta is different from interopMeta
   * to update the state.
   */
  const [$interopMeta, setInteropMeta] = useState<InteropMeta>(initialMeta);

  /**
   * Create a computation that will flatten the className and generate a interopMeta
   * Any signals read while the computation is running will be subscribed to.
   *
   * useComputation handles the reactivity/memoization
   * flattenStyle handles converting the classNames collecting the metadata
   */
  const interopMeta = useComputation(
    () => {
      const flatProps = flattenStyle($props.style, className, {
        interaction,
        variables: inheritedVariables,
        containers: inheritedContainers,
      });

      /*
       * This is our guard to detect is anything has changed. If interopMeta !== $interopMeta
       *   then the interopMeta as updated
       */
      let interopMeta = $interopMeta;

      /*
       * Recalculate the interop meta when a style change occurs, due to a style update.
       * Rather than comparing the changes, we recalculate the entire meta.
       * To update the interop meta, we modify the `styledProps` and `styledPropsMeta` properties,
       * which will be flattened later.
       */
      for (const [key, style] of flatProps) {
        if (interopMeta.styledProps[key] !== style) {
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
                extractValue:
                  typeof meta.prop?.[1] === "string"
                    ? meta.prop?.[1]
                    : undefined,
              },
            },
          };
        }
      }

      // interopMeta has changed since last render (or it's the first render)
      // Recalculate the derived attributes
      if (interopMeta !== $interopMeta) {
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

          if (meta.extractValue) {
            /**
             * Good luck typing this. Lets just ignore that styledProps can sometimes be other values...
             *
             * I really don't know how extractedValues can work with animations/transitions, so atm they simply don't
             */
            (interopMeta.styledProps as any)[key] = (
              interopMeta.styledProps[key] as Record<string, unknown>
            )[meta.extractValue];
          } else {
            if (meta.animated) animatedProps.add(key);
            if (meta.transition) transitionProps.add(key);
          }

          requiresLayout ||= hasInlineContainers || meta.requiresLayout;
          hasActive ||= hasInlineContainers || meta.hasActive;
          hasHover ||= hasInlineContainers || meta.hasHover;
          hasFocus ||= hasInlineContainers || meta.hasFocus;
        }

        let animationInteropKey: string | undefined = undefined;
        if (animatedProps.size > 0 || transitionProps.size > 0) {
          animationInteropKey = [...animatedProps, ...transitionProps].join(
            ":",
          );
        }

        interopMeta = {
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
      }

      return interopMeta;
    },
    [className, $props.style, inheritedVariables, inheritedContainers],
    rerender,
  );

  // If something changed, then store the results of that change
  // TODO: Investigate if this should be a ref?
  if (interopMeta !== $interopMeta) {
    setInteropMeta(interopMeta);
  }

  if (
    component === View &&
    (interopMeta.hasActive || interopMeta.hasHover || interopMeta.hasFocus)
  ) {
    component = Pressable;
  }

  const variables = useMemo(
    () => Object.assign({}, inheritedVariables, interopMeta.variables),
    [inheritedVariables, interopMeta.variables],
  );

  const containers = useMemo(
    () => Object.assign({}, inheritedContainers, interopMeta.containers),
    [inheritedContainers, interopMeta.containers],
  );

  // This doesn't need to be memoized as it's values will be spread across the component
  const props: Record<string, any> = {
    ...$props,
    ...interopMeta.styledProps,
    ...useInteractionHandlers($props, interaction, interopMeta),
  };

  let children: JSX.Element = props.children;

  // Call `jsx` directly so we can bypass the polyfill render method
  if (interopMeta.hasInlineVariables) {
    children = jsx(VariableContext.Provider, { value: variables, children });
  }

  if (interopMeta.hasInlineContainers) {
    children = jsx(ContainerContext.Provider, { value: containers, children });
  }

  if (interopMeta.animationInteropKey) {
    return jsx(
      AnimationInterop,
      {
        ...props,
        ref,
        children,
        __component: component,
        __variables: variables,
        __containers: inheritedContainers,
        __interaction: interaction,
        __interopMeta: interopMeta,
      },
      interopMeta.animationInteropKey,
    );
  } else {
    return jsx(component, { ...props, ref, children });
  }
});

/* Micro optimizations. Save these externally so they are not recreated every render  */
const useRerender = () => useReducer(rerenderReducer, 0)[1];
const rerenderReducer = (acc: number) => acc + 1;
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
