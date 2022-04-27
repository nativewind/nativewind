import plugin from "tailwindcss/plugin";
import { platforms, nativePlatforms } from "../shared/platforms";

export default plugin(function ({ addVariant }) {
  for (const platform of platforms) {
    addVariant(platform, `@media ${platform}`);
  }

  addVariant(
    "native",
    nativePlatforms.map((platform) => `@media ${platform}`)
  );

  addVariant("web", "@media web-inline");
});
