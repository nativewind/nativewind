import { TailwindPluginFn } from "tailwindcss/plugin";

export type CustomPluginFunction = (
  helpers: Parameters<TailwindPluginFn>[0],
  notSupported: (property: string) => () => void
) => void;
