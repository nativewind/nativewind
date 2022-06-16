import { tailwindRunner, css } from "../tailwindcss/runner";

tailwindRunner("Platform Prefixes", [
  [
    "ios:w-px",
    {
      [css`ios:w-px::ios`]: [{ width: 1 }],
    },
  ],
  [
    "android:w-px",
    {
      [css`android:w-px::android`]: [{ width: 1 }],
    },
  ],
  [
    "windows:w-px",
    {
      [css`windows:w-px::windows`]: [{ width: 1 }],
    },
  ],
  [
    "macos:w-px",
    {
      [css`macos:w-px::macos`]: [{ width: 1 }],
    },
  ],
  [
    "web:w-px",
    {
      [css`web:w-px::web`]: [{ width: 1 }],
    },
  ],
  [
    "native:w-px",
    {
      [css`native:w-px::ios`]: [{ width: 1 }],
      [css`native:w-px::android`]: [{ width: 1 }],
      [css`native:w-px::macos`]: [{ width: 1 }],
      [css`native:w-px::windows`]: [{ width: 1 }],
    },
  ],
]);
