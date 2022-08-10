import React, { ComponentType, PropsWithChildren } from "react";
import { Platform } from "react-native";
import { Config } from "tailwindcss";
import { NativeWindStyleSheet, StyleSheetRuntime } from "./style-sheet";

const fetched: Record<string, boolean> = {};
const canUseCSS = false;
// const canUseCSS = typeof StyleSheet.create({ test: {} }).test !== "number";

function ExpoSnackWrapper({ children }: PropsWithChildren<unknown>) {
  return Platform.OS === "web" && canUseCSS ? (
    <>
      <script
        id="tailwind-cdn"
        type="text/javascript"
        src="https://cdn.tailwindcss.com"
      />
      {children}
    </>
  ) : (
    <>{children}</>
  );
}

export function withExpoSnack(
  Component: ComponentType,
  theme: Config["theme"] = {}
) {
  function dangerouslyCompileStyles(css: string, store: StyleSheetRuntime) {
    const themeString = JSON.stringify(theme);
    css = css.replace(/\s+/g, " ").trim();
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

  if (!canUseCSS) {
    NativeWindStyleSheet.setDangerouslyCompileStyles(dangerouslyCompileStyles);
    NativeWindStyleSheet.setOutput({
      default: "native",
    });
  }

  return () => (
    <ExpoSnackWrapper>
      <Component />
    </ExpoSnackWrapper>
  );
}
