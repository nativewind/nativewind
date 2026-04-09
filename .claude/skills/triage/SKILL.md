---
name: triage
description: Triage a Nativewind or react-native-css GitHub issue. Reads the issue, determines version/repo, creates a reproduction, tests against latest published and local HEAD, then drafts a comment.
argument-hint: <issue-number-or-url>
allowed-tools: Read, Grep, Glob, Bash, Write, Edit, Agent, WebFetch
---

You are triaging a GitHub issue for either **nativewind/nativewind** or **nativewind/react-native-css**. Your goal is to understand the issue, reproduce it, verify it against the latest releases and local HEAD, and draft a response.

## Project context

Before diving in, read the relevant project docs for architecture and conventions:

- **Nativewind v5**: Read `CLAUDE.md` and `DEVELOPMENT.md` in `/Users/dan/Developer/nativewind/nativewind/`
- **react-native-css**: Read `CLAUDE.md` and `DEVELOPMENT.md` in `/Users/dan/Developer/nativewind/react-native-css/`
- **Nativewind v4**: Read `CONTRIBUTING.md` and check test structure in `/Users/dan/Developer/nativewind/nativewind-v4/`

These docs describe the architecture, test conventions, commands, and common pitfalls for each project. Use them to inform your reproduction strategy and root cause analysis.

## Step 0: Parse the issue reference

Extract the issue number and repo from `$ARGUMENTS`. Accept formats like:
- `123` or `#123` (defaults to `nativewind/nativewind`)
- `nativewind/nativewind#123`
- `nativewind/react-native-css#123`
- A full GitHub URL like `https://github.com/nativewind/react-native-css/issues/45`

## Step 1: Read the issue

```bash
gh issue view <number> --repo <owner/repo> --json title,body,labels,state,comments,createdAt,author
```

Read the full output carefully. Pay attention to:
- **Title and description**: What is the reported problem?
- **Comments**: Any additional context, workarounds, or clarifications from the reporter or maintainers?
- **Labels**: Any existing version or area labels?
- **Code snippets, config files, or error messages** included in the issue

## Step 2: Determine repo and version context

### If filed on `nativewind/react-native-css`

react-native-css is a standalone CSS polyfill for React Native. It provides the CSS compiler (lightningcss-based), babel plugin (import rewriting), Metro transformer, and native runtime styling engine. It functions independently of Tailwind CSS but is the engine behind Nativewind v5. There is no v4 equivalent in this repo (v4's runtime was `react-native-css-interop`, which lives in the nativewind-v4 monorepo).

Read `DEVELOPMENT.md` in the react-native-css repo for the full architecture diagram and key directories. The issue likely involves one of these layers:
- **Compiler** (`src/compiler/`) if CSS parses/compiles incorrectly
- **Native runtime** (`src/native/`) if styles resolve incorrectly at runtime
- **Babel plugin** (`src/babel/`) if import rewriting fails
- **Metro transformer** (`src/metro/`) if bundling/transformation fails

| | react-native-css |
|---|---|
| Branch | `main` |
| npm package | `react-native-css` |
| npm tag | `@latest` |
| Local repo path | `/Users/dan/Developer/nativewind/react-native-css` |

### If filed on `nativewind/nativewind`

Figure out whether this is a **v4** or **v5** issue. Clues:
- `nativewind` version in their `package.json` (v4.x = v4, v5.x = v5)
- Presence of `tailwind.config.js` = v4 (v5 uses Tailwind CSS v4's `@tailwindcss/postcss`)
- Presence of `react-native-css-interop` = v4; `react-native-css` = v5
- Mention of `@import "nativewind/theme"` = v5
- If unclear, assume v5 (the active development branch) but note the ambiguity

| | Nativewind v4 (stable) | Nativewind v5 (preview) |
|---|---|---|
| Branch | `v4` | `main` |
| Tailwind | v3 | v4 |
| Runtime | `react-native-css-interop` | `react-native-css` |
| npm tag | `@latest` | `@preview` |
| Repro template | `npx rn-new@latest --nativewind` | `npx rn-new@next --nativewind` |
| Local repo path | `/Users/dan/Developer/nativewind/nativewind-v4` | `/Users/dan/Developer/nativewind/nativewind` |

## Step 3: Assess reproducibility

Before creating a reproduction, check if there is enough information:
- Is the problem clearly described?
- Are there code snippets showing the failing className, component, CSS, or config?
- Is there an error message or screenshot?

If the issue lacks critical details needed for reproduction, skip to Step 6 and draft a comment requesting more information. Tailor the ask to the repo:

**For nativewind issues:**
> Thanks for reporting this. To investigate, we need a minimal reproduction. Could you provide:
> - Your `package.json` dependencies (nativewind, react-native-css/react-native-css-interop, tailwindcss versions)
> - The specific className(s) or config causing the issue
> - A reproduction using `npx rn-new@latest --nativewind` (v4) or `npx rn-new@next --nativewind` (v5)

**For react-native-css issues:**
> Thanks for reporting this. To investigate, we need a minimal reproduction. Could you provide:
> - Your `react-native-css` version
> - The CSS and component code that triggers the issue
> - Expected vs. actual behavior

## Step 4: Create a reproduction

Create a minimal reproduction. The approach depends on the repo and what's being tested.

---

### react-native-css issues

Tests are organized by domain in `src/__tests__/` with three subdirectories: `native/`, `compiler/`, `babel/`. Before writing a test, read a few existing tests in the relevant subdirectory to match the conventions exactly.

**For native styling issues** (most common, e.g., wrong style output, className not working):

```typescript
// Create: src/__tests__/native/triage-<issue-number>.test.tsx
import { render, screen } from "@testing-library/react-native";
import { View } from "react-native-css/components/View";
import { registerCSS, testID } from "react-native-css/jest";

describe("Issue #<number>", () => {
  test("description of the problem", () => {
    registerCSS(`.my-class { /* the CSS from the issue */ }`);

    render(<View testID={testID} className="my-class" />);
    const component = screen.getByTestId(testID);

    // Log what we actually get
    console.log(JSON.stringify(component.props, null, 2));

    // Assert expected behavior
    expect(component.props).toStrictEqual({
      children: undefined,
      style: { /* expected styles */ },
      testID,
    });
  });
});
```

Run with: `cd /Users/dan/Developer/nativewind/react-native-css && yarn test src/__tests__/native/triage-<issue-number>.test.tsx`

**For compiler issues** (CSS parses wrong, wrong JSON output):

Read existing tests in `src/__tests__/compiler/` (e.g., `compiler.test.tsx`, `declarations.test.tsx`) to match the pattern. Compiler tests verify the JSON output structure from `compile()`.

Run with: `cd /Users/dan/Developer/nativewind/react-native-css && yarn test compiler`

**For babel issues** (import rewriting broken):

Read existing tests in `src/__tests__/babel/` which use `babel-plugin-tester`.

Run with: `cd /Users/dan/Developer/nativewind/react-native-css && yarn test babel`

**For runtime issues that need a full app:**
```bash
cd /Users/dan/Developer/nativewind/react-native-css/example
yarn example start:build  # Rebuilds library + starts Metro
```

---

### Nativewind v5 issues

**For CSS/styling issues** (in `/Users/dan/Developer/nativewind/nativewind`):

```typescript
// Create: src/__tests__/triage-<issue-number>.test.ts
import { renderCurrentTest, renderSimple } from "../test-utils";

describe("Issue #<number>", () => {
  test("<the-failing-classname>", async () => {
    // Use renderCurrentTest() if testing a single className (test name = className)
    const result = await renderCurrentTest();
    console.log(JSON.stringify(result, null, 2));
  });

  // Or use renderSimple() for more complex scenarios
  test("complex case", async () => {
    const result = await renderSimple({
      className: "<multiple classes here>",
      // css: "custom CSS if needed",
      // extraCss: "additional CSS",
    });
    console.log(JSON.stringify(result, null, 2));
  });
});
```

Run with: `yarn test src/__tests__/triage-<issue-number>.test.ts`

---

### Nativewind v4 issues

(in `/Users/dan/Developer/nativewind/nativewind-v4`):
Check the v4 test conventions first:
```bash
ls /Users/dan/Developer/nativewind/nativewind-v4/packages/nativewind/src/__tests__/
```
Then write a similar test following v4's patterns.

---

### For runtime/Metro/babel issues (any repo)

These are harder to reproduce with unit tests. Create a standalone project:

**v5 / react-native-css**: `npx rn-new@next --nativewind` in a temp directory
**v4**: `npx rn-new@latest --nativewind` in a temp directory

Then replicate the reporter's setup and config.

## Step 5: Verify against versions

Run the reproduction in two contexts:

### 5a. Latest published version

For test-based reproductions, this is what `yarn test` already does (uses installed dependencies).

For app-based reproductions, ensure the project uses the latest published version:
- react-native-css: `react-native-css@latest`
- Nativewind v4: `nativewind@latest`
- Nativewind v5: `nativewind@preview`

Record the result: does the issue reproduce? What's the actual vs. expected behavior?

### 5b. Local HEAD of the respective branch

For test-based reproductions in the repo itself, the tests already run against local source.

But consider whether the bug crosses repo boundaries:
- A Nativewind styling issue might actually be a `react-native-css` compiler bug
- A react-native-css issue might only surface when used with Nativewind's `@map` variant

Check recent commits for relevant changes:
```bash
# In the appropriate repo
git log --oneline -20
```

If the issue might be in a different repo than where it was filed, note that in your findings.

## Step 6: Draft a comment

Based on your findings, draft a GitHub issue comment. The tone should be helpful and direct. Include:

1. **Reproduction status**: Did you reproduce it? On which version(s)?
2. **Root cause** (if identified): Where the bug lives and why
3. **Scope**: Is this a Nativewind issue or a react-native-css issue? If filed in the wrong repo, say so.
4. **Workaround** (if any): A temporary fix the reporter can use
5. **Next steps**: What needs to happen to fix this (PR, upstream fix, config change)

If the issue is **not reproducible**, say so clearly and ask for more details.

If the issue is **already fixed** on HEAD but not published, mention that and suggest the user try the latest version or a canary build.

Format the comment as a markdown blockquote so Dan can review it before posting:

> **Reproduction result**
>
> [Your findings here]

## Step 7: Clean up

Remove any temporary test files you created:
```bash
# In whichever repo you created the test
rm src/__tests__/triage-<issue-number>.test.ts
rm src/__tests__/native/triage-<issue-number>.test.tsx
rm src/__tests__/compiler/triage-<issue-number>.test.tsx
```

Do NOT leave triage test files in either repo.

## Important notes

- **Never post the comment automatically.** Always present it to Dan for review.
- If the issue is clearly a duplicate, mention the original issue number.
- If the issue is filed in the wrong repo (e.g., a react-native-css bug filed on nativewind), note that and suggest transferring it.
- Be honest about what you can and cannot determine from the reproduction.
- When the issue spans both repos, test in both and note which repo owns the fix.
