# Nativewind Development Guide

## Version Context

This is **Nativewind v5** (main branch), targeting **Tailwind CSS v4**.
The stable version (v4, targeting Tailwind v3) lives on the `v4` branch.

## Project Overview

Nativewind v5 is a **thin wrapper** around [react-native-css](https://github.com/nativewind/react-native-css). It provides:

- A Tailwind CSS v4 plugin (`@map` variant) for mapping utilities to React Native props
- A `theme.css` with RN-specific defaults (fonts, elevation, ripple, tint, safe area)
- A Metro config helper (`withNativewind`)
- Custom utilities for RN-specific features (elevation, ripple, tint, corner)

Most of the heavy lifting (CSS compilation, babel transform, runtime styling) is done by `react-native-css`.

### Key Difference from v4

v4 was a multi-package monorepo (`packages/nativewind` + `packages/react-native-css-interop`). v5 is a **single package** that depends on `react-native-css` as a peer dependency.

## Architecture

```
Tailwind CSS v4 (via @tailwindcss/postcss)
    ↓
Nativewind plugin (src/plugin.tsx) adds @map variant
    → generates @nativeMapping directives for react-native-css
    ↓
theme.css provides RN-specific theme values
    (elevation, fonts, platform variants, custom utilities)
    ↓
react-native-css compiler processes CSS → React Native styles
    ↓
react-native-css babel plugin transforms JSX for className support
    ↓
react-native-css runtime applies styles reactively
```

### What Nativewind v5 Owns vs. Delegates

| Nativewind v5 | react-native-css |
|---------------|-----------------|
| Tailwind plugin (`@map` variant) | CSS compiler (lightningcss) |
| Theme CSS (fonts, elevation, etc.) | Babel plugin (import rewriting) |
| Metro config wrapper | Metro transformer |
| Custom RN utilities (ripple, tint) | Runtime styling engine |
| Test utilities | Component wrappers |

## Source Structure

```
src/
├── index.tsx          # Re-exports from react-native-css (styled, useCssElement, etc.)
├── babel.tsx          # Re-exports babel plugin from react-native-css/babel
├── metro.tsx          # withNativewind() — wraps react-native-css/metro
├── plugin.tsx         # Tailwind CSS v4 plugin (@map variant → @nativeMapping)
├── stylesheet.ts      # useColorScheme (deprecated)
├── test-utils.tsx     # render, renderSimple, renderCurrentTest helpers
└── __tests__/         # Tests for custom utilities (elevation, ripple, tint, platform)

theme.css              # Tailwind v4 theme: RN fonts, elevation scale, custom utilities
types.d.ts             # TypeScript ambient declarations
```

## Commands

```bash
yarn                     # Install dependencies
yarn build               # Build with react-native-builder-bob
yarn test                # Run tests (Jest)
yarn test:watch          # Watch mode
yarn typecheck           # TypeScript validation
yarn lint                # ESLint + Prettier
yarn release             # Publish via release-it (maintainers only)
```

### Example App

```bash
yarn example start       # Start Metro server
yarn example ios         # Build and run on iOS
yarn example android     # Build and run on Android
```

## Testing

- **Runner:** Jest with `jest-expo` preset
- **Config:** `.config/jest.config.cjs`
- **Convention:** Tests use `renderCurrentTest()` which auto-detects the className from the test name:
  ```typescript
  test("elevation-sm", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { elevation: 3 } },
    });
  });
  ```
- **Options:** `renderCurrentTest` supports `css`, `extraCss`, `theme`, `preflight`, `plugin`, `debug`
- **CSS compilation happens in tests** via `react-native-css/jest` — no separate build step needed

## Code Conventions

- TypeScript (strict mode, ESNext target)
- ESLint with typescript-eslint (strict + stylistic) and Prettier
- Import sorting via `@ianvs/prettier-plugin-sort-imports`
- Conventional commits: `feat:`, `fix:`, `refactor:`, `docs:`, `test:`, `chore:`
- Pre-commit hooks enforce linting and commit message format
- Node v22+ (see `.nvmrc`)
- Yarn 4 (not npm)

## Common Pitfalls

- **This is a thin wrapper** — most logic lives in `react-native-css`, not here. Don't add compiler or runtime code to this repo.
- **Yarn only** — npm is not supported
- **Tailwind v4 only** — uses `@tailwindcss/postcss` plugin system, not v3's `tailwind.config.js`
- **`@map` variant** is the key integration point — it generates `@nativeMapping` directives that `react-native-css` understands
- **`withNativewind` vs `withNativeWind`** — the capital-W version is deprecated
