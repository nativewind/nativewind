const { join } = require("path");
const plugin = require("tailwindcss/plugin");
const resolveTailwindConfig = require("tailwindcss/resolveConfig");

/**
 * Resolves the Tailwind config based upon the cwd
 * @param {string} cwd
 * @returns {import('tailwindcss/tailwind-config').TailwindConfig}
 */
function getTailwindConfig(cwd, configPath = "./tailwind.config.js") {
  const projectTailwindConfig = require(join(cwd, configPath));
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
