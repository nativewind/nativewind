import { CustomPluginFunction } from "./types";

export const lineHeight: CustomPluginFunction = (
  { matchUtilities, theme },
  notSupported
) => {
  matchUtilities(
    {
      leading(value: string) {
        if (value.endsWith("px")) {
          return { lineHeight: value };
        }

        return notSupported(`leading-${value}`)();
      },
    },
    {
      values: { ...theme("lineHeight"), reverse: true },
      supportsNegativeValues: true,
    }
  );
};
