const path = require("path");
const { existsSync } = require("fs");
const postcss = require("postcss");
const tailwind = require("tailwindcss");
const {
  cssToReactNativeRuntime,
} = require("react-native-css-interop/dist/css-to-rn/index");

const forceLightningcssToBeBundled = path.join(
  process.cwd(),
  "node_modules/lightningcss/lightningcss.linux-x64-gnu.node",
);

async function handler(request, response) {
  if (request.method !== "POST") {
    if (!existsSync(forceLightningcssToBeBundled)) {
      response.status(200).json({
        error: "lightningcss",
      });
    }

    response.status(400).end();
    return;
  }

  if (!request.body || typeof request.body.content !== "string") {
    response.status(400).end();
    return;
  }

  let { css: output } = await postcss([
    tailwind({
      theme: {},
      // presets: [preset as any],
      // plugins: [tailwindcssContainerQueries],
      content: [{ raw: request.body.content, extension: "html" }],
      corePlugins: {
        preflight: false,
      },
    }),
  ]).process("@tailwind components;@tailwind utilities;", {
    from: undefined,
  });

  const result = cssToReactNativeRuntime(output, {
    ignorePropertyWarningRegex: ["^--tw-"],
    grouping: ["^group$", "^group/"],
  });

  response.status(200).json(result);
}

function allowCors(fn) {
  return async (req, res) => {
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Origin", "*");
    // another common pattern
    // res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET,OPTIONS,PATCH,DELETE,POST,PUT",
    );
    res.setHeader(
      "Access-Control-Allow-Headers",
      "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
    );
    if (req.method === "OPTIONS") {
      res.status(200).end();
      return;
    }
    return fn(req, res);
  };
}

module.exports = allowCors(handler);
