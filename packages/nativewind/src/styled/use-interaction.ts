import { Dispatch, useMemo, useRef } from "react";
import {
  GestureResponderEvent,
  NativeSyntheticEvent,
  Platform,
  PressableProps,
  TargetedEvent,
} from "react-native";
import {
  ACTIVE,
  FOCUS,
  GROUP,
  HOVER,
  matchesMask,
  PARENT,
} from "../utils/selector";
import { Action } from "./use-component-state";

declare module "react-native" {
  interface PressableProps {
    onHoverIn?: (event: MouseEvent) => void;
    onHoverOut?: (event: MouseEvent) => void;
  }
}

export interface InteractionProps extends PressableProps {
  onMouseDown?: PressableProps["onPressIn"];
  onMouseUp?: PressableProps["onPressOut"];
}

export function useInteraction(
  dispatch: Dispatch<Action>,
  mask: number,
  props: InteractionProps
) {
  const ref = useRef<InteractionProps>(props);
  ref.current = props;

  const handlers = useMemo(() => {
    const isParentOrGroup =
      matchesMask(mask, PARENT) || matchesMask(mask, GROUP);

    const handlers: InteractionProps = {};

    if (isParentOrGroup || matchesMask(mask, ACTIVE)) {
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

    if (isParentOrGroup || matchesMask(mask, HOVER)) {
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

    if (isParentOrGroup || matchesMask(mask, FOCUS)) {
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
  }, [mask]);

  return handlers;
}
