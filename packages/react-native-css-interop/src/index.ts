import React from "react";

export { StyleSheet } from "./runtime/web/stylesheet";
export { enableCSSInterop } from "./runtime/shared/enable-css-interop";

/**
 * @deprecated This is an alias for React.createElement. Just use it directly
 */
export const createElement = React.createElement;
