/**
 * This is a hack around Tailwind CSS v3, please read tailwind/v3/index.ts for more information.
 */
(async function () {
  const fs = require("fs");

  const fakeOutput = "FAKE_OUTPUT";
  let currentContents = "";

  const originalReadFile = fs.promises.readFile;
  fs.promises.readFile = async (path: string, encoding: string) => {
    if (path === fakeOutput) {
      return currentContents;
    }
    return originalReadFile(path, encoding);
  };

  const originalMkdir = fs.promises.mkdir.bind(fs.promises.mkdir);
  fs.promises.mkdir = async (path: string, ...args: any) => {
    if (path === fakeOutput) {
      return;
    }
    return originalMkdir(path, ...args);
  };

  const originalWriteFile = fs.promises.writeFile.bind(fs.promises.writeFile);
  fs.promises.writeFile = async (
    path: string,
    data: string | Buffer,
    ...args: any
  ) => {
    if (path === fakeOutput) {
      if (!process.send) {
        process.exit(42);
      }

      process.send(data.toString());
      return;
    }
    return originalWriteFile(path, data, ...args);
  };

  const { build } = require("tailwindcss/lib/cli/build");

  await build({
    "--input": process.env.NATIVEWIND_INPUT,
    "--output": fakeOutput,
    "--watch": process.env.NATIVEWIND_WATCH === "true",
  });
})();
