const React = require("react");
const { Platform } = require("react-native");

const { StyleSheet } = require("react-native-css-interop");
const {
  createInteropElement,
} = require("react-native-css-interop/jsx-runtime");

const originalCreateElement = React.createElement;

React.createElement = function (type, props, ...children) {
  if (!props || type === React.Fragment) {
    return originalCreateElement(type, props, ...children);
  }

  if (props.cssInterop === "snack") {
    delete props.cssInterop;
    return originalCreateElement(type, props, ...children);
  }

  props.cssInterop = "snack";
  return createInteropElement(type, props, ...children);
};

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
      content.split(" ").forEach((c) => alreadyProcessed.add(c));
      StyleSheet.registerCompiled(body);
    })
    .catch(() => {
      console.error("Error connecting to NativeWind snack server");
    });
}

StyleSheet.unstable_hook_onClassName(fetchStyle);

var tailwindScript;
if (Platform.OS === "web") {
  tailwindScript = document.createElement("script");
  tailwindScript.addEventListener("load", () => {
    tailwindScriptLoaded = true;
  });
  tailwindScript.setAttribute("src", "https://cdn.tailwindcss.com");
  document.body.appendChild(tailwindScript);
}

function withNativeWind(
  Component,
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

module.exports = { withNativeWind };
