## Overview

Ultimately all these libraries achieve mostly the same result. The difference is either philosophical or implementation details.

These are my notes I made before I created `tailwindcss-react-native` but they also help explain some of the differences.

## tailwind-rn

https://github.com/vadimdemedes/tailwind-rn

`tailwind-rn` requires you to manually run two extra processes while developing, `tailwind-cli` and `tailwind-rn`. These processes the styles and stores them via React context. This method has a couple of flaws

- The processes may run slower than your web application causing warnings/delays https://github.com/vadimdemedes/tailwind-rn/issues/154
- Requires custom setup of editor/IDE plugins
- Rerenders all components when a style has changed
- Does not support responsive SSR for web (cannot apply varients until hydration)

## react-native-tailwindcss

https://github.com/TVke/react-native-tailwindcss

- Same issues as `tailwind-rn`

## react-native-styled.macro

https://github.com/z0al/react-native-styled.macro

Uses babel macros to compile Tailwind selectors to RN Styles.

- Does not use Tailwind to compile styles
- Introduces a new API. Doesn't provide out of box support for varient values
- Uses a custom config file

## react-native-tailwind

https://github.com/MythicalFish/react-native-tailwind

- Only works with it's exported components

## tailwind-react-native

https://github.com/ajsmth/tailwind-react-native

- Same issues as `tailwind-rn`
- Introduces a new API. Doesn't provide out of box support for varient values

## react-native-tailwind-classnames

https://github.com/leobauza/react-native-tailwind-classnames

- Only works with StyledComponents

## react-native-tailwind-style

https://github.com/etc-tiago/react-native-tailwind-style

- Same issues as `tailwind-rn`

## tailwind-react-native-classnames

https://github.com/jaredh159/tailwind-react-native-classnames

- Same issues as `tailwind-rn`
