import { Dispatch, useMemo, useRef } from "react";
import {
  GestureResponderEvent,
  NativeSyntheticEvent,
  PressableProps,
  TargetedEvent,
  MouseEvent,
} from "react-native";
import type { ComponentStateAction } from ".";

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
  dispatch: Dispatch<ComponentStateAction>,
  meta: Record<string, boolean | string>,
  props: InteractionProps
) {
  const ref = useRef<InteractionProps>(props);
  ref.current = props;

  const isGroup = meta?.group;
  const active = isGroup || meta?.active;
  const focus = isGroup || meta?.focus;
  const hover = isGroup || meta?.hover;

  return useMemo(() => {
    const handlers: InteractionProps = {};

    if (active) {
      handlers.onPressIn = (event: GestureResponderEvent) => {
        if (ref.current.onPressIn) {
          ref.current.onPressIn(event);
        }
        dispatch({ type: "active", value: true });
      };

      handlers.onPressOut = (event: GestureResponderEvent) => {
        if (ref.current.onPressOut) {
          ref.current.onPressOut(event);
        }
        dispatch({ type: "active", value: false });
      };
    }

    if (hover) {
      handlers.onHoverIn = (event: MouseEvent) => {
        if (ref.current.onHoverIn) {
          ref.current.onHoverIn(event);
        }
        dispatch({ type: "hover", value: true });
      };

      handlers.onHoverOut = (event: MouseEvent) => {
        if (ref.current.onHoverIn) {
          ref.current.onHoverIn(event);
        }
        dispatch({ type: "hover", value: false });
      };
    }

    if (focus) {
      handlers.onFocus = (event: NativeSyntheticEvent<TargetedEvent>) => {
        if (ref.current.onFocus) {
          ref.current.onFocus(event);
        }
        dispatch({ type: "focus", value: true });
      };

      handlers.onBlur = (event: NativeSyntheticEvent<TargetedEvent>) => {
        if (ref.current.onBlur) {
          ref.current.onBlur(event);
        }
        dispatch({ type: "focus", value: false });
      };
    }

    return handlers;
  }, [active, hover, focus]);
}
