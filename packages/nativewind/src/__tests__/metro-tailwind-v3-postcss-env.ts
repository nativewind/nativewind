import { EventEmitter } from "events";

import { fork } from "child_process";

import { tailwindCliV3 } from "../metro/tailwind/v3";

jest.mock("child_process", () => ({
  fork: jest.fn(),
}));

function mockForkAndResolveMessage() {
  const child = new EventEmitter() as any;
  child.stderr = new EventEmitter();
  child.stdout = new EventEmitter();

  (fork as jest.Mock).mockImplementation(() => {
    setImmediate(() => {
      child.emit("message", "/* css */");
    });
    return child;
  });
}

describe("tailwindCliV3 postcss env forwarding", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should pass true as NATIVEWIND_POSTCSS=true", async () => {
    mockForkAndResolveMessage();

    const cli = tailwindCliV3((() => undefined) as any);
    await cli.getCSSForPlatform({
      input: "./assets/style/global.css",
      platform: "web",
      postcss: true,
    });

    const forkOptions = (fork as jest.Mock).mock.calls[0][1];
    expect(forkOptions.env.NATIVEWIND_POSTCSS).toBe("true");
  });

  test("should pass postcss path string as NATIVEWIND_POSTCSS", async () => {
    mockForkAndResolveMessage();

    const cli = tailwindCliV3((() => undefined) as any);
    await cli.getCSSForPlatform({
      input: "./assets/style/global.css",
      platform: "ios",
      postcss: "/tmp/postcss.config.js",
    });

    const forkOptions = (fork as jest.Mock).mock.calls[0][1];
    expect(forkOptions.env.NATIVEWIND_POSTCSS).toBe("/tmp/postcss.config.js");
  });

  test("should not set NATIVEWIND_POSTCSS when postcss=false", async () => {
    mockForkAndResolveMessage();

    const cli = tailwindCliV3((() => undefined) as any);
    await cli.getCSSForPlatform({
      input: "./assets/style/global.css",
      platform: "android",
      postcss: false,
    });

    const forkOptions = (fork as jest.Mock).mock.calls[0][1];
    expect(forkOptions.env.NATIVEWIND_POSTCSS).toBeUndefined();
  });
});
