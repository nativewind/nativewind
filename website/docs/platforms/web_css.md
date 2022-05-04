---
slug: /platform/web-css
sidebar_position: 3
---

# Web (CSS StyleSheets) 🔬

:::caution

CSS StyleSheets are currently in preview and require React Native Web 0.18 Preview. Please see this [Pull Request](https://github.com/necolas/react-native-web/pull/2248) for more information about installing React Native Web 0.18 Preview.
:::

The web is built on HTML and CSS, so it makes sense to use those technolgies when serving your application. Web (CSS StyleSheets) uses the HTML class atrribute & CSS stylesheet to style your components.

This method offers many advantages over Web with React Native StyleSheets:

- Improved performance
- CSS Media queries
- Smaller bundles
- Responsive ServerSideRendering
- Ability to cache styles, reducing client requests

## Setup

### Use a compatible compilation method

When targetting web with CSS StyleSheets you must be using a compilation method that can output a `.css` file. This can either be:

- A framework that supports PostCSS
- Tailwind CLI

### Enable preview features

You must enable preview features on the TailwindProvider

```diff
import { TailwindProvider } from 'tailwindcss-react-native'

function MyAppsProviders ({ children }) {
  return (
-   <TailwindProvider>{children}</TailwindProvider>
+   <TailwindProvider preview={true}>{children}</TailwindProvider>
  )
}
```

### Only use the Component API

```tsx
import { Text } from "react-native";
import { styled } from "tailwindcss-react-native";

const StyledText = styled(Text);

export function BoldText(props) {
  return <StyledText className="font-bold" {...props} />;
}
```
