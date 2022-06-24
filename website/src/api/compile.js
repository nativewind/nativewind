const { extractStyles } = require("nativewind/dist/postcss/extract-styles");
const cssPlugin = require("nativewind/dist/tailwind/css");
const { nativePlugin } = require("nativewind/dist/tailwind/native");

const allowCors = (fn) => async (req, res) => {
  console.log({ origin: req.headers.origin });
  res.setHeader("Cache-Control", "s-maxage=86400");
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader(
    "Access-Control-Allow-Origin",
    "https://snack-web-player.s3.us-west-1.amazonaws.com"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }
  return await fn(req, res);
};

async function handler(request, response) {
  if (!request.query.css) return response.status(400);

  const { styles, atRules, topics, masks, childClasses } = extractStyles({
    theme: {},
    plugins: [cssPlugin, nativePlugin({})],
    content: [{ raw: "", extension: "html" }],
    safelist: [request.query.css],
    serializer: (v) => v,
  });

  response.status(200).json({
    body: {
      styles,
      atRules,
      topics,
      masks,
      childClasses,
    },
  });
}

export default allowCors(handler);
