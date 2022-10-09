import { useRef } from "react";
import { useSyncExternalStoreWithSelector } from "use-sync-external-store/with-selector";

import { NativeWindStyleSheet } from "./style-sheet";
import context from "./style-sheet/context";
import { resolve } from "./style-sheet/resolve";

export function useVariable(
  variable: `--${string}`
): [ReturnType<typeof resolve>, (value: string | number) => void] {
  const setVariable = useRef((value: string | number) =>
    NativeWindStyleSheet.setVariables({ [variable]: value })
  );

  const value = useSyncExternalStoreWithSelector(
    context.subscribeToTopics,
    () => context.topics,
    () => context.topics,
    (topics) => topics[variable]
  );

  return [resolve(value), setVariable.current];
}
