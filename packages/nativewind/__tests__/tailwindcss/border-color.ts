import { createTests, expectError, tailwindRunner } from "./runner";

const scenarios: Record<string, string> = {
  transparent: "transparent",
  black: "#000",
  white: "#fff",
  "slate-50": "#f8fafc",
  "gray-50": "#f9fafb",
  "zinc-50": "#fafafa",
  "neutral-50": "#fafafa",
  "stone-50": "#fafaf9",
  "red-50": "#fef2f2",
  "orange-50": "#fff7ed",
  "amber-50": "#fffbeb",
  "yellow-50": "#fefce8",
  "lime-50": "#f7fee7",
  "green-50": "#f0fdf4",
  "emerald-50": "#ecfdf5",
  "teal-50": "#f0fdfa",
  "cyan-50": "#ecfeff",
  "sky-50": "#f0f9ff",
  "blue-50": "#eff6ff",
  "indigo-50": "#eef2ff",
  "violet-50": "#f5f3ff",
  "purple-50": "#faf5ff",
  "fuchsia-50": "#fdf4ff",
  "pink-50": "#fdf2f8",
  "rose-50": "#fff1f2",
};

tailwindRunner(
  "Border - Border Color",
  createTests("border", scenarios, (n) => ({
    borderBottomColor: n,
    borderRightColor: n,
    borderTopColor: n,
    borderLeftColor: n,
  })),
  createTests("border-x", scenarios, (n) => ({
    borderRightColor: n,
    borderLeftColor: n,
  })),
  createTests("border-y", scenarios, (n) => ({
    borderBottomColor: n,
    borderTopColor: n,
  })),
  createTests("border-t", scenarios, (n) => ({
    borderTopColor: n,
  })),
  createTests("border-b", scenarios, (n) => ({
    borderBottomColor: n,
  })),
  createTests("border-l", scenarios, (n) => ({
    borderLeftColor: n,
  })),
  createTests("border-r", scenarios, (n) => ({
    borderRightColor: n,
  })),
  expectError([
    "border-current",
    "border-inherit",
    "border-x-current",
    "border-x-inherit",
    "border-y-current",
    "border-y-inherit",
    "border-t-current",
    "border-t-inherit",
    "border-b-current",
    "border-b-inherit",
    "border-l-current",
    "border-l-inherit",
    "border-r-current",
    "border-r-inherit",
  ])
);
