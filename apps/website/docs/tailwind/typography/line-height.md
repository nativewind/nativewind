import Compatibility from "../\_compatibility.mdx"
import Usage from "../\_usage.mdx"

# Line Height

## Usage

<Usage />

## Compatibility

React Native does not support the relative line height utilities due to lack of support for `em` units.

<Compatibility
supported={[
"leading-{n}",
"leading-[n]",
]}
none={[
"leading-none",
"leading-tight",
"leading-snug",
"leading-normal",
"leading-relaxed",
"leading-loose",
]}
/>
