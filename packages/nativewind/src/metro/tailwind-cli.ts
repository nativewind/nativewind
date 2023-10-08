import { spawn } from "node:child_process";
import { ServerOptions, WebSocketServer, WebSocket } from "ws";
import type { GetTransformOptionsOpts } from "metro-config";
import {
  cssToReactNativeRuntime,
  CssToReactNativeRuntimeOptions,
} from "react-native-css-interop/css-to-rn";
import { writeFileSync, mkdirSync } from "node:fs";

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

  if (options.dev && options.platform !== "web") {
    spawnCommands.push("--watch");
    const wss = new WebSocketServer(options.hotServerOptions);
    wss.on("connection", (ws) => {
      connections.add(ws);
      ws.on("close", () => connections.delete(ws));
      if (latestData) {
        ws.send(latestData);
      }
    });
  }

  const { stdout, stderr } = spawn("npx", spawnCommands, {
    shell: true,
    env,
  });

  let firstRun = true;

  let chunks: Buffer[] = [];

  stderr.on("data", () => {
    const css = chunks.reduce((acc, chunk) => acc + chunk.toString(), "");
    chunks = [];

    clearTimeout(timeout);

    const runtimeData = JSON.stringify(
      cssToReactNativeRuntime(css, options.cssToReactNativeRuntime),
    );

    latestData = runtimeData;

    if (firstRun) {
      console.log(`done`);
      firstRun = false;
      mkdirSync(options.output, { recursive: true });
      writeFileSync(getOutput(options.output, options), css, "utf-8");
      done();
    } else {
      for (const ws of connections) {
        ws.send(runtimeData);
      }
    }
  });

  stdout.on("data", (css: Buffer) => {
    chunks.push(css);
  });

  return deferred;
}

export function getOutput(output: string, options: GetTransformOptionsOpts) {
  // Force a platform and `.css` extensions (as they might be using `.sass` or another preprocessor
  return `${output}.${options.platform !== "web" ? "native" : "web"}.css`;
}
