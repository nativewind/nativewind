import { useCallback, useState } from "react";
import { GestureResponderEvent, PressableProps } from "react-native";

declare module "react-native" {
  interface PressableProps {
    onHoverIn?: (event: MouseEvent) => void;
    onHoverOut?: (event: MouseEvent) => void;
  }
}

export function useInteraction({
  disabled = false,
  focusable = true,
  onFocus,
  onBlur,
  onHoverIn,
  onHoverOut,
  onPressIn,
  onPressOut,
  onPress,
}: PressableProps = {}) {
  const [hover, setHover] = useState(false);
  const [focus, setFocus] = useState(false);
  const [active, setActive] = useState(false);

  const handleFocus = useCallback<NonNullable<PressableProps["onFocus"]>>(
    (event) => {
      if (disabled) {
        return;
      }

      if (focusable) {
        if (onFocus) {
          onFocus(event);
        }

        setFocus(true);
      }
    },
    [disabled, focusable, onFocus, setFocus]
  );

  const handleBlur = useCallback<NonNullable<PressableProps["onFocus"]>>(
    (event) => {
      if (disabled) {
        return;
      }

      if (onBlur) {
        onBlur(event);
      }

      setFocus(false);
    },
    [disabled, onBlur, setFocus]
  );

  const handleHoverIn = useCallback(
    (event: MouseEvent) => {
      if (disabled) {
        return;
      }
      if (onHoverIn) {
        onHoverIn(event);
      }

      setHover(true);
    },
    [disabled, onHoverIn, setHover]
  );

  const handleHoverOut = useCallback(
    (event: MouseEvent) => {
      if (disabled) {
        return;
      }

      if (onHoverOut) {
        onHoverOut(event);
      }

      setHover(false);
    },
    [disabled, onHoverOut, setHover]
  );

  const handlePressIn = useCallback(
    (event: GestureResponderEvent) => {
      if (disabled) {
        return;
      }

      if (onPressIn) {
        onPressIn(event);
      }

      setActive(true);
      setFocus(false);
    },
    [disabled, onPressIn, setActive]
  );

  const handlePressOut = useCallback(
    (event: GestureResponderEvent) => {
      if (disabled) {
        return;
      }

      if (onPressOut) {
        onPressOut(event);
      }

      setActive(false);
    },
    [disabled, onPressOut, setActive]
  );

  const handlePress = useCallback(
    (event: GestureResponderEvent) => {
      if (disabled) {
        return;
      }

      if (onPress) {
        onPress(event);
      }
    },
    [disabled, onPress, setActive]
  );

  return {
    active,
    hover,
    focus,
    onBlur: handleBlur,
    onFocus: handleFocus,
    onHoverIn: handleHoverIn,
    onHoverOut: handleHoverOut,
    onPress: handlePress,
    onPressIn: handlePressIn,
    onPressOut: handlePressOut,
  };
}
