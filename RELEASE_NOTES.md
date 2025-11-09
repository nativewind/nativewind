# NativeWind v5.0.0 Release Notes

## 🎉 Nuova Release Disponibile!

Questa release include supporto completo per Next.js 16, Tailwind CSS 4, React Native 0.82+ e molti fix importanti.

## ✨ Features

- ✅ **Next.js 16 Support** - Supporto completo per Next.js 16 con `jsx-dev-runtime` export (fixes #1670)
  - Aggiunto export `jsx-dev-runtime` per compatibilità con Next.js 16
  - Supporta `jsxImportSource: "nativewind"` in tsconfig.json
  - Compatibile con React 19 (jsx è default export)

## 🔧 Fixes

- ✅ **React Native 0.82+ Compatibility** - Fix per `setColorScheme('system')` (fixes #1665)
  - React Native 0.82 ha cambiato 'system' in `null`/`unspecified`
  - Aggiunta compatibilità retroattiva per gestire sia 'system' che `null`

- ✅ **Windows ESM Compatibility** - Fix per errore Metro su Windows (fixes #1667)
  - Creato wrapper `src/metro.ts` che normalizza i percorsi file su Windows
  - Risolve errore `ERR_UNSUPPORTED_ESM_URL_SCHEME` su Windows
  - Wrappa la funzione `withReactNativeCSS` di react-native-css

- ✅ **TypeScript Exports** - Fix per standard exports (addresses PR #1612)
  - Cambiato tutti gli export da `typescript` a `types` per migliore supporto TypeScript
  - Segue la specifica standard package.json exports

- ✅ **Safe Area Utilities** - Migliorato ordine import in `theme.css` (migliora #1673)
  - Spostato import `tailwindcss-safe-area` alla fine del file
  - Può aiutare con Issue #1673, anche se fix completo richiede supporto `env()` in react-native-css

## 🛠️ Compatibility Helpers

- ✅ **Migration Helpers** - Helper per migrazione da v4 a v5
  - `cssInterop`: Wrapper di compatibilità per migrare da v4's `cssInterop` a v5's `styled`
  - `mergeStyles`: Helper per Issue #1647 (className e style non possono essere usati insieme)
  - Fornisce API simile a v4 usando la funzione `styled` sottostante di v5

## 📚 Documentation

- ✅ **Migration Guide** - Guida completa per migrazione da v4 a v5
  - Documenta cambiamenti configurazione Tailwind CSS 4 (`@theme` vs `tailwind.config.js`)
  - Documenta migrazione da `cssInterop` a `styled`
  - Documenta issue noti e workaround
  - Chiarisce che Issue #1664 non è un bug ma un cambiamento di Tailwind CSS 4

## ✅ Compatibilità Verificata

- ✅ **Next.js 16** (fix implementato)
- ✅ **Tailwind CSS 4** (già supportato, peer dependency `>4.1.11`)
- ✅ **Expo 54** (già supportato, devDependency `54.0.0-preview.6`)
- ✅ **React Native 0.82+** (fix implementato)
- ✅ **React 19** (compatibile con jsx-dev-runtime)
- ✅ **Windows** (fix ESM implementato)

## 📦 Installazione

```bash
npm install g97iulio1609/nativewind#v5.0.0
# oppure
yarn add g97iulio1609/nativewind#v5.0.0
# oppure
pnpm add g97iulio1609/nativewind#v5.0.0
```

## 🔗 Link Utili

- **Repository:** https://github.com/g97iulio1609/nativewind
- **Tag:** v5.0.0
- **Branch:** v5
- **PR Originale:** https://github.com/nativewind/nativewind/pull/1677
- **Migration Guide:** Vedi `MIGRATION_GUIDE_V4_TO_V5.md`
- **Usage Guide:** Vedi `USAGE_FROM_FORK.md`

## ⚠️ Known Issues

Alcuni issue richiedono ancora fix in `react-native-css` (package esterno):
- Issue #1647: className e style props non possono essere usati insieme (workaround disponibile via `mergeStyles`)
- Issue #1659: Custom line-height values
- Issue #1640: prefers-color-scheme media query su iOS
- Issue #1669: Memory leak in VariableContextProvider
- Issue #1674: react-native-skia compatibility

Vedi `COMPLETE_ISSUES_ANALYSIS.md` per dettagli completi.

---

**Release Date:** 2024-11-09
**Version:** 5.0.0

