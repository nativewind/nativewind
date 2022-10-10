import plugin from "tailwindcss/plugin";
import { platform } from "../platform";

const nativePlatforms = ["android", "ios", "windows", "macos"];

export default plugin(function ({ addVariant }) {
  if (platform === "web") {
    addVariant("web", "&");
    addVariant("parent", "& > *");
    addVariant("scope-group-hover", "&.scope-group-hover");
    addVariant("scope-group-focus", "&.scope-group-focus");
    addVariant("scope-group-active", "&.scope-group-active");
  } else {
    for (const platform of nativePlatforms) {
      addVariant(platform, `&:${platform}`);
    }

    addVariant(
      "native",
      nativePlatforms.map((platform) => `&:${platform}`)
    );
  }
});
