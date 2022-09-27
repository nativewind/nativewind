import { Config } from "tailwindcss";

import { extractStyles } from "../src/postcss/extract";
import nativePreset from "../src/tailwind";

const expectStyle = (style: string, config?: Partial<Config>) => {
  const createOptions = extractStyles({
    content: [],
    safelist: style.split(" "),
    presets: [nativePreset],
    ...config,
  });

  return expect(createOptions);
};

const classNames = `
accent-black
flex-1
`;

test("tailwind", () => {
  expectStyle(classNames).toEqual({
    "flex-1": {
      styles: [
        {
          flexBasis: "0%",
          flexGrow: 1,
          flexShrink: 1,
        },
      ],
    },
  });
});
