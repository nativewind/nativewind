import React, { ComponentType, PropsWithChildren, useEffect } from "react";
import { Platform, StyleSheet } from "react-native";
import { Config } from "tailwindcss";
import { NativeWindStyleSheet, StyleSheetRuntime } from "./style-sheet";

const fetched: Record<string, boolean> = {};

function ExpoSnackWrapper({ children }: PropsWithChildren<unknown>) {
  useEffect(() => {
    if (
      Platform.OS === "web" &&
      typeof StyleSheet.create({ test: {} }).test !== "number" &&
      !document.querySelector("#tailwind-cdn")
    ) {
      const script = document.createElement("script");
      script.id = "tailwind-cdn";
      script.type = "text/javascript";
      script.src = "https://cdn.tailwindcss.com";
      document.querySelectorAll("head")[0].append(script);
    }
  }, []);

  return <>{children}</>;
}

export function withExpoSnack(
  Component: ComponentType,
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

  NativeWindStyleSheet.setDangerouslyCompileStyles(dangerouslyCompileStyles);

  return () => (
    <ExpoSnackWrapper>
      <Component />
    </ExpoSnackWrapper>
  );
}
