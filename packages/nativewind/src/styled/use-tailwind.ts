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
  groupHover,
  groupFocus,
  groupActive,
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
      groupHover,
      groupFocus,
      groupActive,
    });

    return [
      store.subscribe,
      store.getSnapshot,
      (snapshot: Snapshot): StylesArray | undefined => snapshot[selector],
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
    groupHover,
    groupFocus,
    groupActive,
  ]);

  const styles = useSyncExternalStoreWithSelector(
    subscribe,
    getSnapshot,
    getSnapshot,
    selector
  );

  return useMemo(() => {
    const stylesArray: StylesArray = [];

    if (styles) {
      stylesArray.push(...styles);
      stylesArray.childClassNames = styles.childClassNames;
    }

    if (additionalStyles) {
      stylesArray.push(...additionalStyles);
    }
    if (inlineStyles) {
      stylesArray.push(inlineStyles);
    }

    if (flatten) {
      const flatStyles: StylesArray = [StyleSheet.flatten(stylesArray)];
      flatStyles.mask = styles?.mask;
      return flatStyles;
    }

    stylesArray.mask = styles?.mask;
    return stylesArray;
  }, [styles, inlineStyles, additionalStyles, flatten]) as StylesArray<T>;
}
