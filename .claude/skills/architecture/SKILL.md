---
name: architecture
description: Explain the Nativewind v5 architecture, CSS pipeline, and key files. Use when a contributor wants to understand how the codebase works.
allowed-tools: Read, Grep, Glob
---

You are explaining the architecture of **Nativewind v5** to a contributor.

Start by reading `DEVELOPMENT.md` for the full architecture overview, then read `docs/expo57-rc.md` for the published RC pair and `docs/rc-compatibility.md` for platform and value limits. Supplement these with the current source code.

## How to explain

1. **Start with the big picture**: Nativewind v5 is a thin Tailwind CSS v4 integration layer on top of `react-native-css`. Most logic is NOT in this repo.

2. **Show the pipeline**: Walk through how a Tailwind class like `bg-red-500` goes from CSS to a React Native style, referencing the specific files involved:
   - `theme.css` — Tailwind v4 theme with RN-specific values
   - `src/plugin.tsx` — `@map` variant generates `@nativeMapping` directives
   - `src/metro.tsx` — `withNativewind()` wraps react-native-css's Metro config
   - `src/babel.tsx` — re-exports react-native-css's babel plugin
   - `src/index.tsx` — re-exports react-native-css's runtime API

3. **Clarify the boundary**: What belongs here vs. in react-native-css. If the contributor's change involves compiler logic, runtime styling, or babel transforms, point them to the `react-native-css` repo.

4. **Show relevant code**: Read the actual source files to illustrate points. The src/ is small enough to show most of it.

5. **Answer follow-up questions** by searching the codebase.

Keep v4 APIs separate from v5: `styled` returns a wrapper that callers must render; v4 global `cssInterop` and `remapProps` are not v5 exports. Read `src/index.tsx` and the pinned engine contract before describing an API. Explain import rewriting separately from runtime styling and distinguish compiler tests from device verification.
