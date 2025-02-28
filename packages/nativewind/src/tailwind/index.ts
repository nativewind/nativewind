module.exports = Object.assign(
  () => {
    // Check if this file is being loaded by an editor with Tailwind CSS IntelliSense (e.g., VS Code).
    // If so, load the `native` part so that features implemented in `native` (like `p-safe`) can be auto-completed in the editor.
    const isTailwindCSSIntelliSenseMode = "TAILWIND_MODE" in process.env;
    if (isTailwindCSSIntelliSenseMode) return require("./native").default;
    return process.env.NATIVEWIND_OS === undefined ||
      process.env.NATIVEWIND_OS === "web"
      ? require("./web").default
      : require("./native").default;
  },
  {
    nativewind: true,
  },
);
