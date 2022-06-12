import { useContext, useSyncExternalStore } from "react";
import { StoreContext } from "./style-sheet-store";

export function useColorScheme() {
  const store = useContext(StoreContext);

  const colorScheme = useSyncExternalStore(
    store.subscribeColorScheme,
    store.getColorScheme
  );

  return {
    colorScheme,
    setColorScheme: store.setColorScheme,
    toggleColorScheme: store.toggleColorScheme,
  };
}
