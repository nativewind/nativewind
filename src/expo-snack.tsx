import React, { ComponentType } from "react";
import { Config } from "tailwindcss";
import { runtime, StyleSheetRuntime } from "./style-sheet";

const fetched: Record<string, boolean> = {};

export function withExpoSnack(
  component: ComponentType,
  theme: Config["theme"]
) {
  function dangerouslyCompileStyles(css: string, store: StyleSheetRuntime) {
    const themeString = JSON.stringify(theme);
    const cacheKey = `${css}${themeString}`;

    if (fetched[cacheKey]) return;
    fetch(
      `https://nativewind-demo-compiler.vercel.app/api/compile?css=${css}&theme=${themeString}`
    )
      .then((response) => response.json())
      .then(({ body }) => {
        fetched[cacheKey] = true;
        store.create(body);

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
  }

  runtime.setDangerouslyCompileStyles(dangerouslyCompileStyles);

  return <>{component}</>;
}
