const visit = require("unist-util-visit-parents");
const u = require("unist-builder");
const dedent = require("dedent");

const parseParams = (paramString = "") => {
  const params = Object.fromEntries(new URLSearchParams(paramString));

  if (!params.platform) {
    params.platform = "web";
  }

  return params;
};

const processNodeV2 = (node, parent) => {
  return new Promise(async (resolve, reject) => {
    try {
      const params = parseParams(node.meta);

      // Gather necessary Params
      const name = params.name ? decodeURIComponent(params.name) : "Example";
      const description = params.description
        ? decodeURIComponent(params.description)
        : "Example usage";
      const sampleCode = node.value;
      const code = `import React from 'react';
import { withExpoSnack } from 'nativewind';

${sampleCode}

// This demo is using a external compiler that will only work in Expo Snacks.
// You may see flashes of unstyled content, this will not occur under normal use!
// Please see the documentation to setup your application
export default withExpoSnack(App);
`;

      const platform = params.platform || "web";
      const supportedPlatforms = params.supportedPlatforms || "ios,android,web";
      const theme = params.theme || "light";
      const preview = params.preview || "true";
      const loading = params.loading || "lazy";
      const dependencies =
        params.dependencies || "react,react-native,nativewind@2.0.11";

      // Generate Node for SnackPlayer
      // See https://github.com/expo/snack/blob/main/docs/embedding-snacks.md
      const snackPlayerDiv = u("html", {
        value: dedent`
          <div
            class="snack-player"
            data-snack-name="${name}"
            data-snack-description="${description}"
            data-snack-dependencies="${dependencies}"
            data-snack-platform="${platform}"
            data-snack-supported-platforms="${supportedPlatforms}"
            data-snack-theme="${theme}"
            data-snack-preview="${preview}"
            data-snack-loading="${loading}"
            data-snack-sdkversion="45.0.0"
            data-snack-code="${encodeURIComponent(code)}"
          ></div>
          `,
      });

      // Replace code block with SnackPlayer Node
      const index = parent[0].children.indexOf(node);
      parent[0].children.splice(index, 1, snackPlayerDiv);
    } catch (e) {
      return reject(e);
    }
    resolve();
  });
};

module.exports = { processNodeV2 };
