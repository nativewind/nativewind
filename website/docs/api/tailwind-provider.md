---
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

## Options

| Prop               | Values            | Default                                   | Description                           |
| ------------------ | ----------------- | ----------------------------------------- | ------------------------------------- |
| initialColorScheme | `ColorSchemeName` | `Appearance.getColorScheme() ?? 'light'`  | Set an ColorScheme value.             |
| webOutput          | `css`, `native`   | `ReactNativeWeb >=0.8 ? 'css' : 'native'` | Specify how web styles are outputted. |

## Advanced options

| Prop     | Values                   | Default     | Description                                                 |
| -------- | ------------------------ | ----------- | ----------------------------------------------------------- |
| platform | Override the Platform.OS | Platform.OS | Used to match platform media queries                        |
| style    | Compiled style object    | `undefined` | For manual injection via the [CLI](../guides/cli-native.md) |
| media    | Compiled media object    | `undefined` | For manual injection via the [CLI](../guides/cli-native.md) |
