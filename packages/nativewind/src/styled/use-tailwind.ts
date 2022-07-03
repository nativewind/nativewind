import { useContext, useMemo } from "react";
import { StyleProp, StyleSheet } from "react-native";
import { useSyncExternalStoreWithSelector } from "use-sync-external-store/shim/with-selector";
import { Snapshot, StoreContext, StylesArray } from "../style-sheet";
import { StateBitOptions } from "../utils/selector";

export interface UseTailwindOptions<T> extends StateBitOptions {
  className: string;
  inlineStyles?: StyleProp<T>;
  additionalStyles?: StylesArray<T>;
  flatten?: boolean;
}

export function useTailwind<T>({
  className,
  inlineStyles,
  additionalStyles,
  hover,
  focus,
  active,
  isolateGroupHover,
  isolateGroupFocus,
  isolateGroupActive,
  flatten,
}: UseTailwindOptions<T>): StylesArray<T> {
  const store = useContext(StoreContext);

  const [subscribe, getSnapshot, selector] = useMemo(() => {
    const selector = store.prepare(className, {
      hover,
      focus,
      active,
      isolateGroupHover,
      isolateGroupFocus,
      isolateGroupActive,
    });

    return [
      store.subscribe,
      store.getSnapshot,
      (snapshot: Snapshot) => snapshot[selector],
    ];
  }, [
    store,
    className,
    hover,
    focus,
    active,
    isolateGroupHover,
    isolateGroupFocus,
    isolateGroupActive,
  ]);

  const styles = useSyncExternalStoreWithSelector(
    subscribe,
    getSnapshot,
    undefined,
    selector
  );

  return useMemo(() => {
    const stylesArray: StylesArray = [...styles];

    if (additionalStyles) {
      stylesArray.push(...additionalStyles);
    }
    if (inlineStyles) {
      stylesArray.push(inlineStyles);
    }

    stylesArray.childClassNames = styles.childClassNames;

    if (flatten) {
      return StyleSheet.flatten(stylesArray);
    }

    return stylesArray;
  }, [styles, inlineStyles, additionalStyles, flatten]) as StylesArray<T>;
}
