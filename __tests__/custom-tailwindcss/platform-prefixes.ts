import { tailwindRunner } from "../tailwindcss/runner";

tailwindRunner("Platform Prefixes", [
  [
    "ios:w-px",
    {
      "ios_w-px": [{ atRules: [["media", "ios"]], width: 1 }],
    },
  ],
  [
    "android:w-px",
    {
      "android_w-px": [{ atRules: [["media", "android"]], width: 1 }],
    },
  ],
  [
    "windows:w-px",
    {
      "windows_w-px": [{ atRules: [["media", "windows"]], width: 1 }],
    },
  ],
  [
    "macos:w-px",
    {
      "macos_w-px": [{ atRules: [["media", "macos"]], width: 1 }],
    },
  ],
  [
    "web:w-px",
    {
      "web_w-px": [{ atRules: [["media", "web"]], width: 1 }],
    },
  ],
  [
    "native:w-px",
    {
      "native_w-px": [
        { atRules: [["media", "native"]], width: 1 },
        { atRules: [["media", "android"]], width: 1 },
        { atRules: [["media", "ios"]], width: 1 },
        { atRules: [["media", "windows"]], width: 1 },
        { atRules: [["media", "macos"]], width: 1 },
      ],
    },
  ],
]);
