<div align="center">
<p align="center">
  <a href="https://nativewind.dev" target="_blank">
    <img src="./assets/logo.svg" alt="Tailwind CSS" width="70" height="70">
    <h1 align="center" style="color:red;">Nativewind</h1>
  </a>
</p>

[![npm version](https://img.shields.io/npm/v/nativewind)](https://www.npmjs.com/package/nativewind)
[![npm downloads](https://img.shields.io/npm/dw/nativewind)](https://www.npmjs.com/package/nativewind)
[![Github](https://img.shields.io/github/license/marklawlor/nativewind)](https://github.com/nativewind/nativewind)
[![Discord](https://img.shields.io/discord/968718419904057416?logo=discord&logoColor=ffffff&label=Discord&color=%235865F2)](https://discord.gg/ypNakAFQ65)
[![Twitter](https://img.shields.io/twitter/follow/nativewindcss?link=https%3A%2F%2Fx.com%2Ftailwindcss)](https://x.com/nativewindcss)

</div>
<br />

# About

Do you like using [Tailwind CSS](https://tailwindcss.com) to style your apps? This helps you do that in [React Native](https://reactnative.dev). Nativewind is **not** a component library, it's a styling library. If you're looking for component libraries that support Nativewind, [see below](https://github.com/nativewind/nativewind/tree/%40danstepanov/docs-v4.1?tab=readme-ov-file#what-if-im-looking-for-a-component-library-that-uses-nativewind).

Nativewind makes sure you're using the best style engine for any given platform (e.g. CSS StyleSheet or StyleSheet.create). Its goals are to to provide a consistent styling experience across all platforms, improving developer UX, component performance, and code maintainability.

Nativewind processes your styles during your application's build step and uses a minimal runtime to selectively apply reactive styles (eg changes to device orientation, light dark mode).

## Installation

If you have an existing project, [use these guides](https://www.nativewind.dev/docs/getting-started/installation) to configure Nativewind for your respective stack.

Alternatively, you can create a new pre-configured project via our Quickstart below.

## Quickstart

- [Create Expo Stack](https://rn.new): `npx rn-new@latest --nativewind`

## Features

- Works on **all** RN platforms, uses the best style system for each platform.
- Uses the Tailwind CSS compiler
- Styles are computed at **build time**
- Small runtime keeps your components fast
- **jsxImportSourceTransform** only wraps native components, making it lighter and such that the **className** prop is accessible inside your component
- Respects all tailwind.config.js settings, including **themes, custom values,** and **plugins**
- Support for
  - Custom CSS properties, aka **CSS Variables**
  - **Dark mode, arbitrary classes,** and **media queries**
  - **Animations** and **transitions**
  - **Container queries**
    - `container-type` and style-based container queries are not supported
  - Pseudo classes - **hover / focus / active** on compatible components
  - `rem` units
  - Theme functions and nested functions
  - React 18 Suspense API
  - Custom CSS
- Styling based on **parent state modifiers** - automatically style children based upon parent pseudo classes
  - Support for the `group` and `group/<name>` syntax
- **Children styles** - create simple layouts based upon parent class
- Fast and consistent style application via hot reload
  - Includes changes made to `tailwind.config.js`

[More details here](https://v2.nativewind.dev/blog/announcement-nativewind-v4#breaking-changes-from-v2)

## npm distribution tags
It's worth noting that we do not have Github branches that directly correlate to npm distribution tags. Instead, we deploy to specific npm tags either via automated Github actions (push to `main` -> publish to `next`) or manually (snapshots versions).
- **Release:** `latest`
  - You should use this version
- **Canary:** `canary`
  - You can use this version
  - Potentially less stable than latest but likely more robust
  - This version is currently out of date and will soon be updated to either v4.2 or v5.0
- **Experimental:** `next` tag
  - You probably shouldn't use this version
  - Undergoing testing to move to a release version
  - This version is currently out of date and needs to be updated to v5.0, work in progress
- **Bleeding Edge:** snapshot releases prefixed with `0.0.0-`
  - You should not use this version
  - Used internally for moving towards a `next` version

## Contribution

[See this guide](https://github.com/nativewind/nativewind/blob/main/contributing.md)

# FAQ

## When is v5 landing?
[Soon.](https://github.com/nativewind/nativewind/discussions/1422)

## Is it safe to use v4?
Yes.

## Is Nativewind moving to Expo?

No.

## Can we disable the change that was done recently to auto-add nativewind types using a setting or something? I already have the settings using `compilerOptions.types`, so I would like to disable the file generation.

Not at the moment. We've found this will cause a long term problem where people "forget" what their type config was doing. They then update their types and break the Nativewind ones. To combat this, we've copied the behavior from other major frameworks which is to handle their types separately from user specified ones.

In the future, we may add an option like `dangerouslyDisableTypeScriptGeneration` or something verbose to prevent people from using it. We are tired of solving TypeScript issues, particularly ones such as "my types were working and now they aren't."

## What happened to v3?

Similar to Valve, we don't like the number 3. Nah, we had a V3 but it was a bad idea and needed to be reworked so we dropped it and moved on to v4.

## What if I'm looking for a component library that uses Nativewind?

There are a number of different component libraries available that use Nativewind to achieve different results. You should pick the one that best suits your needs.

### [NativewindUI](https://nativewindui.com)

This multi-platform library focuses on achieving native feel for each individual platform using the familiar interface of Tailwind CSS.

### [React Native Reusables](https://rnreusables.com)

This open source library offers universal [shadcn/ui](https://ui.shadcn.com) via React Native. Use this as a foundation to develop your own high-quality component library.

### [gluestack](https://gluestack.io)

From the folks that brought you NativeBase, this library offers customizable cross-platform components designed to look & behave cleanly on every platform.

## What are the breaking changes from v2 to v4?

All breaking changes are [outlined here](https://www.nativewind.dev/blog/announcement-nativewind-v4#breaking-changes-from-v2).

## Documentation

Learn more on [our website](https://nativewind.dev).
<br />
<br />
<a href="https://vercel.com/oss">
  <img alt="Vercel OSS Program" src="https://vercel.com/oss/program-badge.svg" />
</a>