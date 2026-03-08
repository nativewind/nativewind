# Nativewind Development Guide

## Version Context

This is **Nativewind v4 (stable)** on the `v4` branch, targeting **Tailwind CSS v3**.
The preview version (v5, targeting Tailwind v4) is developed on the `main` branch.

Tailwind v3 is a hard requirement — the codebase explicitly rejects Tailwind v4+.

## Project Overview

Nativewind brings Tailwind CSS to React Native. This monorepo contains two packages:

- **`packages/nativewind`** — Tailwind-specific integration layer (public API, Tailwind CLI forking, presets, Metro plugin)
- **`packages/react-native-css-interop`** — Core CSS-to-React-Native engine (compiler, babel plugin, Metro integration, runtime)

`nativewind` is a thin wrapper around `react-native-css-interop`. Most logic lives in the interop package.

## Architecture: CSS Pipeline

```
Tailwind CSS v3 config (tailwind.config.js)
    ↓
Tailwind CLI v3 (forked child process via packages/nativewind/src/metro/tailwind/v3/)
    ↓
Raw CSS output
    ↓
cssToReactNativeRuntime() in packages/react-native-css-interop/src/css-to-rn/
    (uses lightningcss to parse CSS into rules, keyframes, variables)
    ↓
Compiled stylesheet injected as global.__css_interop
    ↓
Babel plugin rewrites React.createElement → createInteropElement
    (packages/react-native-css-interop/src/babel-plugin.ts)
    ↓
Runtime resolves className → style objects via observable/reactive system
    (packages/react-native-css-interop/src/runtime/native/)
```

### Key Architectural Patterns

- **Observable/reactive system** (`runtime/observable.ts`) — custom reactivity for style updates (color scheme, media queries, animations)
- **Opaque styles** (`runtime/native/styles.ts`) — WeakMap-based metadata storage on style objects
- **Virtual modules** (Metro integration) — in dev, CSS modules are virtual (Haste-patched); in prod, written to `.cache/`
- **Platform switching** — `NATIVEWIND_OS` env var selects native vs web Tailwind preset at build time

## Key Directories

```
packages/nativewind/src/
├── __tests__/           # Feature tests (spacing, colors, layout, etc.)
├── metro/               # withNativeWind() Metro config, Tailwind CLI integration
│   └── tailwind/v3/     # Tailwind v3 CLI forking (child process)
├── tailwind/            # Tailwind presets (native.ts, web.ts, dark-mode, shadows, etc.)
├── index.tsx            # Public API (re-exports from react-native-css-interop)
├── test.tsx             # Test helpers (renderCurrentTest, render)
└── doctor.ts            # Installation verification

packages/react-native-css-interop/src/
├── __tests__/           # Compiler and runtime tests
├── css-to-rn/           # CSS compiler (lightningcss-based)
│   ├── index.ts         # Main compiler entry
│   ├── parseDeclaration.ts  # CSS prop → RN prop mapping
│   └── functions.ts     # CSS function parsing (var(), calc(), rgb(), etc.)
├── babel-plugin.ts      # JSX transform (createElement → createInteropElement)
├── metro/               # withCssInterop() Metro plugin, custom transformer
├── runtime/
│   ├── native/          # Native runtime (iOS/Android)
│   │   ├── api.ts       # cssInterop, remapProps implementation
│   │   ├── native-interop.ts  # Core interop logic
│   │   ├── styles.ts    # Style registry
│   │   ├── conditions.ts     # Media/container query evaluation
│   │   └── resolve-value.ts  # Runtime value resolution
│   └── web/             # Web runtime (simpler, uses browser CSS)
├── types.ts             # Core type definitions
└── shared.ts            # Shared symbols and utilities
```

## Commands

```bash
npm install              # Install dependencies
npm run build            # Build all packages (turbo)
npm run build:watch      # Watch mode
npm test                 # Run all tests (turbo + jest)
npm run dev              # Development mode
```

Build order is managed by Turbo: `react-native-css-interop` builds first, then `nativewind`.

## Testing

- **Runner:** Jest with `jest-expo` preset
- **Convention:** Tests in `__tests__/` directories, named `*.test.tsx`
- **Pattern:** Tests use `renderCurrentTest()` which auto-detects the className from the test name:
  ```typescript
  test("p-4", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { padding: 14.285714285714286 } },
    });
  });
  ```
- **Always rebuild before testing** — compiled output must be current

## Code Conventions

- TypeScript throughout, ESNext target
- ESLint with `@typescript-eslint`, `unicorn`, `prettier`, `@cspell`
- Changesets for version bumps
- PRs target the `next` branch

## Common Pitfalls

- **Two packages, one repo** — don't put compiler logic in `nativewind` (it belongs in `react-native-css-interop`)
- **Tailwind v3 only** — this codebase hardcodes Tailwind v3 support and will throw if it detects Tailwind v4
- **Metro transformer does NOT support fast refresh** — requires full rebuild on changes
- **Platform-specific files** — `.native.ts` and `.web.ts` extensions select platform code; don't assume one platform
- **Virtual modules in dev** — CSS isn't on disk during development; don't try to read generated CSS files
