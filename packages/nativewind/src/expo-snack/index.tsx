import { ComponentType } from "react";
import { Platform } from "react-native";
import { StyleSheet } from "react-native-css-interop";
import { Config } from "tailwindcss";

declare global {
  var window: Record<string, any>;
}

export function withExpoSnack(
  Component: ComponentType,
  theme: Config["theme"] = {},
) {
  const themeString = JSON.stringify(theme);

  const fetched = new Set<string>();

  StyleSheet.dangerouslyCompileStyles = (css: string) => {
    const classNames = css.split(/\s+/g).filter((className) => {
      if (!className) return false;
      return fetched.has(className);
    });

    if (classNames.length === 0) return;

    fetch(
      `${
        globalThis.window.location.origin
      }/api/compile?classNames=${classNames.join(" ")}&theme=${themeString}`,
    )
      .then((response) => response.json())
      .then(({ body }) => {
        for (const name of classNames) {
          fetched.add(name);
        }

        StyleSheet.register(body);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return Platform.OS === "web" ? (
    <>
      <script
        id="tailwind-cdn"
        type="text/javascript"
        src="https://cdn.tailwindcss.com"
      />
      <Component />
    </>
  ) : (
    <Component />
  );
}
