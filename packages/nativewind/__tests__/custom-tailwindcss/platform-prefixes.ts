import { ANDROID, IOS, OSX, WEB, WINDOWS } from "../../src/utils/selector";
import { tailwindRunner } from "../tailwindcss/runner";

tailwindRunner("Platform Prefixes", [
  [
    "ios:w-px",
    {
      styles: {
        "ios:w-px": { width: 1 },
      },
      masks: {
        "ios:w-px": IOS,
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
        "android:w-px": ANDROID,
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
        "windows:w-px": WINDOWS,
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
        "macos:w-px": OSX,
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
        "web:w-px": WEB,
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
        "native:w-px": IOS | ANDROID | WINDOWS | OSX,
      },
    },
  ],
]);
