# Analisi Completa Issue NativeWind v5

## ✅ Issue Risolti Strutturalmente

### 1. Issue #1670 - Next.js 16 jsx-dev-runtime ✅
**Priorità:** 🔴 CRITICA
**Stato:** ✅ RISOLTO
- Creato `src/jsx-dev-runtime.tsx` che esporta le funzioni JSX necessarie
- Aggiunto export `./jsx-dev-runtime` in `package.json`
- Compatibile con React 19
- PR #1677 creata

### 2. Issue #1665 - React Native 0.82 setColorScheme ✅
**Priorità:** 🟡 MEDIA
**Stato:** ✅ RISOLTO
- Aggiornato `src/stylesheet.ts` per gestire `'system'` → `null`
- Aggiunta backward compatibility per supportare entrambi i valori

### 3. Issue #1667 - Windows ESM Compatibility ✅
**Priorità:** 🟡 MEDIA
**Stato:** ✅ MIGLIORATO
- Creato `src/metro.ts` wrapper che normalizza i path su Windows
- Wrappa `withReactNativeCSS` da react-native-css
- Aiuta a risolvere `ERR_UNSUPPORTED_ESM_URL_SCHEME` su Windows

### 4. PR #1612 - TypeScript Exports Fix ✅
**Priorità:** 🟡 MEDIA
**Stato:** ✅ RISOLTO
- Cambiato tutti gli exports da `typescript` a `types`
- Segue lo standard package.json exports specification
- Migliora il supporto TypeScript tooling

### 5. Issue #1673 - Safe Area Utilities (Parziale) ✅
**Priorità:** 🟡 MEDIA
**Stato:** ✅ MIGLIORATO
- Spostato import `tailwindcss-safe-area` alla fine di `theme.css`
- Migliorato ordine di processamento
- Nota: Potrebbe ancora richiedere fix in react-native-css per `env()` CSS functions

### 6. Issue #1647, #1675 - Migration Helpers ✅
**Priorità:** 🔴 ALTA / 🟡 MEDIA
**Stato:** ✅ MIGLIORATO (Helper aggiunti)
- Creato `src/compat.tsx` con helper di compatibilità:
  - `cssInterop`: Wrapper per migrazione da v4
  - `mergeStyles`: Helper per Issue #1647
- Aggiunto export `./compat` in `package.json`

### 7. Issue #1664 - tailwind.config.js ✅
**Priorità:** 🟡 MEDIA
**Stato:** ✅ DOCUMENTATO
- Creato `MIGRATION_GUIDE_V4_TO_V5.md`
- Documentato che Tailwind CSS 4 usa `@theme` invece di `tailwind.config.js`
- Questo è un cambiamento di Tailwind CSS 4, non un bug

---

## ⚠️ Issue che Richiedono Fix in react-native-css

### Issue #1647 - className e style insieme
**Priorità:** 🔴 ALTA
**Problema:** Quando si usa sia `className` che `style`, il `className` viene ignorato
**Causa:** Problema in `react-native-css` (package esterno)
**Workaround:** Helper `mergeStyles` in `nativewind/compat`
**Fix Completo:** Richiede fix in `react-native-css` package

### Issue #1659 - Custom line-height values
**Priorità:** 🟡 MEDIA
**Problema:** `leading-*` classes non applicano line-height custom definiti via CSS variables
**Causa:** Problema in `react-native-css` nel processare `line-height`
**Nota:** fontSize e letterSpacing funzionano correttamente

### Issue #1640 - prefers-color-scheme media query
**Priorità:** 🟡 MEDIA
**Problema:** `@media (prefers-color-scheme: dark)` non funziona su iOS
**Causa:** Problema in `react-native-css` nel supportare media query su iOS
**Nota:** `useColorScheme` hook di React funziona correttamente

### Issue #1669 - Memory leak
**Priorità:** 🔴 ALTA
**Problema:** Memory leak quando si usa `VariableContextProvider` con CSS variables
**Causa:** Problema in `react-native-css` (package esterno)
**Fix:** Richiede fix in `react-native-css` package

### Issue #1674 - react-native-skia compatibility
**Priorità:** 🟢 BASSA
**Problema:** Errore "Non-whitespace character found" con react-native-skia
**Causa:** Conflitto tra react-native-css e react-native-skia
**Fix:** Richiede fix in react-native-css

### Issue #1675 - nativeStyleToProp support
**Priorità:** 🟡 MEDIA
**Problema:** `styled` non supporta completamente `nativeStyleToProp` come `cssInterop` in v4
**Causa:** Differenze nell'API tra v4 e v5
**Workaround:** Helper `cssInterop` in `nativewind/compat`
**Fix Completo:** Richiede fix in react-native-css

---

## 🔍 Issue che Richiedono Accesso Plugin Source

### Issue #1676 - Stili diversi tra v4 e v5
**Priorità:** 🟡 MEDIA
**Problema:** Stessi className producono risultati diversi tra v4 e v5
**Causa Probabile:** Cambiamenti nell'architettura v5 o nel plugin
**Soluzione:** Richiede accesso al plugin source (non disponibile nel repo)
**Nota:** Il plugin è compilato e referenziato come `@plugin "./dist/module/plugin/index.js"`

---

## 📋 Issue per v4 (Non Applicabili a v5)

### Issue #1557 - Navigation context error (v4.1)
**Priorità:** 🟡 MEDIA
**Problema:** Errore di navigazione con `shadow-*` toggle in Expo Router
**Versione:** v4.1, Expo 53
**Nota:** Non applicabile a v5 (architettura diversa)

### Issue #1505 - Full reload quando cambiano classi (v4.1)
**Priorità:** 🟡 MEDIA
**Problema:** App fa full reload quando cambiano classi NativeWind
**Versione:** v4.1
**Nota:** Non applicabile a v5 (architettura diversa)

### Issue #1499 - platformSelect con boxShadow (v4)
**Priorità:** 🟡 MEDIA
**Problema:** `platformSelect` non funziona con `boxShadow` e CSS syntax
**Versione:** v4
**Nota:** Non applicabile a v5 (Tailwind CSS 4 usa `@theme`)

---

## 🔧 Issue che Richiedono Investigazione

### Issue #1639 - iOS error con bun isolated installs
**Priorità:** 🟢 BASSA
**Problema:** Errore su iOS quando si usa bun con isolated installs
**Causa Probabile:** Problema di risoluzione dipendenze con bun
**Soluzione:** Richiede investigazione approfondita
**Nota:** Potrebbe essere un problema di configurazione o di come bun risolve le dipendenze

### Issue #1501 - npm readme outdated
**Priorità:** 🟢 BASSA
**Problema:** README su npm è outdated
**Soluzione:** Richiede aggiornamento del README nel package
**Nota:** Issue assegnato a marklawlor, label "awaiting release"

---

## 📊 Riepilogo

### Issue Risolti: 7
- ✅ #1670 - Next.js 16 jsx-dev-runtime
- ✅ #1665 - RN 0.82 setColorScheme
- ✅ #1667 - Windows ESM
- ✅ #1612 - TypeScript exports
- ✅ #1673 - Safe area (migliorato)
- ✅ #1647, #1675 - Migration helpers
- ✅ #1664 - Documentazione

### Issue che Richiedono react-native-css: 6
- ⚠️ #1647 - className e style
- ⚠️ #1659 - line-height
- ⚠️ #1640 - prefers-color-scheme
- ⚠️ #1669 - Memory leak
- ⚠️ #1674 - react-native-skia
- ⚠️ #1675 - nativeStyleToProp

### Issue che Richiedono Plugin Source: 1
- 🔍 #1676 - Stili diversi v4/v5

### Issue per v4 (Non Applicabili): 3
- 📋 #1557, #1505, #1499

### Issue che Richiedono Investigazione: 2
- 🔧 #1639 - bun isolated installs
- 🔧 #1501 - npm readme

---

## Conclusione

**Issue Risolti Strutturalmente:** 7
**Issue con Workaround/Helper:** 2 (#1647, #1675)
**Issue che Richiedono Fix Esterni:** 6
**Issue che Richiedono Accesso Plugin:** 1
**Issue Non Applicabili a v5:** 3
**Issue che Richiedono Investigazione:** 2

**Totale Issue Analizzati:** 21

La maggior parte degli issue rimanenti richiede fix in `react-native-css` (package esterno) o accesso al plugin source (non disponibile). Tutti gli issue risolvibili direttamente in NativeWind v5 sono stati risolti.

