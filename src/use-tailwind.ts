import { useContext, useMemo } from "react";
import { StyleProp } from "react-native";
import {
  SelectorOptions,
  StoreContext,
  StylesArray,
} from "./style-sheet-store";
import { useSyncExternalStoreWithSelector } from "use-sync-external-store/shim/with-selector";

export function useTailwind<T>(
  classNames: string,
  options: SelectorOptions = {},
  inlineStyles?: StyleProp<T>,
  additionalStyles: StylesArray<T> = []
): StylesArray<T> {
  const store = useContext(StoreContext);

  // useSyncExternalStore doesn't require but stable selector but
  // useSyncExternalStoreWithSelector does :(
  const selector = useMemo(
    () => store.createSelector(classNames, options),
    [
      store,
      classNames,
      options.hover,
      options.focus,
      options.active,
      options.componentHover,
      options.componentFocus,
      options.componentActive,
    ]
  );

  const styles = useSyncExternalStoreWithSelector(
    store.subscribe,
    store.getSnapshot,
    undefined,
    selector
  );

  return useMemo(() => {
    const stylesArray: StylesArray = [
      ...styles,
      ...additionalStyles,
      inlineStyles,
    ].filter(Boolean);

    stylesArray.childStyles = styles.childStyles;

    return stylesArray;
  }, [styles, inlineStyles, additionalStyles]) as StylesArray<T>;
}
