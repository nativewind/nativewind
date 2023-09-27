const snackJS = `import { createElement, useState, useEffect } from "react";
import { StyleSheet, unstable_styled } from "react-native-css-interop"
import {
  Platform,
  Text as RNText,
  View as RNView,
  Pressable as RNPressable,
} from "react-native";

/*
These examples are for demonstrative purposes only. They have known bugs/issues 
and are not representative of NativeWind.

Expo Snack does not allow the Tailwind compiler to run, hence these examples use
an external server to compile the styles.

Please do not use these APIs in your own projects.
*/
var tailwindScriptLoaded = false;
const alreadyProcessed = new Set();
if (Platform.OS === "web") {
  var tailwindScript = document.createElement('script');
  tailwindScript.addEventListener('load', () => { tailwindScriptLoaded = true });
  tailwindScript.setAttribute('src','https://cdn.tailwindcss.com');
  document.body.appendChild(tailwindScript);
} else {
  StyleSheet.unstable_hook_onClassName = (content) => {
    content = content
      .split(" ")
      .filter((c) => !alreadyProcessed.has(c))
      .join(" ");

    if (!content) return;

    fetch("https://${process.env.VERCEL_URL}/api/compile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content }),
    })
      .then((response) => response.json())
      .then((body) => {
        content.split(" ").forEach((c) => alreadyProcessed.add(c));
        StyleSheet.register(body);
      })
      .catch((error) => {
        console.error("Error connecting to NativeWind snack server");
      });
  }
}

const render = (element, { children, ...props }, key) => {
  children = Array.isArray(children) ? children : [children];
  return createElement(element, { key, ...props }, ...children)
}
export const View = unstable_styled(RNView, render, { className: "style" });
export const Text = unstable_styled(RNText, render, { className: "style" });
export const Pressable = unstable_styled(RNPressable, render, { className: "style" });

export function withExpoSnack(Component) {
  return function WithExpoSnack() {
    const [, rerender] = useState(false);
    useEffect(() => {
      return tailwindScript?.addEventListener("load", () => rerender(true));
    }, []);

    return Platform.OS === "web" ? (
      tailwindScriptLoaded ? (
        <Component />
      ) : (
        <></>
      )
    ) : (
      <Component />
    );
  };
}`;

const parseParams = (paramString = "") => {
  const params = Object.fromEntries(new URLSearchParams(paramString));

  if (!params.platform) {
    params.platform = "web";
  }

  return params;
};

function attr(name, value) {
  return {
    type: "mdxJsxAttribute",
    name,
    value,
  };
}

async function toJsxNode(node) {
  const params = parseParams(node.meta);

  // Gather necessary Params
  const name = params.name ? decodeURIComponent(params.name) : "Example";
  const description = params.description
    ? decodeURIComponent(params.description)
    : "Example usage";
  const ext = params.ext ? decodeURIComponent(params.ext) : "js";

  if (!node.value.startsWith("import")) {
    node.value = `\n${node.value}`;
  }

  const appCode = `import { View, Text, withExpoSnack } from "./expo-snack"
${node.value}

/*
This Snack is for demonstrative purposes only and contains code to allow NativeWind to work in this limited environment.
Please ignore:
 - any warnings about peerDependencies.
 - any flashes of unstyled content.
 - performance issues due to external compilation.
 - the use of withExpoSnack() and internal/unstable APIs
You should import View/Text/etc directly from 'react-native'
Please see the documentation for proper setup application.
*/
export default withExpoSnack(App);`;

  const files = encodeURIComponent(
    JSON.stringify({
      [`App.${ext}`]: {
        type: "CODE",
        contents: appCode,
      },
      "expo-snack.js": {
        type: "CODE",
        contents: snackJS,
      },
    }),
  );
  const platform = params.platform || "web";
  const supportedPlatforms = params.supportedPlatforms || "ios,android,web";
  const theme = params.theme || "light";
  const preview = params.preview || "true";
  const loading = params.loading || "lazy";
  const deviceAndroid = params.deviceAndroid || "pixel4";
  const deviceIos = params.deviceIos || "iphone12";
  const dependencies =
    params.dependencies ||
    "react,react-native,react-native-reanimated,nativewind@4.0.0-alpha.7";

  // Need help constructing this AST node?
  // Use the MDX Playground and explore what your output mdast should look like
  // https://mdxjs.com/playground/
  const jsxNode = {
    type: "mdxJsxTextElement",
    name: "div",
    attributes: [
      attr("className", "snack-player"),
      attr("data-snack-sdkversion", "49.0.0"),
      attr("data-snack-name", name),
      attr("data-snack-description", description),
      attr("data-snack-files", files),
      attr("data-snack-dependencies", dependencies),
      attr("data-snack-platform", platform),
      attr("data-snack-supported-platforms", supportedPlatforms),
      attr("data-snack-theme", theme),
      attr("data-snack-preview", preview),
      attr("data-snack-loading", loading),
      attr("data-snack-device-android", deviceAndroid),
      attr("data-snack-device-ios", deviceIos),
    ],
    children: [],
  };

  // We "replace" the current node by a JSX node
  Object.keys(node).forEach((key) => delete node[key]);
  Object.keys(jsxNode).forEach((key) => (node[key] = jsxNode[key]));
}

module.exports = toJsxNode;
