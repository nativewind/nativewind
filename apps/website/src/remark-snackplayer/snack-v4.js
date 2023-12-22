const { version } = require("../../../../packages/nativewind/package.json");

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

  const appCodeUrl =
    process.env.VERCEL_URL !== "nativewind.dev"
      ? `, 'https://${process.env.VERCEL_URL}/api/snack'`
      : "";

  const appCode = `import { withExpoSnack } from "nativewind";
import { View, Text } from "react-native"
${node.value}

/*
This Snack is for demonstrative purposes only and contains code to allow NativeWind to work in this limited environment.
Please ignore:
 - any warnings about peerDependencies.
 - any flashes of unstyled content.
 - performance issues due to external compilation.
 - the use of withExpoSnack
You should import View/Text/etc directly from 'react-native'
Please see the documentation for proper setup application.
*/
export default withExpoSnack(App${appCodeUrl});`;

  const files = encodeURIComponent(
    JSON.stringify({
      [`App.${ext}`]: {
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
    params.dependencies ||
    `react,react-native,react-native-reanimated@~3.3.0,nativewind@${version}`;

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
