# Guida alla Migrazione da NativeWind v4 a v5

## Cambiamenti Principali

### 1. Configurazione Tailwind CSS

**v4 (Tailwind CSS 3):**
```js
// tailwind.config.js
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        custom: '#ff0000',
      },
    },
  },
};
```

**v5 (Tailwind CSS 4):**
```css
/* global.css o theme.css */
@theme {
  --color-custom: #ff0000;
}
```

In Tailwind CSS 4, la configurazione si fa direttamente nel CSS usando `@theme` invece di `tailwind.config.js`.

### 2. cssInterop → styled

**v4:**
```tsx
import { cssInterop } from 'nativewind';

cssInterop(Icon, {
  className: {
    target: 'style',
    nativeStyleToProp: {
      height: 'size',
      width: 'size',
    },
  },
});
```

**v5 (Opzione 1 - styled diretto):**
```tsx
import { styled } from 'nativewind';

styled(Icon, {
  className: {
    target: 'style',
    nativeStyleToProp: {
      height: 'size',
      width: 'size',
    },
  },
});
```

**v5 (Opzione 2 - Helper di compatibilità):**
```tsx
import { cssInterop } from 'nativewind/compat';

cssInterop(Icon, {
  className: {
    target: 'style',
    nativeStyleToProp: {
      height: 'size',
      width: 'size',
    },
  },
});
```

**Nota:** Se `nativeStyleToProp` non funziona, potrebbe essere un problema noto (Issue #1675) che richiede fix in react-native-css. L'helper `cssInterop` da `nativewind/compat` fornisce un'API simile a v4 per facilitare la migrazione.

### 3. className e style insieme

**v4:** Funzionava correttamente
**v5:** Attualmente non funziona (Issue #1647) - richiede fix in react-native-css

**Workaround temporaneo:**
```tsx
// Opzione 1: Usa solo className o solo style, non entrambi
<View className="bg-blue-500" style={{ padding: 10 }} /> // ❌ Non funziona
<View className="bg-blue-500 p-2" /> // ✅ Funziona

// Opzione 2: Usa l'helper mergeStyles (con warning)
import { mergeStyles } from 'nativewind/compat';
<View {...mergeStyles("bg-blue-500", { padding: 10 })} /> // ⚠️ Usa solo className
```

### 4. Safe Area Utilities

**v4 e v5:** Stessa sintassi
```tsx
<View className="pt-safe pb-safe" />
```

**Nota:** In v5 potrebbe non funzionare correttamente (Issue #1673). L'import è stato migliorato, ma potrebbe richiedere fix in react-native-css per supportare `env()` CSS functions.

### 5. Next.js 16 Support

**v5:** Ora supportato! ✅
```json
// tsconfig.json
{
  "compilerOptions": {
    "jsxImportSource": "nativewind"
  }
}
```

## Issue Conosciuti in v5

Vedi `CHANGELOG.md` per la lista completa degli issue noti che richiedono fix in react-native-css.

## Risorse

- [Documentazione NativeWind v5](https://www.nativewind.dev/v5)
- [Guida Migrazione Tailwind CSS 4](https://tailwindcss.com/docs/upgrade-guide)

