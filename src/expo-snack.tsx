import React, { ComponentType, useCallback } from "react";
import { TailwindProvider } from "./provider";
import { StyleSheetStore } from "./style-sheet-store";

const fetched: Record<string, boolean> = {};

function HOC({ component: Component }: { component: ComponentType }) {
  const dangerouslyCompileStyles = useCallback(
    (css: string, store: StyleSheetStore) => {
      if (fetched[css]) return;
      fetch(
        `https://nativewind-demo-compiler.vercel.app/api/compile?css=${css}`
      )
        .then((response) => response.json())
        .then(({ body: { styles, atRules, topics, masks, childClasses } }) => {
          fetched[css] = true;
          Object.assign(store.styles, styles);
          Object.assign(store.atRules, atRules);
          Object.assign(store.topics, topics);
          Object.assign(store.masks, masks);
          Object.assign(store.childClasses, childClasses);

          // This the async, the store will have already cached
          // incorrect results, so we need to clear these
          // and set the correct ones
          for (const className of css.split(/\s+/)) {
            delete store.snapshot[className];
          }

          for (const key of Object.keys(store.snapshot)) {
            if (key.includes(css)) {
              delete store.snapshot[key];
              const [, bit] = key.split(".");
              store.prepare(css, { baseBit: Number.parseInt(bit) });
            }
          }
          store.notify();
        })
        .catch((error) => {
          console.error(error);
        });
    },
    []
  );

  return (
    <TailwindProvider dangerouslyCompileStyles={dangerouslyCompileStyles}>
      <Component />
    </TailwindProvider>
  );
}

export function withExpoSnack(component: ComponentType) {
  return () => <HOC component={component} />;
}
