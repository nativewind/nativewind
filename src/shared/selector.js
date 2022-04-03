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

  return s
    .replaceAll(" ", "")
    .replaceAll("\\", "")
    .replaceAll(":", "_")
    .replace(/^\./, "");
}

module.exports = normaliseSelector;
