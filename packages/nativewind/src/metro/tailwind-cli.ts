import { spawn } from "node:child_process";
import { mkdirSync, readFileSync } from "node:fs";
import { dirname } from "node:path";

import { ServerOptions, Server, WebSocket } from "ws";
import type { GetTransformOptionsOpts } from "metro-config";
import {
  CssToReactNativeRuntimeOptions,
  cssToReactNativeRuntime,
} from "react-native-css-interop/css-to-rn";

import { getOutput } from "./common";

export interface TailwindCliOptions extends GetTransformOptionsOpts {
  output: string;
  hotServerOptions: ServerOptions;
  cssToReactNativeRuntime?: CssToReactNativeRuntimeOptions;
}

export async function tailwindCli(input: string, options: TailwindCliOptions) {
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

  mkdirSync(dirname(options.output), { recursive: true });

  const output = getOutput(options.output, options);

  const spawnCommands = ["tailwindcss", "--input", input, "--output", output];

  let firstRun = true;
  let latestData: string | undefined;
  let startedWSServer = false;
  const connections = new Set<WebSocket>();

  if (options.dev) {
    spawnCommands.push("--watch");

    if (options.platform !== "web") {
      startedWSServer = true;
      const wss = new Server(options.hotServerOptions);
      wss.on("connection", (ws) => {
        connections.add(ws);
        ws.on("close", () => connections.delete(ws));
        if (latestData) {
          ws.send(latestData);
        }
      });
    }
  }

  const { stderr } = spawn("npx", spawnCommands, {
    shell: true,
    env,
  });

  stderr.on("data", (data: Buffer | string) => {
    data = data.toString();

    if (!data.includes("Done in")) return;

    if (firstRun) {
      console.log("done");
      firstRun = false;
      clearTimeout(timeout);
      done();
    } else if (startedWSServer) {
      latestData = JSON.stringify(
        cssToReactNativeRuntime(
          readFileSync(output, "utf-8"),
          options.cssToReactNativeRuntime,
        ),
      );

      for (const ws of connections) {
        ws.send(latestData);
      }
    }
  });

  return deferred;
}
