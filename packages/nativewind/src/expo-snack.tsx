import { ComponentType, PropsWithChildren } from "react";
import { Platform } from "react-native";
import { Config } from "tailwindcss";
import { NativeWindStyleSheet } from "./style-sheet";

const canUseCSS = false; //typeof StyleSheet.create({ test: {} }).test !== "number"

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

function dangerouslyCompileStyles(theme: Config["theme"]) {
  return (css: string) => {
    const themeString = JSON.stringify(theme);
    css = css.replace(/\s+/g, " ").trim();

    if (!css) return;

    fetch(
      `https://nativewind-demo-compiler.vercel.app/api/compile?css=${css}&theme=${themeString}`
    )
      .then((response) => response.json())
      .then(({ body }) => {
        NativeWindStyleSheet.create(body);
      })
      .catch((error) => {
        console.error(error);
      });
  };
}

export function withExpoSnack(
  Component: ComponentType,
  theme: Config["theme"] = {}
) {
  if (!canUseCSS) {
    // NativeWindStyleSheet.setDangerouslyCompileStyles(
    //   dangerouslyCompileStyles(theme)
    // );
    // NativeWindStyleSheet.setOutput({
    //   default: "native",
    // });
  }

  return () => (
    <ExpoSnackWrapper>
      <Component />
    </ExpoSnackWrapper>
  );
}
