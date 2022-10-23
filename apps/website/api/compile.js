/* eslint-disable unicorn/prefer-module, @typescript-eslint/no-var-requires */
const postcss = require("postcss");
const tailwind = require("tailwindcss");
const { nativePlugin } = require("nativewind/dist/tailwind/native");
const nativewindJSON = require("nativewind/package.json");
const { getCreateOptions } = require("nativewind/dist/transform-css");

export default async function handler(request, response) {
  try {
    const classNames = request.query.classNames ?? "";
    const config = request.query.config ? JSON.parse(request.query.config) : {};

    console.log(nativewindJSON);
    console.log(nativePlugin);

    const output = postcss([
      tailwind({
        ...config,
        content: [],
        presets: [nativePlugin],
        safelist: [...classNames.split(" "), ...(config?.safelist ?? [])],
      }),
    ]).process(
      `@tailwind components;@tailwind utilities;${request.query.css ?? ""}`
    ).css;

    console.log(output);
    const compiled = getCreateOptions(output);
    console.log(compiled);

    response.status(200).json({
      body: compiled,
    });
  } catch (error) {
    response.status(400).json({
      body: { error: error.message },
    });
  }
}
