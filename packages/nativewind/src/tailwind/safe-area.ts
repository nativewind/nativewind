/*
Modified from: https://github.com/mvllow/tailwindcss-safe-area
Original License:
===============================================================================
MIT License

Copyright (c) 2021 mvllow

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
===============================================================================
*/

import plugin from "tailwindcss/plugin";

export const safeArea = plugin(({ addUtilities, matchUtilities, theme }) => {
  const platform = process.env.NATIVEWIND_PLATFORM ?? "web";

  const baseUtilities = {
    ".m-safe": {
      marginTop: "env(safe-area-inset-top)",
      marginRight: "env(safe-area-inset-right)",
      marginBottom: "env(safe-area-inset-bottom)",
      marginLeft: "env(safe-area-inset-left)",
    },
    ".mx-safe": {
      marginRight: "env(safe-area-inset-right)",
      marginLeft: "env(safe-area-inset-left)",
    },
    ".my-safe": {
      marginTop: "env(safe-area-inset-top)",
      marginBottom: "env(safe-area-inset-bottom)",
    },
    ".mt-safe": {
      marginTop: "env(safe-area-inset-top)",
    },
    ".mr-safe": {
      marginRight: "env(safe-area-inset-right)",
    },
    ".mb-safe": {
      marginBottom: "env(safe-area-inset-bottom)",
    },
    ".ml-safe": {
      marginLeft: "env(safe-area-inset-left)",
    },
    ".p-safe": {
      paddingTop: "env(safe-area-inset-top)",
      paddingRight: "env(safe-area-inset-right)",
      paddingBottom: "env(safe-area-inset-bottom)",
      paddingLeft: "env(safe-area-inset-left)",
    },
    ".px-safe": {
      paddingRight: "env(safe-area-inset-right)",
      paddingLeft: "env(safe-area-inset-left)",
    },
    ".py-safe": {
      paddingTop: "env(safe-area-inset-top)",
      paddingBottom: "env(safe-area-inset-bottom)",
    },
    ".pt-safe": {
      paddingTop: "env(safe-area-inset-top)",
    },
    ".pr-safe": {
      paddingRight: "env(safe-area-inset-right)",
    },
    ".pb-safe": {
      paddingBottom: "env(safe-area-inset-bottom)",
    },
    ".pl-safe": {
      paddingLeft: "env(safe-area-inset-left)",
    },
    ".top-safe": {
      top: "env(safe-area-inset-top)",
    },
    ".right-safe": {
      right: "env(safe-area-inset-right)",
    },
    ".bottom-safe": {
      bottom: "env(safe-area-inset-bottom)",
    },
    ".left-safe": {
      left: "env(safe-area-inset-left)",
    },
    ".h-screen-safe": {
      height: [
        "calc(100vh - (env(safe-area-inset-top) + env(safe-area-inset-bottom)))",
      ],
    },
  };

  if (platform === "web") {
    baseUtilities[".h-screen-safe"].height.push("-webkit-fill-available");
  }

  addUtilities(baseUtilities);

  const offsetUtilities: Parameters<typeof matchUtilities>[0] = {};
  for (const [selector, propertyValue] of Object.entries(baseUtilities)) {
    const className = selector.slice(1);
    offsetUtilities[`${className}-offset`] = (x) => {
      const acc: Record<string, string | string[]> = {};
      for (const [property, value] of Object.entries(propertyValue)) {
        if (Array.isArray(value)) {
          acc[property] = value.map((v) =>
            v === "-webkit-fill-available" ? v : `calc(${v} + ${x})`,
          );
        } else {
          acc[property] = `calc(${value} + ${x})`;
        }
      }
      return acc;
    };
  }

  matchUtilities(offsetUtilities, {
    values: theme("spacing"),
    supportsNegativeValues: true,
  });

  const orUtilities: Parameters<typeof matchUtilities>[0] = {};
  for (const [selector, propertyValue] of Object.entries(baseUtilities)) {
    const className = selector.slice(1);
    orUtilities[`${className}-or`] = (x) => {
      const acc: Record<string, string | string[]> = {};
      for (const [property, value] of Object.entries(propertyValue)) {
        if (Array.isArray(value)) {
          acc[property] = value.map((v) =>
            v === "-webkit-fill-available" ? v : `max(${v}, ${x})`,
          );
        } else {
          acc[property] = `max(${value}, ${x})`;
        }
      }
      return acc;
    };
  }

  matchUtilities(orUtilities, {
    values: theme("spacing"),
    supportsNegativeValues: true,
  });
});
