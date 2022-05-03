import { expectError, tailwindRunner } from "./runner";

tailwindRunner(
  "SVG - Stroke",
  expectError([
    "stroke-inherit",
    "stroke-current",
    "stroke-transparent",
    "stroke-black",
    "stroke-white",
    "stroke-slate-50",
    "stroke-gray-50",
    "stroke-zinc-50",
    "stroke-neutral-50",
    "stroke-stone-50",
    "stroke-red-50",
    "stroke-orange-50",
    "stroke-amber-50",
    "stroke-yellow-50",
    "stroke-lime-50",
    "stroke-green-50",
    "stroke-emerald-50",
    "stroke-teal-50",
    "stroke-cyan-50",
    "stroke-sky-50",
    "stroke-blue-50",
    "stroke-indigo-50",
    "stroke-violet-50",
    "stroke-purple-50",
    "stroke-fuchsia-50",
    "stroke-pink-50",
    "stroke-rose-50",
  ])
);
