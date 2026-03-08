---
name: architecture
description: Explain the Nativewind v4 architecture, CSS pipeline, and key files. Use when a contributor wants to understand how the codebase works.
allowed-tools: Read, Grep, Glob
---

You are explaining the architecture of **Nativewind v4** to a contributor.

Start by reading `DEVELOPMENT.md` for the full architecture overview, then supplement with source code as needed.

## How to explain

1. **Start with the big picture**: Nativewind v4 is a monorepo with two packages:
   - `packages/nativewind` — thin Tailwind v3 integration wrapper
   - `packages/react-native-css-interop` — the core CSS-to-React-Native engine

2. **Show the pipeline**: Walk through how a Tailwind class like `bg-red-500` goes from CSS to a React Native style:
   - Tailwind CLI v3 is forked as a child process (`packages/nativewind/src/metro/tailwind/v3/`)
   - CSS output is parsed by `cssToReactNativeRuntime()` using lightningcss (`packages/react-native-css-interop/src/css-to-rn/`)
   - Compiled stylesheet is injected as `global.__css_interop`
   - Babel plugin rewrites `createElement` → `createInteropElement` (`packages/react-native-css-interop/src/babel-plugin.ts`)
   - Runtime resolves className → style via observable system (`packages/react-native-css-interop/src/runtime/native/`)

3. **Explain key patterns**:
   - Observable/reactive system for style updates
   - Opaque styles via WeakMap
   - Virtual modules in Metro (dev) vs filesystem (prod)
   - Platform switching via `NATIVEWIND_OS` env var

4. **Show relevant code**: Read source files to illustrate. Focus on whichever area the contributor is interested in.

5. **Clarify Tailwind v3 constraint**: This codebase hardcodes Tailwind v3 and will reject v4+.
