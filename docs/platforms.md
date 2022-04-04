## Platforms

### native

The `native` platform switches platform based upon the `NODE_ENV` environment variable. It uses `native-context` when `NODE_ENV === production` otherwise it defaults to `native-inline`

### native-context

The platform best suited for production environments. It compiles the entire applications styles and produces the smallest possible output. It shares these styles to components via a React context.

Feature | Included
------ | -------------
Small output | :heavy_check_mark: 
Hot module reload | :x: 
Requires external tooling | :x: 


```diff
- import { Text } from "react-native"
+ import { Text, StyleSheet } from "react-native"
- import { TailwindProvider } from "tailwindcss-react-native"
+ import { TailwindProvider, __useParseTailwind } from "tailwindcss-react-native"

export function Test() {
  return (
-   <TailwindProvider>
+   <TailwindProvider styles={__tailwindStyles} media={__tailwindMedia}>
-     <Text className="font-bold">Test</Text>
+     <Text style={__useParseTailwind("font-bold")}>Test</Text>
    </TailwindProvider>
  )
}

+ const __tailwindStyles = StyleSheet.create({ 'font-bold': { fontWeight: "700" }})
+ const __tailwindMedia = {}
```

### native-inline

The platform best suited for development environments. Produces larger output but works with hot-reload. Each file will generate it's own styles and provide them inline.

Feature | Included
------ | -------------
Small output | :x: 
Hot module reload | :heavy_check_mark: 
Requires external tooling | :x: 

```diff
- import { Text } from "react-native"
+ import { Text, StyleSheet } from "react-native"
+ import {  __useParseTailwind } from "tailwindcss-react-native"

export function Test() {
  return (
-   <Text className="font-bold">Test</Text>
+   <Text style={__useParseTailwind("font-bold", { styles: __tailwindStyles, media: __tailwindMedia})}>Test</Text>
  )
}

+ const __tailwindStyles = StyleSheet.create({ 'font-bold': { fontWeight: "700" }})
+ const __tailwindMedia = {}
```

### web

> `web` requires `react-native-web@0.18+` (currently in preview). Please see this [PR](https://github.com/necolas/react-native-web/pull/2248) for more info. If your are currently using `<=0.17` you can still use `native` for rendering within a browser.

The platform to use when using `react-native-web`. It leaves the className attribute as-is, allowing you to use CSS files for your styling. Because of this, you will need to follow the [TailwindCSS installation steps](https://tailwindcss.com/docs/installation) to include the nessessary `.css` files in your HTML.

Relies on external tooling for production minification.

Feature | Included
------ | -------------
Small output | :heavy_check_mark: 
Hot module reload | :heavy_check_mark: 
Requires external tooling | :heavy_check_mark: 

```diff
import { Text } from "react-native"

export function Test() {
  return (
-   <Text className="font-bold">Test</Text>
+   <Text style={{ $$css: true, tailwind: 'font-bold' }}>Test</Text>
  )
}
```
