import { useCallback } from "react";

import { activeFamily, focusFamily, hoverFamily } from "./globals";
import { Props } from "./types";
import { UseInteropState } from "./useInterop";

type InteractionType =
  | "onHoverIn"
  | "onHoverOut"
  | "onPress"
  | "onPressIn"
  | "onPressOut"
  | "onFocus"
  | "onBlur";

const weakMap = new WeakMap<
  Function,
  Record<InteractionType, (event: unknown) => void>
>();

export function handlerFamily(
  type: InteractionType,
  mainHandler: (type: InteractionType, event: unknown) => void,
) {
  let handlers = weakMap.get(mainHandler);

  if (!handlers) {
    handlers = {
      onBlur: (event) => mainHandler("onBlur", event),
      onFocus: (event) => mainHandler("onFocus", event),
      onHoverIn: (event) => mainHandler("onHoverIn", event),
      onHoverOut: (event) => mainHandler("onHoverOut", event),
      onPress: (event) => mainHandler("onPress", event),
      onPressIn: (event) => mainHandler("onPressIn", event),
      onPressOut: (event) => mainHandler("onPressOut", event),
    };
    weakMap.set(mainHandler, handlers);
  }

  return handlers[type];
}

export function useHandlers(state: UseInteropState, props?: Props) {
  // The React Compiler prevents you from modifying props directly
  let newProps = Object.assign({}, props);

  /**
   * Create a handler for each interaction type, and as the key for sub-handlers
   */
  const handler = useCallback(
    (type: InteractionType, event: unknown) => {
      switch (type) {
        case "onHoverIn":
          props?.onHover?.(event);
          hoverFamily(state.key).set(true);
          break;
        case "onHoverOut":
          props?.onHover?.(event);
          hoverFamily(state.key).set(false);
          break;
        case "onPress":
          props?.onPress?.(event);
          break;
        case "onPressIn":
          props?.onPressIn?.(event);
          activeFamily(state.key).set(true);
          break;
        case "onPressOut":
          props?.onPressOut?.(event);
          activeFamily(state.key).set(false);
          break;
        case "onFocus":
          props?.onFocus?.(event);
          focusFamily(state.key).set(true);
          break;
        case "onBlur":
          props?.onBlur?.(event);
          focusFamily(state.key).set(false);
          break;
      }
    },
    [state.key, props],
  );

  if (hoverFamily.has(state.key)) {
    if (!newProps) newProps = {};
    newProps.onHoverIn = handlerFamily("onHoverIn", handler);
    newProps.onHoverOut = handlerFamily("onHoverOut", handler);
  }

  if (activeFamily.has(state.key)) {
    if (!newProps) newProps = {};
    newProps.onPress = handlerFamily("onPress", handler);
    newProps.onPressIn = handlerFamily("onPressIn", handler);
    newProps.onPressOut = handlerFamily("onPressOut", handler);
  }

  if (focusFamily.has(state.key)) {
    if (!newProps) newProps = {};
    newProps.onBlur = handlerFamily("onBlur", handler);
    newProps.onFocus = handlerFamily("onFocus", handler);
  }

  return newProps;
}
