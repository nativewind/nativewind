# Come Usare NativeWind v5 dal Fork

Questa guida spiega come usare la versione aggiornata di NativeWind v5 compilata dal fork.

## Installazione dal Fork GitHub

### Opzione 1: Installazione Diretta da GitHub

```bash
npm install g97iulio1609/nativewind#v5
# oppure
yarn add g97iulio1609/nativewind#v5
# oppure
pnpm add g97iulio1609/nativewind#v5
```

### Opzione 2: Installazione da Branch Specifico

```bash
npm install github:g97iulio1609/nativewind#v5
# oppure
yarn add github:g97iulio1609/nativewind#v5
```

### Opzione 3: Installazione Locale (per Testing)

Se vuoi testare la versione locale compilata:

```bash
# Nel progetto NativeWind
cd /Users/giulioleone/@nativewind
yarn build

# Nel tuo progetto
cd /path/to/your/project
npm install /Users/giulioleone/@nativewind
# oppure
yarn add /Users/giulioleone/@nativewind
```

## Verifica Installazione

Dopo l'installazione, verifica che la versione sia corretta:

```bash
npm list nativewind
# oppure
yarn list --pattern nativewind
```

Dovresti vedere:
```
nativewind@5.0.0
```

## Fix Inclusi in Questa Versione

Questa versione include i seguenti fix:

1. ✅ **#1670** - Next.js 16 jsx-dev-runtime support
2. ✅ **#1665** - React Native 0.82 setColorScheme compatibility
3. ✅ **#1667** - Windows ESM URL scheme error
4. ✅ **#1612** - TypeScript exports (typescript → types)
5. ✅ **#1673** - Safe area utilities import order (migliorato)
6. ✅ **#1647** - className e style compatibility helper
7. ✅ **#1675** - cssInterop to styled migration helper
8. ✅ **#1664** - Tailwind CSS 4 configuration documentation

## Nuove Funzionalità

### 1. Next.js 16 Support

```tsx
// tsconfig.json
{
  "compilerOptions": {
    "jsxImportSource": "nativewind"
  }
}
```

### 2. Migration Helpers

```tsx
// Per migrazione da v4
import { cssInterop, mergeStyles } from 'nativewind/compat';

// cssInterop helper
cssInterop(Icon, {
  className: {
    target: 'style',
    nativeStyleToProp: {
      height: 'size',
      width: 'size',
    },
  },
});

// mergeStyles helper (workaround per Issue #1647)
<View {...mergeStyles("bg-blue-500", { padding: 10 })} />
```

### 3. Metro Configuration

```js
// metro.config.js
const { getDefaultConfig } = require("@react-native/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);
module.exports = withNativeWind(config, { input: "./global.css" });
```

## Compatibilità

- ✅ React 19
- ✅ Next.js 16
- ✅ React Native 0.82+
- ✅ Windows (ESM compatibility)
- ✅ Tailwind CSS 4.1.11+
- ✅ Expo 54

## Note Importanti

1. **Peer Dependencies**: Assicurati di avere installato:
   - `react-native-css@3.0.0-preview.1`
   - `tailwindcss@>4.1.11`

2. **Build Step**: Il package è già compilato, ma se modifichi il codice sorgente, esegui:
   ```bash
   yarn build
   ```

3. **TypeScript**: I file di definizione TypeScript sono inclusi in `dist/typescript/`

## Problemi Noti

Alcuni issue richiedono ancora fix in `react-native-css`:
- Issue #1647: className e style insieme (workaround disponibile via `mergeStyles`)
- Issue #1659: Custom line-height values
- Issue #1640: prefers-color-scheme media query su iOS
- Issue #1669: Memory leak in VariableContextProvider
- Issue #1674: react-native-skia compatibility

Vedi `COMPLETE_ISSUES_ANALYSIS.md` per dettagli completi.

## Link Utili

- Repository Fork: https://github.com/g97iulio1609/nativewind
- Branch: `v5`
- PR Originale: https://github.com/nativewind/nativewind/pull/1677
- Migration Guide: `MIGRATION_GUIDE_V4_TO_V5.md`

