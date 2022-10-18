import plugin from "tailwindcss/plugin";

export default plugin(function ({ addVariant }) {
  const nativePlatforms = ["android", "ios", "windows", "macos"];

  for (const platform of nativePlatforms) {
    addVariant(platform, `&:${platform}`);
  }

  addVariant(
    "native",
    nativePlatforms.map((platform) => `&:${platform}`)
  );
});
