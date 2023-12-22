const React = require("react");
require("react-native-css-interop/dist/runtime/components");
const { StyleSheet } = require("react-native-css-interop");
const {
  render,
} = require("react-native-css-interop/dist/runtime/components/rendering");
const { Platform } = require("react-native");

const originalCreateElement = React.createElement;
React.createElement = function (type, props, ...children) {
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
    (type, props) => {
      return Array.isArray(props.children)
        ? originalCreateElement(type, props, ...props.children)
        : originalCreateElement(type, props, props.children);
    },
    type,
    props,
  );
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
