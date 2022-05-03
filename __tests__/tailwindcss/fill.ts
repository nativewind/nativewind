import { expectError, tailwindRunner } from "./runner";

tailwindRunner(
  "SVG - Fill",
  expectError([
    "fill-inherit",
    "fill-current",
    "fill-transparent",
    "fill-black",
    "fill-white",
    "fill-slate-50",
    "fill-gray-50",
    "fill-zinc-50",
    "fill-neutral-50",
    "fill-stone-50",
    "fill-red-50",
    "fill-orange-50",
    "fill-amber-50",
    "fill-yellow-50",
    "fill-lime-50",
    "fill-green-50",
    "fill-emerald-50",
    "fill-teal-50",
    "fill-cyan-50",
    "fill-sky-50",
    "fill-blue-50",
    "fill-indigo-50",
    "fill-violet-50",
    "fill-purple-50",
    "fill-fuchsia-50",
    "fill-pink-50",
    "fill-rose-50",
  ])
);
