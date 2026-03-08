---
name: add-test
description: Scaffold a test for a Tailwind utility or Nativewind feature following the project's testing conventions.
argument-hint: [css-class-or-feature]
allowed-tools: Read, Grep, Glob, Edit, Write
---

## Context

Nativewind v4 tests live in `packages/nativewind/src/__tests__/` and use the `renderCurrentTest()` helper from `packages/nativewind/src/test.tsx`.

## Convention

The test name IS the className being tested. `renderCurrentTest()` auto-extracts it:

```typescript
import { renderCurrentTest } from "../test";

describe("Feature Name", () => {
  test("class-name", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {
        style: { /* expected RN style */ },
      },
    });
  });
});
```

Tests can also check for invalid/unsupported properties:

```typescript
test("sr-only", async () => {
  const { props, invalid } = await renderCurrentTest();
  expect(props).toStrictEqual({
    style: { borderWidth: 0, height: 1, /* ... */ },
  });
  expect(invalid).toStrictEqual({
    properties: ["clip", "white-space"],
  });
});
```

## Steps

1. **Identify the feature**: What CSS class or Nativewind feature needs testing? Use `$ARGUMENTS` as the starting point.

2. **Find existing tests**: Search `packages/nativewind/src/__tests__/` for similar tests to understand the pattern and where the new test should go.

3. **Determine expected output**: Figure out what React Native style the CSS class should produce. Reference Tailwind v3 docs and the lightningcss compiler in `packages/react-native-css-interop/src/css-to-rn/`.

4. **Write the test**: Follow the exact convention above. Place it in the appropriate existing test file, or create a new one if it's a new category.

5. **Rebuild and run**: Execute `npm run build && npm test` — v4 requires a rebuild before testing.
