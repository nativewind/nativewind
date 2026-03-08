---
name: add-test
description: Scaffold a test for a Tailwind utility or Nativewind feature following the project's testing conventions.
argument-hint: [css-class-or-feature]
allowed-tools: Read, Grep, Glob, Edit, Write
---

## Context

Nativewind v5 tests live in `src/__tests__/` and use the `renderCurrentTest()` helper from `src/test-utils.tsx`.

## Convention

The test name IS the className being tested. `renderCurrentTest()` auto-extracts it:

```typescript
import { renderCurrentTest } from "../test-utils";

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

For custom utilities that map to non-style props (like `elevation`, `tint`, `ripple`), the expected output includes those props directly:

```typescript
test("elevation-sm", async () => {
  expect(await renderCurrentTest()).toStrictEqual({
    props: {
      style: { elevation: 3 },
    },
  });
});
```

## Steps

1. **Identify the feature**: What CSS class or Nativewind feature needs testing? Use `$ARGUMENTS` as the starting point.

2. **Find existing tests**: Search `src/__tests__/` for similar tests to understand the pattern and where the new test should go.

3. **Determine expected output**: Figure out what React Native style the CSS class should produce. Check Tailwind docs, theme.css, and the react-native-css compiler if needed.

4. **Write the test**: Follow the exact convention above. Place it in the appropriate existing test file, or create a new one if it's a new category.

5. **Run the test**: Execute `yarn test` to verify it passes.
