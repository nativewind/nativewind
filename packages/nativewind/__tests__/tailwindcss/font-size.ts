import { tailwindRunner } from "./runner";

tailwindRunner("Typography - Font Size", [
  ["text-xs", { styles: { "text-xs": { fontSize: 12, lineHeight: 16 } } }],
  ["text-sm", { styles: { "text-sm": { fontSize: 14, lineHeight: 20 } } }],
  ["text-base", { styles: { "text-base": { fontSize: 16, lineHeight: 24 } } }],
  ["text-lg", { styles: { "text-lg": { fontSize: 18, lineHeight: 28 } } }],
  ["text-xl", { styles: { "text-xl": { fontSize: 20, lineHeight: 28 } } }],
  ["text-2xl", { styles: { "text-2xl": { fontSize: 24, lineHeight: 32 } } }],
  ["text-3xl", { styles: { "text-3xl": { fontSize: 30, lineHeight: 36 } } }],
  ["text-4xl", { styles: { "text-4xl": { fontSize: 36, lineHeight: 40 } } }],
  ["text-5xl", { styles: { "text-5xl": { fontSize: 48, lineHeight: 48 } } }],
  ["text-6xl", { styles: { "text-6xl": { fontSize: 60, lineHeight: 60 } } }],
  ["text-7xl", { styles: { "text-7xl": { fontSize: 72, lineHeight: 72 } } }],
  ["text-8xl", { styles: { "text-8xl": { fontSize: 96, lineHeight: 96 } } }],
  ["text-9xl", { styles: { "text-9xl": { fontSize: 128, lineHeight: 128 } } }],
]);
