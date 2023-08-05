import { spawn, spawnSync } from "node:child_process";
import type { GetTransformOptionsOpts } from "metro-config";

export function tailwindCli(
  input: string,
  output: string,
  options: GetTransformOptionsOpts,
  watch: boolean,
) {
  const spawnCommands = [
    "tailwindcss",
    "--input",
    input,
    "--output",
    getOutput(output, options),
  ];

  const env = {
    ...process.env,
    NATIVEWIND_NATIVE: options.platform !== "web" ? "1" : undefined,
  };

  if (watch) {
    spawnCommands.push("--watch", "--poll");
    watchCli(spawnCommands, env, options);
  } else {
    cli(spawnCommands, env, options);
  }
}

function watchCli(
  spawnCommands: string[],
  env: NodeJS.ProcessEnv,
  options: GetTransformOptionsOpts,
) {
  const platform = options.platform === "web" ? "web" : "native";
  const cli = spawn("npx", spawnCommands, {
    shell: true,
    env,
  });
  let skipFirst = true;
  cli.stderr.on("data", (data: Buffer) => {
    const start = Date.now();

    const message = data.toString().trim();
    const isDone = message.includes("Done");

    if (!message) return;
    if (isDone) {
      if (skipFirst) {
        skipFirst = false;
        return;
      }

      const timeMatch = message.match(/\d+/);
      const time = Number.parseInt(timeMatch ? timeMatch[0] : "0", 10);
      const total = time + (Date.now() - start);
      console.error(`tailwindcss(${platform}) rebuilt in ${total}ms`);
    } else if (
      !message.startsWith("[Browserslist] Could not parse") &&
      !message.includes("Rebuilding")
    ) {
      console.error(`tailwindcss(${platform}) ${message}`);
    }
  });
}

function cli(
  spawnCommands: string[],
  env: NodeJS.ProcessEnv,
  options: GetTransformOptionsOpts,
) {
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

  const { stderr } = spawnSync("npx", spawnCommands, {
    shell: true,
    env,
  });
  clearTimeout(timeout);
  console.log(`${stderr.toString().replace("\nRebuilding...\n\n", "").trim()}`);
}

export function getOutput(output: string, options: GetTransformOptionsOpts) {
  // Force a platform and `.css` extensions (as they might be using `.sass` or another preprocessor
  return `${output}.${options.platform !== "web" ? "native" : "web"}.css`;
}
