import { ComponentType, useEffect, useReducer } from "react";
import { Platform } from "react-native";

export function withExpoSnack(Component: ComponentType) {
  return () => {
    const [, forceUpdate] = useReducer((x) => x + 1, 0);

    useEffect(() => {
      if (Platform.OS === "web") {
        const head = document.querySelectorAll("head")[0];
        const script = document.createElement("script");
        script.type = "text/javascript";
        script.src = "https://cdn.tailwindcss.com";
        script.addEventListener("load", forceUpdate);
        head.append(script);
      }
    }, []);
    return <Component />;
  };
}
