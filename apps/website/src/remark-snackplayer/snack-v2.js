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
  const ext = params.ext ? decodeURIComponent(params.ext) : "tsx";

  const appCode = `import React from 'react';
import { withExpoSnack } from 'nativewind';

${node.value}

// This demo is using a external compiler that will only work in Expo Snacks.
// You may see flashes of unstyled content, this will not occur under normal use!
// Please see the documentation to setup your application
export default withExpoSnack(App);`;

  const files = encodeURIComponent(
    JSON.stringify({
      "App.tsx": {
        type: "CODE",
        contents: appCode,
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
    params.dependencies || "react,react-native,nativewind@2.0.11";

  // Need help constructing this AST node?
  // Use the MDX Playground and explore what your output mdast should look like
  // https://mdxjs.com/playground/
  const jsxNode = {
    type: "mdxJsxTextElement",
    name: "div",
    attributes: [
      attr("class", "snack-player"),
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
