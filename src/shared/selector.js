/** @typedef {{ important?: string }} NormaliseSelectorOptions */

/**
 * Normalise a css selector/rule into a standard format
 * @param {string} selector
 * @param {NormaliseSelectorOptions} options
 * @returns {string}
 */
function normaliseSelector(selector, options = {}) {
  const { important } = options;

  const s = important
    ? selector.replace(new RegExp(`^${important}`), "")
    : selector;

  // prettier-ignore
  return s
    .split(" ").join("")
    .split("\\").join("")
    .split(":").join("_")
    .replace(/^\./, "");
}

module.exports = normaliseSelector;
