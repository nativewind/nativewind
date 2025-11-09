# Analisi Issue e PR per NativeWind v5

## Obiettivo
Identificare gli issue e le PR necessari da risolvere per poter usare NativeWind v5 con:
- **Tailwind CSS 4**
- **React Native**
- **Next.js 16**
- **Expo ultima versione**

---

## 📋 ISSUE CRITICI DA RISOLVERE

### 1. **Issue #1670** - [V5] Error in Next 16: Module not found: Can't resolve 'nativewind/jsx-dev-runtime'
**Priorità: 🔴 CRITICA**

**Descrizione:**
Quando si aggiunge `"jsxImportSource": "nativewind"` al `tsconfig.json`, Next.js 16 restituisce un errore:
```
Module not found: Can't resolve 'nativewind/jsx-dev-runtime'
```

**Stato:** Aperto (creato il 2025-11-06)

**Link:** https://github.com/nativewind/nativewind/issues/1670

**Impatto:** Blocca completamente l'uso di NativeWind v5 con Next.js 16

---

### 2. **Issue #1423** - Package.json declares peer support for tailwind versions >3.3.0, which includes 4.x builds
**Priorità: 🟡 MEDIA**

**Descrizione:**
Il `package.json` dichiara `"tailwindcss": ">3.3.0"` come peer dependency, che include le build 4.x. Tuttavia, secondo la discussione in #1394, 4.x non è realmente supportato dalla libreria. Dovrebbe essere aggiornato a `"tailwindcss": "^3.3.0"`.

**Nota:** Nel branch v5, il `package.json` mostra già `"tailwindcss": ">4.1.11"` come peerDependency, quindi questo potrebbe essere già risolto per v5, ma va verificato.

**Stato:** Aperto (assegnato a marklawlor)

**Link:** https://github.com/nativewind/nativewind/issues/1423

**Impatto:** Potrebbe causare confusione sugli utenti che tentano di usare Tailwind CSS 4

---

### 3. **Issue #1557** - Navigation context error triggered by NativeWind `shadow-*` toggle in Expo Router (Expo 53)
**Priorità: 🟡 MEDIA**

**Descrizione:**
Errore di navigazione intermittente quando si usa NativeWind con Expo Router e React Navigation. L'errore si verifica quando si usa `shadow-*` utilities con toggle condizionale.

**Ambiente:**
- expo: 53.0.20
- expo-router: 5.1.4
- react-native: 0.79.5
- nativewind: ^4

**Stato:** Aperto (con label SDK 54, v4.1)

**Link:** https://github.com/nativewind/nativewind/issues/1557

**Impatto:** Problema con Expo Router che potrebbe influenzare anche versioni più recenti di Expo

---

## 🔧 PULL REQUEST DA VALUTARE/MERGE

### 1. **PR #1527** - Expo 52 update, outline classes, ESLint
**Priorità: 🟡 MEDIA**

**Descrizione:**
- Aggiornamento di Expo e dipendenze correlate alla versione 52
- Aggiunto supporto per proprietà `outline-*` da RN 0.77+
- Fix ESLint

**Stato:** Aperto (creato il 2025-07-16)

**Link:** https://github.com/nativewind/nativewind/pull/1527

**Nota:** Potrebbe essere obsoleto se serve supporto per Expo ultima versione (probabilmente 53+)

---

### 2. **PR #1525** - Return box shadow declaration
**Priorità: 🟢 BASSA**

**Descrizione:**
Fix per un bug che causa crash su Android quando si usa una classe box-shadow. Manca un return statement nel switch case di `parseDeclaration`.

**Stato:** Aperto

**Link:** https://github.com/nativewind/nativewind/pull/1525

**Impatto:** Bug fix importante per Android

---

### 3. **PR #1346** - fix: nativewind theme functions on web
**Priorità: 🟡 MEDIA**

**Descrizione:**
Fix per la funzione `platformSelect` quando viene eseguita su web. Usa la versione nativa quando `NATIVEWIND_OS` è impostato a `web`.

**Stato:** Aperto (assegnato a danstepanov, con label "backport to v4")

**Link:** https://github.com/nativewind/nativewind/pull/1346

**Impatto:** Importante per il supporto web/Next.js

---

## 📊 STATO ATTUALE DEL BRANCH V5

Dal `package.json` del branch v5:
- **tailwindcss**: `^4.1.11` (devDependency)
- **peerDependencies**: `tailwindcss: ">4.1.11"` ✅
- **expo**: `54.0.0-preview.6` (devDependency)
- **react-native**: `0.81.0` (devDependency)

**Conclusione:** Il branch v5 sembra già configurato per Tailwind CSS 4, ma ci sono problemi con Next.js 16.

---

## ✅ PRIORITÀ DI RISOLUZIONE

### Priorità 1 (Bloccanti):
1. **Issue #1670** - Fix per Next.js 16 jsx-dev-runtime
   - Questo è il problema più critico che blocca l'uso con Next.js 16

### Priorità 2 (Importanti):
2. **Issue #1557** - Fix per Expo Router navigation error
   - Potrebbe influenzare l'esperienza utente con Expo

3. **PR #1346** - Fix theme functions on web
   - Importante per il supporto web/Next.js

### Priorità 3 (Miglioramenti):
4. **PR #1527** - Expo 52 update (verificare se serve aggiornamento a versione più recente)
5. **PR #1525** - Box shadow fix per Android

---

## 🔍 ISSUE AGGIUNTIVI DA MONITORARE

- **Issue #1358** - `className` prop does not override default styles when using with `classnames` library
- **Issue #1521** - NativeWind styles using pnpm do not work (monorepo)
- **Issue #1374** - NativeWind Styling Not Working in NX Monorepo with Expo

---

## 📝 NOTE

1. Il branch v5 sembra già supportare Tailwind CSS 4 a livello di dipendenze
2. Il problema principale è con Next.js 16 e il jsx-dev-runtime
3. Potrebbero esserci problemi con Expo Router che vanno risolti
4. Alcune PR potrebbero essere obsolete se mirate a versioni precedenti di Expo

---

## 🎯 PROSSIMI PASSI RACCOMANDATI

1. **Risolvere Issue #1670** - Implementare il supporto per `nativewind/jsx-dev-runtime` per Next.js 16
2. **Verificare compatibilità Expo** - Testare con Expo SDK 53/54 e risolvere eventuali problemi
3. **Merge PR #1346** - Fix per theme functions su web
4. **Aggiornare PR #1527** - Se necessario, aggiornare per supportare Expo ultima versione
5. **Test completo** - Testare l'intera stack: Tailwind CSS 4 + React Native + Next.js 16 + Expo ultima versione

