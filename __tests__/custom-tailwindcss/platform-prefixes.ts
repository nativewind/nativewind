import { tailwindRunner, $ } from "../tailwindcss/runner";

tailwindRunner("Platform Prefixes", [
  [
    "ios:w-px",
    {
      [$`ios:w-px:ios`({ platform: "ios" })]: [{ width: 1 }],
    },
  ],
  [
    "android:w-px",
    {
      [$`android:w-px:android`({ platform: "android" })]: [{ width: 1 }],
    },
  ],
  [
    "windows:w-px",
    {
      [$`windows:w-px:windows`({ platform: "windows" })]: [{ width: 1 }],
    },
  ],
  [
    "macos:w-px",
    {
      [$`macos:w-px:macos`({ platform: "macos" })]: [{ width: 1 }],
    },
  ],
  [
    "web:w-px",
    {
      [$`web:w-px:web`({ platform: "web" })]: [{ width: 1 }],
    },
  ],
  [
    "native:w-px",
    {
      [$`native:w-px:ios`({ platform: "ios" })]: [{ width: 1 }],
      [$`native:w-px:android`({ platform: "android" })]: [{ width: 1 }],
      [$`native:w-px:macos`({ platform: "macos" })]: [{ width: 1 }],
      [$`native:w-px:windows`({ platform: "windows" })]: [{ width: 1 }],
    },
  ],
]);
