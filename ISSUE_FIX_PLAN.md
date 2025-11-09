# Piano di Fix per NativeWind v5

## Issue Risolti ✅

### Issue #1670 - Next.js 16 jsx-dev-runtime
**Stato:** ✅ RISOLTO
- Creato `src/jsx-dev-runtime.tsx`
- Aggiunto export in `package.json`
- PR #1677 creata

---

## Issue da Risolvere 🔧

### Issue #1647 - className e style non funzionano insieme
**Priorità:** 🔴 ALTA
**Problema:** Quando si usa sia `className` che `style`, il `className` viene ignorato
**Causa Probabile:** Problema in `react-native-css` (package esterno)
**Soluzione:** 
- ✅ Aggiunto helper `mergeStyles` in `nativewind/compat` come workaround temporaneo
- ⚠️ Fix completo richiede fix in `react-native-css` package
**Nota:** Issue assegnato a marklawlor, 23 +1 reactions

### Issue #1673 - Safearea className non funziona
**Priorità:** 🟡 MEDIA
**Problema:** `pt-safe`, `pb-safe`, etc. non funzionano con className
**Causa Probabile:** 
- `tailwindcss-safe-area` usa `env(safe-area-inset-top)` che potrebbe non essere supportato da react-native-css
- L'import è stato spostato alla fine di `theme.css` per migliorare l'ordine di processamento
**Soluzione:** 
- ✅ Modificato: Spostato import `tailwindcss-safe-area` alla fine di `theme.css`
- ⚠️ Potrebbe ancora richiedere fix in react-native-css per supportare `env()` CSS functions

### Issue #1664 - tailwind.config.js non funziona
**Priorità:** 🟡 MEDIA
**Problema:** Non è possibile estendere stili usando `tailwind.config.js` come in v4
**Causa Probabile:** Tailwind CSS 4 ha cambiato il modo in cui funziona la configurazione - ora si usa `@theme` in CSS
**Soluzione:** 
- ✅ Documentato: Creata guida di migrazione (MIGRATION_GUIDE_V4_TO_V5.md)
- ⚠️ Nota: Tailwind CSS 4 usa `@theme` invece di `tailwind.config.js` - questo è un cambiamento di Tailwind CSS 4, non un bug

### Issue #1676 - Stili diversi tra v4 e v5
**Priorità:** 🟡 MEDIA
**Problema:** Stessi className producono risultati diversi tra v4 e v5
**Causa Probabile:** Cambiamenti nell'architettura v5 o in react-native-css
**Soluzione:** Richiede investigazione approfondita

### Issue #1675 - styled non funziona come in v4
**Priorità:** 🟡 MEDIA
**Problema:** `styled` in v5 non funziona come `cssInterop` in v4 per componenti con `nativeStyleToProp`
**Causa Probabile:** Differenze nell'API tra `cssInterop` (v4) e `styled` (v5)
**Soluzione:** 
- ✅ Aggiunto helper `cssInterop` in `nativewind/compat` per facilitare la migrazione
- ✅ Documentato nella migration guide
- ⚠️ Fix completo per `nativeStyleToProp` richiede fix in react-native-css

### Issue #1674 - Problema con react-native-skia
**Priorità:** 🟢 BASSA
**Problema:** Errore "Non-whitespace character found after end of conversion: \"%\"" quando si usa con react-native-skia
**Causa Probabile:** Conflitto tra react-native-css e react-native-skia
**Soluzione:** Richiede fix in react-native-css o workaround

---

## Note Importanti

1. **Architettura v5**: NativeWind v5 usa `react-native-css` come dipendenza esterna
2. **Plugin**: Il plugin è referenziato in `theme.css` come `@plugin "./dist/module/plugin/index.js"` ma il source non è visibile nel repo
3. **Tailwind CSS 4**: v5 supporta già Tailwind CSS 4 (`>4.1.11` come peerDependency)
4. **Expo 54**: v5 usa già Expo 54.0.0-preview.6

---

## Prossimi Passi

1. Investigare Issue #1673 (safearea) - potrebbe essere fixabile direttamente
2. Verificare se ci sono altri issue fixabili direttamente in NativeWind v5
3. Documentare gli issue che richiedono fix in react-native-css
4. Creare PR per i fix applicabili

