import { useContext, useMemo, useRef } from "react";
import {
  GestureResponderEvent,
  LayoutChangeEvent,
  NativeSyntheticEvent,
  PixelRatio,
  Platform,
  PlatformColor,
  StyleSheet,
  TargetedEvent,
  TransformsStyle,
} from "react-native";

import {
  ContainerRuntime,
  Interaction,
  InteropFunctionOptions,
  InteropMeta,
  RuntimeValue,
  Style,
  StyleMeta,
  StyleProp,
} from "../../types";
import {
  testContainerQuery,
  testMediaQuery,
  testPseudoClasses,
} from "./conditions";
import { isRuntimeValue } from "../../shared";
import { createSignal, useComputation } from "./signals";
import { ContainerContext, rem, styleMetaMap, vh, vw } from "./globals";
import { VariableContext, defaultVariables, rootVariables } from "./stylesheet";

type UseComputedPropsOptions = InteropFunctionOptions<Record<string, unknown>>;

/**
 * Create a computation that will flatten the className and generate a interopMeta
 * Any signals read while the computation is running will be subscribed to.
 *
 * useComputation handles the reactivity/memoization
 * flattenStyle handles converting the classNames collecting the metadata
 */
export function useComputedProps<P extends Record<string, any>>(
  $props: P,
  options: UseComputedPropsOptions,
  rerender: () => void,
) {
  const propsRef = useRef<Record<string, any>>($props);
  propsRef.current = $props;

  const inheritedContainers = useContext(ContainerContext);
  const inheritedVariables = useContext(VariableContext);

  const computedVariables = useComputation(
    () => {
      // $variables will be null if this is a top-level component
      if (inheritedVariables === null) {
        return rootVariables.get();
      } else {
        return {
          ...inheritedVariables,
          ...defaultVariables.get(),
        };
      }
    },
    [inheritedVariables],
    rerender,
  );

  const interaction = useMemo<Interaction>(
    () => ({
      active: createSignal(false),
      hover: createSignal(false),
      focus: createSignal(false),
      layout: {
        width: createSignal<number>(0),
        height: createSignal<number>(0),
      },
    }),
    [],
  );

  return useComputation(
    () =>
      getComputedProps(
        propsRef.current,
        computedVariables,
        inheritedContainers,
        interaction,
        options,
      ),
    [computedVariables, inheritedContainers, ...options.dependencies],
    rerender,
  );
}

/**
 * TODO: This is the main logic for the library, we should unit test this function directly
 *
 * It is separated so it can be tested outside of ReactJS
 */
export function getComputedProps<P extends Record<string, any>>(
  propsRef: P,
  computedVariables: Record<string, unknown>,
  inheritedContainers: Record<string, ContainerRuntime>,
  interaction: Interaction,
  options: UseComputedPropsOptions,
) {
  const props: Record<string, any> = { ...propsRef };
  const variables = { ...computedVariables };
  const containers: Record<string, ContainerRuntime> = {};
  const animatedProps = new Set<string>();
  const transitionProps = new Set<string>();

  let hasInlineVariables = false;
  let hasInlineContainers = false;
  let requiresLayout = false;
  let hasActive: boolean | undefined = false;
  let hasHover: boolean | undefined = false;
  let hasFocus: boolean | undefined = false;

  for (const [key, config] of options.configMap) {
    if (config === false) {
      continue;
    }

    const flatStyle = flattenStyle(props[key], {
      ...options,
      interaction,
      variables: computedVariables,
      containers: inheritedContainers,
    });

    const meta = styleMetaMap.get(flatStyle);

    if (meta) {
      if (meta.variables) {
        Object.assign(variables, meta.variables);
        hasInlineVariables = true;
      }

      if (meta.container?.names) {
        hasInlineContainers = true;
        const runtime: ContainerRuntime = {
          type: "normal",
          interaction,
          style: flatStyle,
        };

        containers.__default = runtime;
        for (const name of meta.container.names) {
          containers[name] = runtime;
        }
      }

      if (meta.animations) animatedProps.add(key);
      if (meta.transition) transitionProps.add(key);

      requiresLayout ||= Boolean(hasInlineContainers || meta.requiresLayout);
      hasActive ||= Boolean(hasInlineContainers || meta.pseudoClasses?.active);
      hasHover ||= Boolean(hasInlineContainers || meta.pseudoClasses?.hover);
      hasFocus ||= Boolean(hasInlineContainers || meta.pseudoClasses?.focus);
    }

    if (
      config === true ||
      typeof config === "string" ||
      config?.nativeStyleToProp === undefined
    ) {
      props[key] = flatStyle;
    } else {
      for (const [styleKey, targetProp] of Object.entries(
        config.nativeStyleToProp,
      ) as [keyof Style, boolean | keyof P][]) {
        if (targetProp === true && flatStyle[styleKey]) {
          props[styleKey] = flatStyle[styleKey];
          delete flatStyle[styleKey];
        }

        if (config.target) {
          if (config.target === true) {
            props[key] = flatStyle;
          } else {
            props[config.target] = flatStyle;
          }
        }
      }
    }
  }

  let animationInteropKey: string | undefined;
  if (animatedProps.size > 0 || transitionProps.size > 0) {
    animationInteropKey = [...animatedProps, ...transitionProps].join(":");
  }

  if (requiresLayout) {
    props.onLayout = (event: LayoutChangeEvent) => {
      propsRef.onLayout?.(event);
      interaction.layout.width.set(event.nativeEvent.layout.width);
      interaction.layout.height.set(event.nativeEvent.layout.height);
    };
  }

  let convertToPressable = false;
  if (hasActive) {
    convertToPressable = true;
    props.onPressIn = (event: GestureResponderEvent) => {
      propsRef.onPressIn?.(event);
      interaction.active.set(true);
    };
    props.onPressOut = (event: GestureResponderEvent) => {
      propsRef.onPressOut?.(event);
      interaction.active.set(false);
    };
  }
  if (hasHover) {
    convertToPressable = true;
    props.onHoverIn = (event: MouseEvent) => {
      propsRef.onHoverIn?.(event);
      interaction.hover.set(true);
    };
    props.onHoverOut = (event: MouseEvent) => {
      propsRef.onHoverIn?.(event);
      interaction.hover.set(false);
    };
  }
  if (hasFocus) {
    convertToPressable = true;
    props.onFocus = (event: NativeSyntheticEvent<TargetedEvent>) => {
      propsRef.onFocus?.(event);
      interaction.focus.set(true);
    };
    props.onBlur = (event: NativeSyntheticEvent<TargetedEvent>) => {
      propsRef.onBlur?.(event);
      interaction.focus.set(false);
    };
  }

  const meta: InteropMeta = {
    animatedProps,
    animationInteropKey,
    containers,
    convertToPressable,
    hasInlineContainers,
    hasInlineVariables,
    inheritedContainers,
    interaction,
    transitionProps,
    variables,
    requiresLayout,
  };

  return {
    props,
    meta,
  };
}

type FlattenStyleOptions = {
  variables: Record<string, unknown>;
  containers: Record<string, ContainerRuntime>;
  interaction: Interaction;
  ch?: number;
  cw?: number;
};

/**
 * Reduce a StyleProp to a flat Style object.
 *
 * @remarks
 * As we loop over keys & values, we will resolve any dynamic values.
 * Some values cannot be calculated until the entire style has been flattened.
 * These values are defined as a getter and will be resolved lazily.
 *
 * @param styles The style or styles to flatten.
 * @param options The options for flattening the styles.
 * @param flatStyle The flat style object to add the flattened styles to.
 * @returns The flattened style object.
 */
export function flattenStyle(
  style: StyleProp,
  options: FlattenStyleOptions,
  flatStyle: Style = {},
): Style {
  if (!style) {
    return flatStyle;
  }

  if (Array.isArray(style)) {
    // We need to flatten in reverse order so that the last style in the array is the one defined
    for (let index = style.length - 1; index >= 0; index--) {
      if (style[index]) {
        flattenStyle(style[index], options, flatStyle);
      }
    }
    return flatStyle;
  }

  /*
   * TODO: Investigate if we early exit if there is no styleMeta.
   */
  const styleMeta: StyleMeta = styleMetaMap.get(style) ?? {};

  let flatStyleMeta = styleMetaMap.get(flatStyle);

  if (!flatStyleMeta) {
    flatStyleMeta = {};
    styleMetaMap.set(flatStyle, flatStyleMeta);
  }

  /**
   * If any style (even ones that don't pass the condition check check)
   * have variables, then we need to have a variable key. This is to ensure
   * VariableProvider is always added to the render tree, even if the styles are
   * not currently valid.
   *
   * This will prevent an unmount of components when styles with variables are suddenly valid
   */
  if (styleMeta.variables) {
    flatStyleMeta.variables ??= {};
  }

  // TODO: We should probably do this for containers as well, but I'm not sure we even want to
  //       support conditional containers.

  /*
   * START OF CONDITIONS CHECK
   *
   * If any of these fail, this style and its metadata will be skipped
   */
  if (styleMeta.pseudoClasses) {
    flatStyleMeta.pseudoClasses = {
      ...styleMeta.pseudoClasses,
      ...flatStyleMeta.pseudoClasses,
    };

    if (!testPseudoClasses(options.interaction, styleMeta.pseudoClasses)) {
      return flatStyle;
    }
  }

  // Skip failed media queries
  if (styleMeta.media && !styleMeta.media.every((m) => testMediaQuery(m))) {
    return flatStyle;
  }

  if (!testContainerQuery(styleMeta.containerQuery, options.containers)) {
    return flatStyle;
  }

  /*
   * END OF CONDITIONS CHECK
   */

  if (styleMeta.animations) {
    flatStyleMeta.animations = {
      ...styleMeta.animations,
      ...flatStyleMeta.animations,
    };
  }

  if (styleMeta.transition) {
    flatStyleMeta.transition = {
      ...styleMeta.transition,
      ...flatStyleMeta.transition,
    };
  }

  if (styleMeta.container) {
    flatStyleMeta.container ??= { type: "normal", names: [] };

    if (styleMeta.container.names) {
      flatStyleMeta.container.names = styleMeta.container.names;
    }
    if (styleMeta.container.type) {
      flatStyleMeta.container.type = styleMeta.container.type;
    }
  }

  if (styleMeta.requiresLayout) {
    flatStyleMeta.requiresLayout = true;
  }

  if (styleMeta.variables) {
    flatStyleMeta.variables ??= {};
    for (const [key, value] of Object.entries(styleMeta.variables)) {
      // Skip already set variables
      if (key in flatStyleMeta.variables) continue;

      const getterOrValue = extractValue(
        value,
        flatStyle,
        flatStyleMeta,
        options,
      );

      if (typeof getterOrValue === "function") {
        Object.defineProperty(flatStyleMeta.variables, key, {
          enumerable: true,
          get() {
            return getterOrValue();
          },
        });
      } else {
        flatStyleMeta.variables[key] = getterOrValue;
      }
    }
  }

  for (const [key, value] of Object.entries(style)) {
    // Skip already set keys
    if (key in flatStyle) continue;

    if (key === "transform") {
      const transforms: Record<string, unknown>[] = [];

      for (const transform of value) {
        // Transform is either an React Native transform object OR
        // A extracted value with type: "function"
        if ("type" in transform) {
          const getterOrValue = extractValue(
            transform,
            flatStyle,
            flatStyleMeta,
            options,
          );

          if (getterOrValue === undefined) {
            continue;
          } else if (typeof getterOrValue === "function") {
            transforms.push(
              Object.defineProperty({}, transform.name, {
                configurable: true,
                enumerable: true,
                get() {
                  return getterOrValue();
                },
              }),
            );
          }
        } else {
          for (const [tKey, tValue] of Object.entries(transform)) {
            const $transform: Record<string, unknown> = {};

            const getterOrValue = extractValue(
              tValue,
              flatStyle,
              flatStyleMeta,
              options,
            );

            if (typeof getterOrValue === "function") {
              Object.defineProperty($transform, tKey, {
                configurable: true,
                enumerable: true,
                get() {
                  return getterOrValue();
                },
              });
            } else {
              $transform[tKey] = getterOrValue;
            }

            transforms.push($transform);
          }
        }
      }

      flatStyle.transform =
        transforms as unknown as TransformsStyle["transform"];
    } else {
      const getterOrValue = extractValue(
        value,
        flatStyle,
        flatStyleMeta,
        options,
      );

      if (typeof getterOrValue === "function") {
        Object.defineProperty(flatStyle, key, {
          configurable: true,
          enumerable: true,
          get() {
            return getterOrValue();
          },
        });
      } else {
        flatStyle[key as keyof Style] = getterOrValue;
      }
    }
  }

  return flatStyle;
}

/**
 * Extracts a value from a StyleProp.
 * If the value is a dynamic value, it will be resolved.
 * @param value - The value to extract.
 * @param flatStyle - The flat Style object being built.
 * @param flatStyleMeta - Metadata for the flat Style object.
 * @param options - Options for flattening the StyleProp.
 * @returns The extracted value.
 */
function extractValue<T>(
  value: unknown,
  flatStyle: Style,
  flatStyleMeta: StyleMeta,
  options: FlattenStyleOptions,
): any {
  if (!isRuntimeValue(value)) {
    return value;
  }

  switch (value.name) {
    case "vh": {
      return round((vh.get() / 100) * (value.arguments[0] as number));
    }
    case "vw": {
      return round((vw.get() / 100) * (value.arguments[0] as number));
    }
    case "var": {
      return () => {
        const name = value.arguments[0] as string;
        const resolvedValue =
          flatStyleMeta.variables?.[name] ?? options.variables[name];

        return typeof resolvedValue === "function"
          ? resolvedValue()
          : resolvedValue;
      };
    }
    case "rem": {
      return round(rem.get() * (value.arguments[0] as number));
    }
    case "em": {
      return () => {
        const multiplier = value.arguments[0] as number;
        if ("fontSize" in flatStyle) {
          return round((flatStyle.fontSize || 0) * multiplier);
        }
        return;
      };
    }
    case "ch": {
      const multiplier = value.arguments[0] as number;

      let reference: number | undefined;

      if (options.ch) {
        reference = options.ch;
      } else if (options.interaction?.layout.height.get()) {
        reference = options.interaction.layout.height.get();
      } else if (typeof flatStyle.height === "number") {
        reference = flatStyle.height;
      }

      if (reference) {
        return round(reference * multiplier);
      } else {
        return () => {
          if (options.interaction?.layout.height.get()) {
            reference = options.interaction.layout.height.get();
          } else if (typeof flatStyle.height === "number") {
            reference = flatStyle.height;
          } else {
            reference = 0;
          }

          return round(reference * multiplier);
        };
      }
    }
    case "cw": {
      const multiplier = value.arguments[0] as number;

      let reference: number | undefined;

      if (options.cw) {
        reference = options.cw;
      } else if (options.interaction?.layout.width.get()) {
        reference = options.interaction.layout.width.get();
      } else if (typeof flatStyle.width === "number") {
        reference = flatStyle.width;
      }

      if (reference) {
        return round(reference * multiplier);
      } else {
        return () => {
          if (options.interaction?.layout.width.get()) {
            reference = options.interaction.layout.width.get();
          } else if (typeof flatStyle.width === "number") {
            reference = flatStyle.width;
          } else {
            reference = 0;
          }

          return round(reference * multiplier);
        };
      }
    }
    case "perspective":
    case "translateX":
    case "translateY":
    case "scaleX":
    case "scaleY":
    case "scale": {
      return createRuntimeFunction(value, flatStyle, flatStyleMeta, options, {
        wrap: false,
      });
    }
    case "rotate":
    case "rotateX":
    case "rotateY":
    case "rotateZ":
    case "skewX":
    case "skewY": {
      return createRuntimeFunction(value, flatStyle, flatStyleMeta, options, {
        wrap: false,
        parseFloat: false,
      });
    }
    case "hairlineWidth": {
      return StyleSheet.hairlineWidth;
    }

    case "platformSelect": {
      return createRuntimeFunction(
        {
          ...value,
          arguments: [Platform.select(value.arguments[0])],
        },
        flatStyle,
        flatStyleMeta,
        options,
        {
          wrap: false,
        },
      );
    }
    case "fontScaleSelect": {
      const specifics = value.arguments[0];
      const pixelRatio = PixelRatio.getFontScale();
      const match =
        specifics[pixelRatio] ?? specifics["native"] ?? specifics["default"];

      if (match === undefined) return;

      return createRuntimeFunction(
        {
          ...value,
          arguments: [match],
        },
        flatStyle,
        flatStyleMeta,
        options,
        {
          wrap: false,
        },
      );
    }
    case "pixelScaleSelect": {
      const specifics = value.arguments[0];
      const pixelRatio = PixelRatio.get();
      const match =
        specifics[pixelRatio] ?? specifics["native"] ?? specifics["default"];

      if (match === undefined) return;

      return createRuntimeFunction(
        {
          ...value,
          arguments: [match],
        },
        flatStyle,
        flatStyleMeta,
        options,
        {
          wrap: false,
        },
      );
    }
    case "platformColor": {
      return createRuntimeFunction(value, flatStyle, flatStyleMeta, options, {
        wrap: false,
        joinArgs: false,
        callback: PlatformColor,
        spreadCallbackArgs: true,
      });
    }
    case "pixelScale": {
      return createRuntimeFunction(value, flatStyle, flatStyleMeta, options, {
        wrap: false,
        callback: (value: number) => PixelRatio.get() * value,
      });
    }
    case "fontScale": {
      return createRuntimeFunction(value, flatStyle, flatStyleMeta, options, {
        wrap: false,
        callback: (value: number) => PixelRatio.getFontScale() * value,
      });
    }
    case "getPixelSizeForLayoutSize": {
      return createRuntimeFunction(value, flatStyle, flatStyleMeta, options, {
        wrap: false,
        callback: (value: number) =>
          PixelRatio.getPixelSizeForLayoutSize(value),
      });
    }
    case "roundToNearestPixel": {
      return createRuntimeFunction(
        {
          ...value,
          arguments: [PixelRatio.roundToNearestPixel(value.arguments[0])],
        },
        flatStyle,
        flatStyleMeta,
        options,
        {
          wrap: false,
        },
      );
    }
    case "rgb": {
      return createRuntimeFunction(value, flatStyle, flatStyleMeta, options, {
        joinArgs: false,
        callback(value: any) {
          const args = value.slice(4, -1).split(",");

          if (args.length === 4) {
            return `rgba(${args.join(",")})`;
          }
          return value;
        },
      });
    }
    default: {
      return createRuntimeFunction(value, flatStyle, flatStyleMeta, options);
    }
  }
}

interface CreateRuntimeFunctionOptions {
  wrap?: boolean;
  parseFloat?: boolean;
  joinArgs?: boolean;
  callback?: Function;
  spreadCallbackArgs?: boolean;
}

/**
 * TODO: This function is overloaded with functionality
 */
function createRuntimeFunction(
  value: RuntimeValue,
  flatStyle: Style,
  flatStyleMeta: StyleMeta,
  options: FlattenStyleOptions,
  {
    wrap = true,
    parseFloat: shouldParseFloat = true,
    joinArgs: joinArguments = true,
    spreadCallbackArgs: spreadCallbackArguments = false,
    callback,
  }: CreateRuntimeFunctionOptions = {},
) {
  let isStatic = true;
  const args: unknown[] = [];

  if (value.arguments) {
    for (const argument of value.arguments) {
      const getterOrValue = extractValue(
        argument,
        flatStyle,
        flatStyleMeta,
        options,
      );

      if (typeof getterOrValue === "function") {
        isStatic = false;
      }

      args.push(getterOrValue);
    }
  }

  const valueFn = () => {
    let $args: any = args
      .map((a) => (typeof a === "function" ? a() : a))
      .filter((a) => a !== undefined);

    if (joinArguments) {
      $args = $args.join(", ");

      if ($args === "") {
        return;
      }
    }

    let result = wrap ? `${value.name}(${$args})` : $args;

    if (shouldParseFloat) {
      const float = Number.parseFloat(result);

      if (!Number.isNaN(float) && float.toString() === result) {
        result = float;
      }
    }

    if (callback) {
      if (spreadCallbackArguments && Array.isArray(result)) {
        return callback(...result);
      } else {
        return callback(result);
      }
    }

    return result;
  };

  return isStatic ? valueFn() : valueFn;
}

function round(number: number) {
  return Math.round((number + Number.EPSILON) * 100) / 100;
}
