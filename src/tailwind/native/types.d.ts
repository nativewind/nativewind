import { PluginAPI } from "tailwindcss/plugin";

export type CustomPluginFunction = (
  helpers: PluginAPI,
  notSupported: (property: string) => () => void
) => void;
