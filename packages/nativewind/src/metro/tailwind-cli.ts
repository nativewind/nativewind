import { spawn } from "node:child_process";
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";

import { ServerOptions, Server, WebSocket } from "ws";
import type { GetTransformOptionsOpts } from "metro-config";
import {
  cssToReactNativeRuntime,
  CssToReactNativeRuntimeOptions,
} from "react-native-css-interop/css-to-rn";

import { getOutput } from "./common";

export interface TailwindCliOptions extends GetTransformOptionsOpts {
  output: string;
  hotServerOptions: ServerOptions;
  cssToReactNativeRuntime?: CssToReactNativeRuntimeOptions;
}

export function tailwindCli(input: string, options: TailwindCliOptions) {
  let done: () => void;
  const deferred = new Promise<void>((resolve) => (done = resolve));

  const env = {
    ...process.env,
    NATIVEWIND_NATIVE: options.platform !== "web" ? "1" : undefined,
  };

  const platform = options.platform === "web" ? "web" : "native";
  process.stdout.write(`tailwindcss(${platform}) rebuilding... `);

  const timeout = setTimeout(() => {
    if (options.dev && !process.env.CI) {
      console.warn(
        `tailwindcss(${platform}) is taking a long time to build, please read https://tailwindcss.com/docs/content-configuration#pattern-recommendations to speed up your build time`,
      );
    }
    // 1 minute.
  }, 60000);

  const spawnCommands = ["tailwindcss", "--input", input];

  const connections = new Set<WebSocket>();
  let latestData: string | undefined;

  if (options.dev) {
    spawnCommands.push("--watch");
  }

  const startedWSServer = options.dev && options.platform !== "web";

  if (startedWSServer) {
    const wss = new Server(options.hotServerOptions);
    wss.on("connection", (ws) => {
      connections.add(ws);
      ws.on("close", () => connections.delete(ws));
      if (latestData) {
        ws.send(latestData);
      }
    });
  }

  mkdirSync(dirname(options.output), { recursive: true });

  const { stdout, stderr } = spawn("npx", spawnCommands, {
    shell: true,
    env,
  });

  let firstRun = true;
  let chunks: Buffer[] = [];

  stderr.on("data", (data: Buffer | string) => {
    data = data.toString();

    if (!data.includes("Done in")) return;

    clearTimeout(timeout);

    const css = chunks.reduce((acc, chunk) => acc + chunk.toString(), "");
    chunks = [];

    if (firstRun) {
      if (
        !(
          css.includes("@cssInterop set nativewind") ||
          css.includes("css-interop-nativewind")
        )
      ) {
        throw new Error(
          "Unable to detect NativeWind preset. Please ensure the `nativewind/preset` preset is included in your tailwind.config.js file.",
        );
      }
      firstRun = false;
    } else if (startedWSServer) {
      latestData = JSON.stringify(
        cssToReactNativeRuntime(css, options.cssToReactNativeRuntime),
      );

      for (const ws of connections) {
        ws.send(latestData);
      }
    }

    writeFileSync(getOutput(options.output, options), css);
    done();
  });

  stdout.on("data", (css: Buffer) => {
    chunks.push(css);
  });

  return deferred;
}
