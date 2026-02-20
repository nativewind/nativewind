import path from "path";

import { withCssInterop } from "react-native-css-interop/metro";

import { withNativeWind } from "../metro";
import { tailwindCli, tailwindConfig } from "../metro/tailwind";

jest.mock("react-native-css-interop/metro", () => ({
  withCssInterop: jest.fn((config) => config),
}));

jest.mock("../metro/tailwind", () => ({
  tailwindCli: jest.fn(),
  tailwindConfig: jest.fn(() => ({ important: false })),
}));

jest.mock("../metro/typescript", () => ({
  setupTypeScript: jest.fn(),
}));

describe("withNativeWind postcss options", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should resolve postcss path and pass to tailwind cli options", async () => {
    const getCSSForPlatform = jest.fn().mockResolvedValue("/* css */");

    (tailwindCli as jest.Mock).mockReturnValue({
      getCSSForPlatform,
    });

    withNativeWind(
      {} as any,
      {
        input: "./assets/style/global.css",
        postcss: "./postcss.config.js",
        disableTypeScriptGeneration: true,
      } as any,
    );

    const options = (withCssInterop as jest.Mock).mock.calls[0][1];
    await options.getCSSForPlatform("web", undefined);

    expect(tailwindConfig).toHaveBeenCalled();
    expect(getCSSForPlatform).toHaveBeenCalledWith(
      expect.objectContaining({
        platform: "web",
        postcss: path.resolve("./postcss.config.js"),
      }),
    );
  });

  test("should pass boolean postcss option to tailwind cli options", async () => {
    const getCSSForPlatform = jest.fn().mockResolvedValue("/* css */");

    (tailwindCli as jest.Mock).mockReturnValue({
      getCSSForPlatform,
    });

    withNativeWind(
      {} as any,
      {
        input: "./assets/style/global.css",
        postcss: true,
        disableTypeScriptGeneration: true,
      } as any,
    );

    const options = (withCssInterop as jest.Mock).mock.calls[0][1];
    await options.getCSSForPlatform("android", undefined);

    expect(getCSSForPlatform).toHaveBeenCalledWith(
      expect.objectContaining({
        platform: "android",
        postcss: true,
      }),
    );
  });

  test("should not forward postcss=false as a string", async () => {
    const getCSSForPlatform = jest.fn().mockResolvedValue("/* css */");

    (tailwindCli as jest.Mock).mockReturnValue({
      getCSSForPlatform,
    });

    withNativeWind(
      {} as any,
      {
        input: "./assets/style/global.css",
        postcss: false,
        disableTypeScriptGeneration: true,
      } as any,
    );

    const options = (withCssInterop as jest.Mock).mock.calls[0][1];
    await options.getCSSForPlatform("android", undefined);

    expect(getCSSForPlatform).toHaveBeenCalledWith(
      expect.objectContaining({
        platform: "android",
        postcss: false,
      }),
    );
  });
});
