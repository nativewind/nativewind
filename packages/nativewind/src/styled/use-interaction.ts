import { Dispatch, useMemo, useRef } from "react";
import {
  GestureResponderEvent,
  NativeSyntheticEvent,
  Platform,
  PressableProps,
  TargetedEvent,
  MouseEvent,
} from "react-native";
import { Action } from "./use-component-state";

declare module "react-native" {
  interface PressableProps {
    onHoverIn?: ((event: MouseEvent) => void) | null;
    onHoverOut?: ((event: MouseEvent) => void) | null;
  }
}

export interface InteractionProps extends PressableProps {
  onMouseDown?: PressableProps["onPressIn"];
  onMouseUp?: PressableProps["onPressOut"];
}

export function useInteraction(
  dispatch: Dispatch<Action>,
  meta: Record<string, boolean>,
  props: InteractionProps
) {
  const ref = useRef<InteractionProps>(props);
  ref.current = props;

  return useMemo(() => {
    const isParentOrGroup = meta.parent || meta.group;

    const handlers: InteractionProps = {};

    if (isParentOrGroup || meta.active) {
      if (Platform.OS === "web") {
        handlers.onMouseDown = function (event: GestureResponderEvent) {
          if (ref.current.onMouseDown) {
            ref.current.onMouseDown(event);
          }
          dispatch({ type: "active", value: true });
        };

        handlers.onMouseUp = function (event: GestureResponderEvent) {
          if (ref.current.onMouseUp) {
            ref.current.onMouseUp(event);
          }
          dispatch({ type: "active", value: false });
        };
      } else {
        handlers.onPressIn = function (event: GestureResponderEvent) {
          if (ref.current.onPressIn) {
            ref.current.onPressIn(event);
          }
          dispatch({ type: "active", value: true });
        };

        handlers.onPressOut = function (event: GestureResponderEvent) {
          if (ref.current.onPressOut) {
            ref.current.onPressOut(event);
          }
          dispatch({ type: "active", value: false });
        };
      }
    }

    if (isParentOrGroup || meta.hover) {
      handlers.onHoverIn = function (event: MouseEvent) {
        if (ref.current.onHoverIn) {
          ref.current.onHoverIn(event);
        }
        dispatch({ type: "hover", value: true });
      };

      handlers.onHoverOut = function (event: MouseEvent) {
        if (ref.current.onHoverIn) {
          ref.current.onHoverIn(event);
        }
        dispatch({ type: "hover", value: true });
      };
    }

    if (isParentOrGroup || meta.focus) {
      handlers.onFocus = function (event: NativeSyntheticEvent<TargetedEvent>) {
        if (ref.current.onFocus) {
          ref.current.onFocus(event);
        }
        dispatch({ type: "focus", value: true });
      };

      handlers.onBlur = function (event: NativeSyntheticEvent<TargetedEvent>) {
        if (ref.current.onBlur) {
          ref.current.onBlur(event);
        }
        dispatch({ type: "focus", value: false });
      };
    }

    return handlers;
  }, [meta]);
}
