/* eslint-disable unicorn/prefer-module, @typescript-eslint/no-var-requires */
const postcss = require("postcss");
const tailwind = require("tailwindcss");
const nativewindPreset = require("nativewind/dist/tailwind/native");
const { getCreateOptions } = require("nativewind/dist/transform-css");

export default async function handler(request, response) {
  try {
    const classNames = request.query.classNames ?? "";
    const config = request.query.config ? JSON.parse(request.query.config) : {};

    console.log(nativewindPreset);

    const output = postcss([
      tailwind({
        ...config,
        content: [],
        presets: [nativewindPreset],
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
