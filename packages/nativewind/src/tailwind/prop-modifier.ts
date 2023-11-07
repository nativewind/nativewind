import plugin from "tailwindcss/plugin";

export const nativePropModifierPlugin = plugin(function ({ matchVariant, e }) {
  matchVariant("prop", (value) => {
    return `&:native-prop(${value})`;
  });
});

export const webPropModifierPlugin = plugin(function ({ matchVariant, e }) {
  matchVariant("prop", () => {
    return `&`;
  });
});
