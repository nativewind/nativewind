/* eslint-disable unicorn/prefer-module */
/* eslint-disable @typescript-eslint/no-var-requires */
const { extractStyles } = require("nativewind/dist/postcss/extract-styles");
const cssPlugin = require("nativewind/dist/tailwind/css");
const { nativePlugin } = require("nativewind/dist/tailwind/native");

const { allowCors } = require("../cors");

async function handler(request, response) {
  try {
    const { raw } = extractStyles({
      plugins: [cssPlugin, nativePlugin({})],
      content: [{ raw: "", extension: "html" }],
      safelist: [request.query.css || ""],
      // theme: request.query.theme
      //   ? JSON.parse(decodeURIComponent(request.query.theme))
      //   : {},
    });

    response.status(200).json({
      body: raw,
    });
  } catch (error) {
    response.status(400).json({
      body: { error: error.message },
    });
  }
}

export default allowCors(
  handler,
  "https://snack-web-player.s3.us-west-1.amazonaws.com"
);
