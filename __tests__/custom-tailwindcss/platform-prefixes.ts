import { tailwindRunner } from "../tailwindcss/runner";

tailwindRunner("Platform Prefixes", [
  [
    "ios:w-px",
    {
      styles: {
        "ios:w-px": { width: 1 },
      },
      masks: {
        "ios:w-px": 8192,
      },
    },
  ],
  [
    "android:w-px",
    {
      styles: {
        "android:w-px": { width: 1 },
      },
      masks: {
        "android:w-px": 4096,
      },
    },
  ],
  [
    "windows:w-px",
    {
      styles: {
        "windows:w-px": { width: 1 },
      },
      masks: {
        "windows:w-px": 32_768,
      },
    },
  ],
  [
    "macos:w-px",
    {
      styles: {
        "macos:w-px": { width: 1 },
      },
      masks: {
        "macos:w-px": 65_536,
      },
    },
  ],
  [
    "web:w-px",
    {
      styles: {
        "web:w-px": { width: 1 },
      },
      masks: {
        "web:w-px": 16_384,
      },
    },
  ],
  [
    "native:w-px",
    {
      styles: {
        "native:w-px": { width: 1 },
      },
      masks: {
        "native:w-px": 110_592,
      },
    },
  ],
]);
