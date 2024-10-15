import plugin from "tailwindcss/plugin";

export const webPropModifierPlugin = plugin(function ({ matchVariant }) {
  matchVariant("prop", () => {
    return `&`;
  });
});
