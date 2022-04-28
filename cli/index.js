#!/usr/bin/env node
/* eslint-disable unicorn/import-style */
/* eslint-disable unicorn/prefer-module */
/* eslint-disable @typescript-eslint/no-var-requires */
const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");
const { spawn } = require("node:child_process");
const { writeFile, readFile } = require("node:fs/promises");
const { existsSync, writeFileSync } = require("node:fs");
const { file } = require("tempy");
const { join } = require("path");
const { extractStyles } = require("../dist/babel/native-style-extraction");
const {
  getTailwindConfig,
} = require("../dist/babel/tailwind/get-tailwind-config");

const argv = yargs(hideBin(process.argv))
  .option("platform", {
    alias: "p",
    description: "tailwindcss-react-native platform",
    required: true,
  })
  .option("config", {
    alias: "c",
    description: "Path to tailwindcss config file",
    default: "tailwind.config.js",
  })
  .option("output", {
    alias: "o",
    description: "Output file",
    default: "tailwindcss-react-native-output.js",
  })
  .option("watch", {
    alias: "w",
    description: "Watch for changes and rebuild as needed",
    default: false,
  }).argv;

const { platform, output, watch, config } = argv;

/**
 * Web does not need to compile any styles, as it will simply do a pass through
 */
if (platform === "web") {
  writeFileSync(
    output,
    `module.exports = {
  platform: '${platform}',
}`
  );

  process.exit(0);
}

const tailwindOutput = file();
const tailwindConfig = getTailwindConfig(process.cwd(), {
  tailwindConfigPath: config,
});

const spawnArguments = [
  "tailwindcss",
  "-c",
  config,
  "-i",
  join(__dirname, "./cli.css"),
  "-o",
  tailwindOutput,
];

if (watch) spawnArguments.push("--watch");

const child = spawn("npx", spawnArguments);

let chain = Promise.resolve();

// Everytime tailwindcss writes new styles, we write new styles
child.stderr.on("data", (data) => {
  process.stderr.write(data);

  // Queue the wrtes, so we don't try and write to the file
  // at the same time
  chain = chain.then(async () => {
    if (!existsSync(tailwindOutput)) return;

    const css = await readFile(tailwindOutput, "utf8");
    const { styles, media } = extractStyles(tailwindConfig, css, false);

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
