import plugin from "tailwindcss/plugin";

const isNative = Boolean(process.env.NATIVEWIND_OS);

export const verify = plugin(function ({ addBase }) {
  if (isNative) {
    addBase({ "@cssInterop set nativewind": "" });
  } else {
    addBase({
      ":root": {
        "--css-interop": "true",
        "--css-interop-nativewind": "true",
      },
    });
  }
});
