---
sidebar_position: 999
title: TailwindProvider
sidebar_label: <TailwindProvider />
---

All components need to be within the context of the TailwindProvider.

```tsx
import { TailwindProvider } from "tailwindcss-react-native";

function MyAppsProviders({ children }) {
  return <TailwindProvider>{children}</TailwindProvider>;
}
```

| Prop     | Values                                                | Default     | Description                                           |
| -------- | ----------------------------------------------------- | ----------- | ----------------------------------------------------- |
| platform | `web`, `native`, `ios`, `android`, `windows`, `macos` | Platform.OS | Used to match platform media queries                  |
| preview  | `boolean`                                             | `false`     | Enable preview features                               |
| style    | Compiled style object                                 | `undefined` | For manual injection via the [CLI](/setup-guides/cli) |
| media    | Compiled media object                                 | `undefined` | For manual injection via the [CLI](/setup-guides/cli) |
