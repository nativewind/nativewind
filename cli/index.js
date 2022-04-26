#!/usr/bin/env node
const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");
const { spawn } = require("node:child_process");
const { writeFile, readFile } = require("node:fs/promises");
const { existsSync } = require("node:fs");
const { file } = require("tempy");
const { join } = require("path");
const { cssToRn } = require("../dist/babel/native-style-extraction");
const {
  getTailwindConfig,
} = require("../dist/babel/tailwind/get-tailwind-config");

const argv = yargs(hideBin(process.argv))
  .option("config", {
    alias: "c",
    type: "string",
    default: "tailwind.config.js",
  })
  .option("platform", {
    alias: "p",
    type: "string",
    default: "native",
  })
  .option("output", {
    alias: "o",
    type: "string",
    default: "tailwindcss-react-native-output.js",
  })
  .option("rem", {
    type: "number",
  })
  .option("watch", {
    alias: "w",
    type: "boolean",
    default: false,
  }).argv;

const { platform, output, watch, rem, config } = argv;

const tailwindOutput = file();
const tailwindConfig = getTailwindConfig(process.cwd(), {
  rem,
  tailwindConfigPath: config,
});

const spawnArgs = [
  "tailwindcss",
  "-c",
  config,
  "-i",
  join(__dirname, "./cli.css"),
  "-o",
  tailwindOutput,
  "--postcss",
  join(__dirname, "./postcss.config.js"),
];

if (watch) spawnArgs.push("--watch");

const child = spawn("npx", spawnArgs);

let chain = Promise.resolve();

// Everytime tailwindcss writes new styles, we write new styles
child.stderr.on("data", (data) => {
  process.stderr.write(data);

  // Queue the wrtes, so we don't try and write to the file
  // at the same time
  chain = chain.then(async () => {
    if (!existsSync(tailwindOutput)) return;

    const css = await readFile(tailwindOutput, "utf8");
    const { styles, media } = cssToRn(css, tailwindConfig);

    return writeFile(
      output,
      `module.exports = {
  platform: '${platform}',
  styles: ${JSON.stringify(styles)},
  media: ${JSON.stringify(media)}
}`
    );
  });
});

(async function () {
  await new Promise((resolve) => {
    child.on("close", resolve);
  });
})();
