import plugin from "tailwindcss/plugin";

export const platforms = plugin(function ({ addVariant }) {
  const nativePlatforms = ["android", "ios", "windows", "macos"];

  for (const platform of nativePlatforms) {
    addVariant(platform, `@media ${platform}`);
  }

  addVariant(
    "native",
    nativePlatforms.map((platform) => `@media ${platform}`)
  );
});
