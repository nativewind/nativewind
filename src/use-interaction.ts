import { useCallback, useState } from "react";
import { GestureResponderEvent, PressableProps } from "react-native";

declare module "react-native" {
  interface PressableProps {
    onHoverIn?: (event: MouseEvent) => void;
    onHoverOut?: (event: MouseEvent) => void;
  }
}

export interface Interaction extends PressableProps {
  active: boolean;
  hover: boolean;
  focus: boolean;
}

export function useInteraction({
  isComponent,
  disabled = false,
  focusable = true,
  onFocus,
  onBlur,
  onHoverIn,
  onHoverOut,
  onPressIn,
  onPressOut,
  onPress,
  className = "",
}: PressableProps & { className?: string; isComponent?: boolean } = {}) {
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

  const interaction: Interaction = {
    active,
    hover,
    focus,
  };

  if (isComponent) {
    Object.assign(interaction, {
      onBlur: handleBlur,
      onFocus: handleFocus,
      onHoverIn: handleHoverIn,
      onHoverOut: handleHoverOut,
      onPress: handlePress,
      onPressIn: handlePressIn,
      onPressOut: handlePressOut,
    });
  } else {
    if (className.includes("focus:")) {
      interaction.onBlur = handleBlur;
      interaction.onFocus = handleFocus;
    }

    if (className.includes("hover:")) {
      interaction.onHoverIn = handleHoverIn;
      interaction.onHoverOut = handleHoverOut;
    }
    if (className.includes("active:")) {
      interaction.onPress = handlePress;
      interaction.onPressIn = handlePressIn;
      interaction.onPressOut = handlePressOut;
    }
  }

  return interaction;
}
