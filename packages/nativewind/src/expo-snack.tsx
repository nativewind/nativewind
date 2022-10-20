import { ComponentType, useEffect, useState } from "react";
import { Platform } from "react-native";

export function withExpoSnack(Component: ComponentType) {
  return () => {
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
      if (Platform.OS === "web") {
        const head = document.querySelectorAll("head")[0];
        const script = document.createElement("script");
        script.type = "text/javascript";
        script.src = "https://cdn.tailwindcss.com";
        script.addEventListener("load", () => setLoaded(true));
        head.append(script);
      }
    }, []);
    return loaded ? <Component /> : undefined;
  };
}
