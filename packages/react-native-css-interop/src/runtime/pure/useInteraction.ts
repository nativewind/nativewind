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

export const handlerFamily = function (
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
};

export function useInteraction(state: UseInteropState, props?: Props) {
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
    props ??= {};
    props.onHoverIn = handlerFamily("onHoverIn", handler);
    props.onHoverOut = handlerFamily("onHoverOut", handler);
  }

  if (activeFamily.has(state.key)) {
    props ??= {};
    props.onPress = handlerFamily("onPress", handler);
    props.onPressIn = handlerFamily("onPressIn", handler);
    props.onPressOut = handlerFamily("onPressOut", handler);
  }

  if (focusFamily.has(state.key)) {
    props ??= {};
    props.onBlur = handlerFamily("onBlur", handler);
    props.onFocus = handlerFamily("onFocus", handler);
  }

  return props;
}
