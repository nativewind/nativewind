import { tailwindRunner } from "../tailwindcss/runner";

tailwindRunner("Platform Prefixes", [
  [
    "ios:w-px",
    {
      styles: {
        "ios_w-px_0": { width: 1 },
      },
      media: {
        "ios_w-px": [["ios", 0]],
      },
    },
  ],
  [
    "android:w-px",
    {
      styles: {
        "android_w-px_0": { width: 1 },
      },
      media: {
        "android_w-px": [["android", 0]],
      },
    },
  ],
  [
    "windows:w-px",
    {
      styles: {
        "windows_w-px_0": { width: 1 },
      },
      media: {
        "windows_w-px": [["windows", 0]],
      },
    },
  ],
  [
    "macos:w-px",
    {
      styles: {
        "macos_w-px_0": { width: 1 },
      },
      media: {
        "macos_w-px": [["macos", 0]],
      },
    },
  ],
  [
    "web:w-px",
    {
      styles: {
        "web_w-px_0": { width: 1 },
      },
      media: {
        "web_w-px": [["web-inline", 0]],
      },
    },
  ],
  [
    "native:w-px",
    {
      styles: {
        "native_w-px_0": { width: 1 },
        "native_w-px_1": { width: 1 },
        "native_w-px_2": { width: 1 },
        "native_w-px_3": { width: 1 },
        "native_w-px_4": { width: 1 },
      },
      media: {
        "native_w-px": [
          ["native", 0],
          ["android", 1],
          ["ios", 2],
          ["windows", 3],
          ["macos", 4],
        ],
      },
    },
  ],
]);
