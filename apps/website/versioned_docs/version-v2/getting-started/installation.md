import TabItem from "@theme/TabItem";
import Tabs from "@theme/Tabs";

import Install from "./_install.mdx";
import Tailwind from "./_tailwind.mdx";

# Installation

:::info

NativeWind works with both Expo and framework-less React Native projects but Expo provides a more streamlined experience.

**Web**: If you'd like to use Metro to bundle for a website or App Clip and you are **not** using Expo, you will need either Expo's Metro config `@expo/metro-config` or to manually use Tailwind CLI to generate a CSS file.

:::

<Tabs groupId="framework">
  <TabItem value="Expo SDK 50+" label="Expo SDK 50+">
    :::tip

      If you'd like to quickly setup a blank Expo project, you can use the following command:

      ```bash
      npx create-expo-stack@latest --blank
      ```

    :::
    
    ## Installation with Expo SDK 50+

    ### 1. Install NativeWind

    <Install framework="expo" />

    ### 2. Setup Tailwind CSS

    <Tailwind />

    ### 3. Add the Babel preset

    ```js title="babel.config.js"
    module.exports = function (api) {
    	api.cache(true);
      	return {
			presets: ['babel-preset-expo'],
			plugins: ['nativewind/babel'],
		};
    };
    ```

    ### 4. TypeScript (optional)

    Please follow the [TypeScript guide](./typescript).
  </TabItem>
  <TabItem value="Expo SDK 49" label="Expo SDK 49">

    ## Installation with Expo SDK 49

    ### 1. Install NativeWind

    <Install framework="expo" />

    ### 2. Setup Tailwind CSS

    <Tailwind />

    ### 3. Add the Babel preset

      ```js title="babel.config.js"
      module.exports = function (api) {
        api.cache(true);
        return {
          presets: [
            ["babel-preset-expo", { jsxImportSource: "nativewind" }],
          ],
          plugins: ['nativewind/babel']
        };
      };
      ```

    ### 4. TypeScript (optional)

    Please follow the [TypeScript guide](./typescript).
  </TabItem>
  <TabItem value="Framework-less" label="Framework-less">
    ## Installation with Framework-less React Native

    Before installing NativeWind, you will need to [initialize your project with the React Native Community CLI](https://reactnative.dev/docs/getting-started-without-a-framework).

    ### 1. Install NativeWind

    <Install framework="framework-less" />

    ### 2. Setup Tailwind CSS

    Run `npx tailwindcss init` to create a `tailwind.config.js` file

    Add the paths to all of your component files in your tailwind.config.js file.

    ```js title="tailwind.config.js"
    /** @type {import('tailwindcss').Config} */
    module.exports = {
      // NOTE: Update this to include the paths to all of your component files.
      content: ["./App.{js,jsx,ts,tsx}"],
      presets: [require("nativewind/preset")],
      theme: {
        extend: {},
      },
      plugins: [],
    }
    ```

    ### 3. Add the Babel preset

    ```diff title="babel.config.js"
    module.exports = {
    - pluginss: ['<existing plugins>'],
    + presets: ['<existing plugins>', 'nativewind/babel'],
    };
    ```

    ### 4. TypeScript
    By default, the React Native Community CLI includes TypeScript support. Subsequently, you will need to follow the [TypeScript guide](./typescript) to finish setting up NativeWind in your project.
  </TabItem>
  <TabItem value="Next.js" label="Next.js">
    ## Installation with Next.js
	NativeWind can be used in a Next.js project that is already configured to use Expo or framework-less React Native Web.

	## 1. Setup Tailwind CSS

	Simply configure Next.js as per [the Tailwind CSS Next.js setup guide](https://tailwindcss.com/docs/guides/nextjs)

	## 2. Add the NativeWind plugin

	NativeWind adds some extra Tailwind features such as platform variants. You will need to add the `nativewind/tailwind/css` if you use these features.

	```diff
	module.exports = {
    content: [
      './pages/**/*.{js,jsx,ts,tsx}',
    ],
    + plugins: [require('nativewind/tailwind/css')],
    theme: {
      extend: {},
    },
	}
	```

	## 3. Choose a compiler

	### Via SWC

	NativeWind does not yet have an SWC transformer. If you wish to use SWC you will need to wrap your components in `styled()`.

	### Via Babel

	As Next.js is compiling your styles, you can run the Babel plugin in 'transformOnly' mode.

	```diff
	// babel.config.js
	module.exports = {
    - plugins: [],
    + plugins: ['nativewind/babel', { mode: 'transformOnly' }],
	};
	```

	## 4. Common issues

	A common issue with Next.js is your styles are imported, but are being overridden by NativeWind. This is due to the order stylesheet imports.

	A simple fix is to simply make the Tailwind styles a higher specificity.

	```diff
	module.exports = {
    content: [
      './pages/**/*.{js,jsx,ts,tsx}',
    ],
    plugins: [require('nativewind/tailwind/css')],
    + important: 'html',
    theme: {
      extend: {},
    },
	}
	```

  </TabItem>
</Tabs>