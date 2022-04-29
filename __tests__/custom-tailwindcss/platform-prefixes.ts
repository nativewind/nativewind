import { tailwindRunner } from "../tailwindcss/runner";

tailwindRunner("Platform Prefixes", [
  [
    "ios:w-px",
    {
      styles: {
        "ios_w-px.0": { width: 1 },
      },
      media: {
        "ios_w-px": ["ios"],
      },
    },
  ],
  [
    "android:w-px",
    {
      styles: {
        "android_w-px.0": { width: 1 },
      },
      media: {
        "android_w-px": ["android"],
      },
    },
  ],
  [
    "windows:w-px",
    {
      styles: {
        "windows_w-px.0": { width: 1 },
      },
      media: {
        "windows_w-px": ["windows"],
      },
    },
  ],
  [
    "macos:w-px",
    {
      styles: {
        "macos_w-px.0": { width: 1 },
      },
      media: {
        "macos_w-px": ["macos"],
      },
    },
  ],
  [
    "web:w-px",
    {
      styles: {
        "web_w-px.0": { width: 1 },
      },
      media: {
        "web_w-px": ["web-inline"],
      },
    },
  ],
  [
    "native:w-px",
    {
      styles: {
        "native_w-px.0": { width: 1 },
        "native_w-px.1": { width: 1 },
        "native_w-px.2": { width: 1 },
        "native_w-px.3": { width: 1 },
        "native_w-px.4": { width: 1 },
      },
      media: {
        "native_w-px": ["native", "android", "ios", "windows", "macos"],
      },
    },
  ],
]);
