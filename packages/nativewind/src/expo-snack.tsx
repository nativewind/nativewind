import { ComponentType, useEffect, useState } from "react";
import { Platform } from "react-native";
import { Config } from "tailwindcss";

export function withExpoSnack(
  Component: ComponentType,
  config?: Config,
  css?: string
) {
  return () => {
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
      if (Platform.OS === "web") {
        const head = document.querySelectorAll("head")[0];
        const playCDN = document.createElement("script");
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
        const configScript = document.querySelectorAll(
          "#nativewind_config"
        )[0] as HTMLScriptElement;
        configScript.text = `tailwind.config = ${JSON.stringify(config)}`;
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

    return loaded ? <Component /> : undefined;
  };
}
