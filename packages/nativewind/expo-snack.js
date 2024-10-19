import { useState, useEffect, Fragment, createElement } from "react";
import RN, { Platform } from "react-native";
const { StyleSheet, cssInterop } = require("react-native-css-interop");
const jsx = require("@nativewind/jsx-runtime");
const originalJSX = require("react/jsx-runtime");

Object.assign(originalJSX, jsx);

export const View = cssInterop(RN.View, { className: "style" });
export const Text = cssInterop(RN.Text, { className: "style" });

const isOk = (response) => {
  return response.ok ? response.json() : Promise.reject(response);
};

const alreadyProcessed = new Set();
let fetchUrl = "https://nativewind.dev/api/compile";

function fetchStyle(className) {
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

StyleSheet.unstable_hook_onClassName(fetchStyle);

var tailwindScript;
let tailwindScriptLoaded = Platform.OS === "web" ? !!window.tailwind : true;
if (!tailwindScriptLoaded) {
  tailwindScript = document.createElement("script");
  tailwindScript.addEventListener("load", () => {
    tailwindScriptLoaded = true;
  });
  tailwindScript.id = "tailwindscript";
  tailwindScript.setAttribute("src", "https://cdn.tailwindcss.com");
  document.body.appendChild(tailwindScript);
}

export function withExpoSnack(
  Component,
  apiUrl = "https://nativewind.dev/api/compile",
) {
  fetchUrl = apiUrl;
  return function WithExpoSnackLoader() {
    const [loaded, setLoaded] = useState(tailwindScriptLoaded);
    useEffect(() => {
      return tailwindScript?.addEventListener("load", () => setLoaded(true));
    }, []);

    return tailwindScriptLoaded
      ? createElement(Component)
      : createElement(Fragment);
  };
}
