import "react-native-css-interop/dist/runtime/components";
import React from "react";
import { StyleSheet } from "react-native-css-interop";
import { render } from "react-native-css-interop/dist/runtime/components/rendering";
import { Platform } from "react-native";

const originalCreateElement = React.createElement;
React.createElement = function (type: any, props: any, ...children: any) {
  if (!props || type === React.Fragment || props.__preventSnackRenderLoop) {
    if (props) {
      delete props.__preventSnackRenderLoop;
    }
    return originalCreateElement(type, props, ...children);
  }

  props.__preventSnackRenderLoop = true;
  if (children.length) {
    props.children = children.length <= 1 ? children[0] : children;
  }

  return render(
    (type: any, props: any) => {
      return Array.isArray(props.children)
        ? originalCreateElement(type, props, ...props.children)
        : originalCreateElement(type, props, props.children);
    },
    type,
    props,
  );
};

const isOk = (response: any) => {
  return response.ok ? response.json() : Promise.reject(response);
};

const alreadyProcessed = new Set();
let fetchUrl = "https://nativewind.dev/api/compile";

function fetchStyle(className: string) {
  className = className
    .split(" ")
    .filter((c) => !alreadyProcessed.has(c))
    .join(" ");
  if (!className) return;
  fetch(fetchUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: `{"content":"${className}"}`,
  })
    .then(isOk)
    .then((body) => {
      className.split(" ").forEach((c) => alreadyProcessed.add(c));
      StyleSheet.registerCompiled(body);
    })
    .catch(() => {
      console.error("Error connecting to NativeWind snack server");
    });
}

StyleSheet.unstable_hook_onClassName?.(fetchStyle);

var tailwindScript: any;
if (Platform.OS === "web") {
  // @ts-ignore
  tailwindScript = document.createElement("script");
  tailwindScript.setAttribute("src", "https://cdn.tailwindcss.com");
  // @ts-ignore
  document.body.appendChild(tailwindScript);
}

export function withExpoSnack(
  Component: any,
  apiUrl = "https://nativewind.dev/api/compile",
) {
  fetchUrl = apiUrl;
  return function WithExpoSnackLoader() {
    const [loaded, setLoaded] = React.useState(
      Platform.OS === "web" ? false : true,
    );

    React.useEffect(() => {
      return tailwindScript?.addEventListener("load", () => setLoaded(true));
    }, []);

    return loaded
      ? originalCreateElement(Component)
      : originalCreateElement(React.Fragment);
  };
}
