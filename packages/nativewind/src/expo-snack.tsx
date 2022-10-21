import { ComponentType, useEffect, useState } from "react";
import { Platform } from "react-native";
import { Config } from "tailwindcss";
import { NativeWindStyleSheet } from "./style-sheet";

interface ExpoSnackConfig extends Config {
  compileUrl?: string;
}

export function withExpoSnack(
  Component: ComponentType,
  config?: ExpoSnackConfig,
  css?: string
) {
  return () => {
    const [loaded, setLoaded] = useState(Platform.OS !== "web");

    useEffect(() => {
      if (Platform.OS === "web") {
        if (document.querySelectorAll("#nativewind_cdn").length > 0) {
          setLoaded(true);
          return;
        }

        const head = document.querySelectorAll("head")[0];
        const playCDN = document.createElement("script");
        playCDN.id = "nativewind_cdn";
        playCDN.type = "text/javascript";
        playCDN.src = "https://cdn.tailwindcss.com";
        playCDN.addEventListener("load", () => setLoaded(true));
        head.append(playCDN);

        const configScript = document.createElement("script");
        configScript.id = "nativewind_config";
        configScript.type = "text/javascript";
        head.append(configScript);

        const cssStyle = document.createElement("style");
        cssStyle.id = "nativewind_css";
        cssStyle.type = "text/tailwindcss";
        head.append(cssStyle);
      }
    }, []);

    useEffect(() => {
      if (loaded && Platform.OS === "web" && config) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any).tailwind.config = config;
      }
    }, [loaded, config]);

    useEffect(() => {
      if (loaded && Platform.OS === "web" && css) {
        const cssStyle = document.querySelectorAll(
          "#nativewind_css"
        )[0] as HTMLStyleElement;
        cssStyle.replaceChildren(document.createTextNode(css));
      }
    }, [loaded, css]);

    useEffect(() => {
      if (Platform.OS !== "web") {
        NativeWindStyleSheet.__dangerouslyCompileStyles((className) => {
          return styleFetcher(className, config, css);
        });
      }
    }, []);

    return loaded ? <Component /> : undefined;
  };
}

const styleFetcher = debounce(
  (
    className: string,
    config: ExpoSnackConfig,
    css: string,
    callback: () => void
  ) => {
    const url = new URL(
      config.compileUrl ??
        "https://nativewind-demo-compiler.vercel.app/api/compile"
    );
    url.searchParams.set("className", className);
    if (css) url.searchParams.set("css", css);
    if (config) url.searchParams.set("config", JSON.stringify(config));

    fetch(url)
      .then((response) => response.json())
      .then((response) => {
        console.log(response);
        NativeWindStyleSheet.create(response);
        callback();
      })
      .catch((error) => {
        console.error(error);
      });
  }
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function debounce(callback: (...args: any[]) => void, timeout = 300) {
  let timer: NodeJS.Timeout;
  return (...args: unknown[]) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      callback(...args);
    }, timeout);
  };
}
