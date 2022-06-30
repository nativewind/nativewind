import { useContext, useMemo } from "react";
import { StyleProp } from "react-native";
import { useSyncExternalStoreWithSelector } from "use-sync-external-store/shim/with-selector";
import { Snapshot, StoreContext, StylesArray } from "../style-sheet";
import { StateBitOptions } from "../utils/selector";

export function useTailwind<T>(
  classNames: string,
  options: StateBitOptions = {},
  inlineStyles?: StyleProp<T>,
  additionalStyles: StylesArray<T> = []
): StylesArray<T> {
  const store = useContext(StoreContext);

  const [subscribe, getSnapshot, selector] = useMemo(() => {
    const selector = store.prepare(classNames, options);

    return [
      store.subscribe,
      store.getSnapshot,
      (snapshot: Snapshot) => snapshot[selector],
    ];
  }, [
    store,
    classNames,
    options.hover,
    options.focus,
    options.active,
    options.isolateGroupHover,
    options.isolateGroupFocus,
    options.isolateGroupActive,
  ]);

  const styles = useSyncExternalStoreWithSelector(
    subscribe,
    getSnapshot,
    undefined,
    selector
  );

  return useMemo(() => {
    const stylesArray: StylesArray = [
      ...styles,
      ...additionalStyles,
      inlineStyles,
    ].filter(Boolean);

    stylesArray.childClassNames = styles.childClassNames;

    return stylesArray;
  }, [styles, inlineStyles, additionalStyles]) as StylesArray<T>;
}
