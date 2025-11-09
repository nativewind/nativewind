# Analisi Issue Aperti Aggiuntivi per NativeWind v5

## Issue Potenzialmente Fixabili 🔧

### Issue #1665 - setColorScheme 'system' cambiato a 'unspecified' in RN 0.82
**Priorità:** 🟡 MEDIA
**Problema:** In React Native 0.82, `setColorScheme('system')` è stato cambiato a `setColorScheme(null)` o `unspecified`
**Causa:** Cambiamento in React Native 0.82
**Soluzione:** Aggiornare `src/stylesheet.ts` per gestire `null` invece di `'system'`
**File da modificare:** `src/stylesheet.ts`
**Stato:** ✅ FIXABILE

### Issue #1667 - ERR_UNSUPPORTED_ESM_URL_SCHEME su Windows
**Priorità:** 🟡 MEDIA
**Problema:** Errore su Windows quando si usa `withNativeWind` in metro.config.js
**Causa Probabile:** Problema con path resolution su Windows in ESM loader
**Soluzione:** Potrebbe richiedere fix nel file metro (non visibile nel src, probabilmente compilato)
**Stato:** ⚠️ RICHIEDE INVESTIGAZIONE - Il file metro.ts non è visibile nel src

---

## Issue che Richiedono Fix in react-native-css ⚠️

### Issue #1669 - Memory leak in VariableContextProvider
**Priorità:** 🔴 ALTA
**Problema:** Memory leak quando si usa `VariableContextProvider` con CSS variables
**Causa:** Problema in `react-native-css` (package esterno)
**Soluzione:** Richiede fix in react-native-css
**Stato:** ⚠️ RICHIEDE FIX IN react-native-css

### Issue #1659 - Custom line-height values not applied
**Priorità:** 🟡 MEDIA
**Problema:** `leading-*` classes non applicano line-height custom
**Causa Probabile:** Problema in react-native-css o nel plugin
**Soluzione:** Richiede fix in react-native-css o nel plugin
**Stato:** ⚠️ RICHIEDE FIX IN react-native-css

### Issue #1640 - @media (prefers-color-scheme: dark) non funziona con Expo 54
**Priorità:** 🟡 MEDIA
**Problema:** Media query per dark mode non funziona su iOS
**Causa Probabile:** react-native-css non supporta correttamente media query su iOS
**Soluzione:** Richiede fix in react-native-css
**Stato:** ⚠️ RICHIEDE FIX IN react-native-css

### Issue #1639 - iOS error con bun isolated installs
**Priorità:** 🟢 BASSA
**Problema:** Errore su iOS quando si usa bun con isolated installs
**Causa Probabile:** Problema di risoluzione dipendenze con bun
**Soluzione:** Richiede investigazione approfondita
**Stato:** ⚠️ RICHIEDE INVESTIGAZIONE

---

## Issue Chiusi o Non Applicabili

### Issue #1655 - inlineRem config option has no effect
**Stato:** Chiuso (wontfix)
**Nota:** Già chiuso come "wontfix"

### Issue #1637 - React native Modal breaks on v5
**Stato:** Chiuso
**Nota:** Già risolto

### Issue #1635 - Unable to resolve "nativewind/jsx-dev-runtime"
**Stato:** Chiuso
**Nota:** Risolto con il nostro fix per Issue #1670

---

## Riepilogo

**Issue Fixabili Direttamente:**
- ✅ Issue #1665 - setColorScheme update per RN 0.82

**Issue che Richiedono Fix Esterni:**
- ⚠️ Issue #1669 - Memory leak (react-native-css)
- ⚠️ Issue #1659 - line-height (react-native-css)
- ⚠️ Issue #1640 - prefers-color-scheme (react-native-css)
- ⚠️ Issue #1639 - bun isolated installs (investigazione necessaria)

**Issue da Investigare:**
- ⚠️ Issue #1667 - Windows ESM URL scheme (richiede accesso al file metro.ts)

