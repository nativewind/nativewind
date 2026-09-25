import { Debugger } from "debug";
import { createRequire } from "module";

import { tailwindCliV3, tailwindConfigV3 } from "./v3";

/**
 * Resolve the Tailwind CSS version from the user's project context, not from
 * NativeWind's own node_modules. In pnpm monorepos, NativeWind may have a
 * nested copy of tailwindcss (potentially v4) which would cause a false
 * version mismatch, even when the project itself has v3 installed correctly.
 *
 * We attempt resolution from the project root first (via `process.cwd()`),
 * and fall back to NativeWind's own resolution if that fails.
 */
function getTailwindVersion(): string {
  try {
    // Try to resolve from the project's perspective first
    const projectRequire = createRequire(
      require.resolve("tailwindcss/package.json", {
        paths: [process.cwd()],
      }),
    );
    return projectRequire("tailwindcss/package.json").version;
  } catch {
    // Fall back to NativeWind's own resolution
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      return require("tailwindcss/package.json").version;
    } catch {
      return "unknown";
    }
  }
}

const tailwindVersion = getTailwindVersion();
const isV3 = tailwindVersion.split(".")[0].includes("3");

export function tailwindCli(debug: Debugger) {
  if (isV3) {
    return tailwindCliV3(debug);
  }

  throw new Error(
    `NativeWind only supports Tailwind CSS v3, but found v${tailwindVersion}. ` +
      `In monorepo setups (e.g. pnpm workspaces), NativeWind may resolve a ` +
      `different version of tailwindcss from its own node_modules. To fix ` +
      `this, ensure tailwindcss@3.x is hoisted or add a package manager ` +
      `override to force tailwindcss to v3.x across the workspace.`,
  );
}

export function tailwindConfig(path: string) {
  if (isV3) {
    return tailwindConfigV3(path);
  } else {
    throw new Error(
      `NativeWind only supports Tailwind CSS v3, but found v${tailwindVersion}. ` +
        `In monorepo setups (e.g. pnpm workspaces), NativeWind may resolve a ` +
        `different version of tailwindcss from its own node_modules. To fix ` +
        `this, ensure tailwindcss@3.x is hoisted or add a package manager ` +
        `override to force tailwindcss to v3.x across the workspace.`,
    );
  }
}
