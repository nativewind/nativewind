# Nativewind Development Guide

## Version Context

This is **Nativewind v5** (main branch), targeting **Tailwind CSS v4**.
The stable version (v4.2.7, targeting Tailwind v3) lives on the `v4` branch.
The published v5 target is Nativewind 5.0.0-rc.0 with exactly react-native-css 3.1.0-rc.0. Read [the release setup](docs/expo57-rc.md) and [compatibility limits](docs/rc-compatibility.md) before advising consumers. A preview version in the source manifest does not identify the current published consumer target.

## Documentation

- **v5 docs (release candidate):** https://www.nativewind.dev/v5
- **v4 docs (stable):** https://www.nativewind.dev/

The docs site is maintained in a separate repository: https://github.com/nativewind/website

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
react-native-css Babel plugin rewrites imports for className support
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
# Maintainers: see contributing.md and .github/workflows/release.yml for publishing
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
- **Options:** `renderCurrentTest` supports `css`, `extraCss`, `className`, `sourceInline`, `sourceFile`, `optimize`, `theme`, `preflight`, `plugin`, `debug`
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

## Agent guidance

Contributor skills live in `.claude/skills/`: `architecture`, `debug-nw`, `add-test` and `triage`. Application migration skills live in `skills/nativewind-v4-to-v5` and `skills/nativewind-preview-to-rc`; both include read only inventory scripts and measured verification limits. Update affected guidance when changing setup or public contracts. Keep historical evaluation versions intact and distinguish them from the current stable release.

The website repository generates `/llms.txt`, `/llms-full.txt`, their `/v5` equivalents and page Markdown endpoints from the documentation. Changes to shared MDX helpers must remain represented in those exports. Run its `pnpm test:llm` and `pnpm build` checks when changing that pipeline.
