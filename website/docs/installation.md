# Detailed Installation

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

## 1. Install the dependancies

You will need to install both `tailwindcss-react-native` and `tailwindcss`

`tailwindcss` is not used during runtime so it can be added as a development dependancy.

<Tabs>
  <TabItem value="npm" label="NPM" default>

```
npm install tailwindcss-react-native
npm install --save-dev tailwindcss
```

  </TabItem>
  <TabItem value="yarn" label="Yarn">

```
yarn add tailwindcss-react-native
yarn add --dev tailwindcss
```

  </TabItem>
</Tabs>

## 2. Setup Tailwindcss

Tailwindcss requires a `tailwind.config.js` file with the content section configured to include the paths to all of your components and any other source files that contain Tailwind class names.

If you are not already familiar with Tailwind CSS, we recommend reading its [configuration documentation](https://tailwindcss.com/docs/configuration)

```js
// tailwind.config.js
module.exports = {
  content: [
    "./screens/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  // ...
};
```

## 3. Add the TailwindProvider

Add `TailwindProvider` at the top level of your application. The `TailwindProvider` creates the context for reactive styles and the atomic style objects.

```tsx
import { TailwindProvider } from "tailwindcss-react-native";

function MyAppsProviders({ children }) {
  return <TailwindProvider>{children}</TailwindProvider>;
}
```

## 4. Setup compilation

As `tailwindcss-react-native` targets multiple platforms & frameworks, it supports multiple ways to setup compilation. The next step is to follow one of the compilation guides in the sidebar.

If you are using a framework there are specific framework guides under the framework section.

If you are unsure what guide to use, we recommend [Babel](./compilation/babel.md) which has the smallest setup and best out-of-the-box experience.
