const { join } = require("path");
const { existsSync } = require("fs");
const plugin = require("tailwindcss/plugin");
const resolveTailwindConfig = require("tailwindcss/resolveConfig");

/**
 * Resolves the Tailwind config based upon the cwd
 * @param {string} cwd
 * @returns {import('tailwindcss/tailwind-config').TailwindConfig}
 */
function getTailwindConfig(cwd, configPath) {
  const fullConfigPath = join(cwd, configPath || "./tailwind.config.js");

  // Get the config. Throw an error if configPath was set but we were unable to find it
  let projectTailwindConfig;
  if (existsSync(fullConfigPath)) {
    projectTailwindConfig = require(fullConfigPath);
  } else if (configPath) {
    throw new Error(`Unable to find config ${fullConfigPath}`);
  } else {
    projectTailwindConfig = {};
  }

  return resolveTailwindConfig({
    ...projectTailwindConfig,
    plugins: [
      ...(projectTailwindConfig.plugins || []),
      plugin(function ({ addVariant }) {
        addVariant("native", "@media native");
        addVariant("ios", "");
        addVariant("android", "");
      }),
    ],
  });
}

module.exports = getTailwindConfig;
