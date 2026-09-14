#!/usr/bin/env node
// Read-only inventory. Reads JSON/text only; never loads application modules.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const workflow = path.basename(path.dirname(path.dirname(fileURLToPath(import.meta.url))));
const target = { nativewind: '5.0.0-rc.0', 'react-native-css': '3.1.0-rc.0', expo: '57.0.22', react: '19.2.3', 'react-native': '0.86.3', 'react-native-reanimated': '4.5.1', 'react-native-worklets': '0.10.1', tailwindcss: '4.1.12', '@tailwindcss/postcss': '4.1.12', lightningcss: '1.30.1' };
const risks = [];
const add = (code, severity, action, evidence = []) => risks.push({ code, severity, action, evidence });
const exists = p => fs.existsSync(p);
const json = p => JSON.parse(fs.readFileSync(p, 'utf8'));
try {
  if (process.argv.length !== 3) throw new Error('Usage: node scripts/preflight.mjs /absolute/path/to/app');
  const root = fs.realpathSync(process.argv[2]);
  const manifest = json(path.join(root, 'package.json'));
  const declared = { ...manifest.devDependencies, ...manifest.dependencies };
  const ancestors = [];
  for (let dir = root; ; dir = path.dirname(dir)) {
    ancestors.push(dir);
    if (path.dirname(dir) === dir) break;
  }
  const lockNames = ['package-lock.json', 'npm-shrinkwrap.json', 'yarn.lock', 'pnpm-lock.yaml', 'bun.lock', 'bun.lockb'];
  const lockfiles = ancestors.flatMap(dir => lockNames.filter(n => exists(path.join(dir, n))).map(n => path.join(dir, n)));
  const workspaceRoots = ancestors.filter(dir => {
    try { return Boolean(json(path.join(dir, 'package.json')).workspaces) || exists(path.join(dir, 'pnpm-workspace.yaml')); } catch { return exists(path.join(dir, 'pnpm-workspace.yaml')); }
  });
  const packages = {};
  for (const name of [...Object.keys(target), 'react-native-css-interop']) {
    let installed = null;
    // Node-style ancestor lookup also handles hoisted deps and pnpm symlink entries.
    // Do not execute require(), import(), package exports, or app configuration.
    for (const dir of ancestors) {
      const candidate = path.join(dir, 'node_modules', name, 'package.json');
      if (!exists(candidate)) continue;
      try {
        const data = json(candidate);
        installed = { name: data.name, version: data.version, manifest: fs.realpathSync(candidate), peers: data.peerDependencies || {} };
        if (data.name !== name) add('installed-identity-mismatch', 'incompatible', 'Repair the resolved package identity before migration.', [name, installed]);
      } catch (e) { add('installed-manifest-unreadable', 'needs-review', 'Inspect the installed package manifest.', [candidate, e.message]); }
      break;
    }
    packages[name] = { declared: declared[name] ?? null, installed };
    if (installed && declared[name] && /^\d+\.\d+\.\d+(?:-[\w.]+)?$/.test(declared[name]) && declared[name] !== installed.version) add('manifest-install-drift', 'needs-review', 'Reconcile the manifest and installed identity before changing dependencies.', [name, declared[name], installed.version]);
    if (declared[name] && !installed) add('installed-version-unknown', 'needs-review', 'Resolve and inspect this package with the existing package manager; the declaration is not a resolved identity.', [name, declared[name]]);
  }
  const nw = packages.nativewind.installed?.version || packages.nativewind.declared || '';
  const exact = /^\d+\.\d+\.\d+(?:-[\w.]+)?$/;
  let route = /^4(?:\.|$)/.test(nw.replace(/^[~^]/, '')) ? 'v4-to-v5' : nw === '5.0.0-preview.4' ? 'preview-to-rc' : nw === target.nativewind ? 'rc-reconciliation' : 'unknown';
  if (!exact.test(nw)) add('starting-version-unresolved', 'needs-review', 'Confirm the exact starting version before choosing a migration route.', [nw]);
  if (route === 'unknown') add('unsupported-starting-route', 'needs-review', 'This starting version is outside the measured routes; diagnose before editing.', [nw]);
  if ((workflow === 'nativewind-preview-to-rc' && route === 'v4-to-v5') || (workflow === 'nativewind-v4-to-v5' && route === 'preview-to-rc')) add('wrong-workflow', 'needs-review', 'Use the skill for the detected starting version.', [workflow, route]);
  if (nw === target.nativewind) {
    const engine = packages['react-native-css'];
    if (engine.installed && engine.installed.version !== target['react-native-css'] || engine.declared && engine.declared !== target['react-native-css']) add('rc-engine-mismatch', 'incompatible', 'Repair Nativewind and its engine together to the exact RC pair before continuing.', [engine]);
    if (!engine.declared && !engine.installed) add('rc-engine-missing', 'incompatible', 'Declare and resolve the required react-native-css RC engine.');
    if (packages.nativewind.declared !== target.nativewind) add('rc-not-pinned', 'needs-review', 'Pin the exact target version in the manifest.', [packages.nativewind.declared]);
  }
  for (const [name, expected] of Object.entries(target).filter(([n]) => !['nativewind', 'react-native-css'].includes(n))) {
    const p = packages[name];
    if ((p.installed?.version || p.declared) !== expected) add('target-alignment-review', 'needs-review', 'Compare with the tested target; handle Expo SDK upgrades separately and use Expo alignment rather than forcing native versions.', [name, { expected, ...p }]);
  }
  const enginePeer = packages.nativewind.installed?.peers?.['react-native-css'];
  if (nw === target.nativewind && enginePeer && enginePeer !== target['react-native-css']) add('unexpected-engine-peer', 'incompatible', 'Inspect the installed Nativewind artifact and reconcile its peer contract.', [enginePeer]);
  if (workspaceRoots.length || manifest.workspaces) add('workspace-scope', 'needs-review', 'Inventory sibling consumers and shared config before removing dependencies; inspect Tailwind @source paths. This scan covers only the supplied app.', workspaceRoots);
  if (lockfiles.length !== 1) add('lockfile-ambiguity', 'needs-review', 'Confirm the authoritative lockfile and package manager before install.', lockfiles);
  const managers = [...new Set(lockfiles.map(p => path.basename(p).startsWith('pnpm') ? 'pnpm' : path.basename(p).startsWith('yarn') ? 'yarn' : path.basename(p).startsWith('bun') ? 'bun' : 'npm'))];
  if (manifest.packageManager && managers.length && !managers.includes(manifest.packageManager.split('@')[0])) add('package-manager-conflict', 'needs-review', 'Resolve packageManager and lockfile disagreement.', [manifest.packageManager, ...managers]);
  const ignored = new Set(['node_modules', '.git', '.expo', '.next', '.turbo', 'dist', 'build', 'coverage', 'Pods', '.gradle', 'generated', '__generated__']);
  const files = [], skipped = [], ui = [], findings = [];
  let entries = 0, bytes = 0, truncated = false;
  const scan = dir => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
      if (++entries > 20000) { truncated = true; return; }
      const full = path.join(dir, entry.name), rel = path.relative(root, full);
      if (entry.isSymbolicLink()) { skipped.push(rel); continue; }
      if (ignored.has(entry.name)) continue;
      if (/nativewind[-_]?ui/i.test(entry.name)) ui.push(rel);
      if (entry.isDirectory()) { scan(full); if (truncated) return; continue; }
      if (!entry.isFile() || !/\.(?:[cm]?[jt]sx?|css|json)$/.test(entry.name) || lockNames.includes(entry.name)) continue;
      const size = fs.statSync(full).size;
      if (size > 512000 || bytes + size > 20000000) { skipped.push(rel); continue; }
      bytes += size; files.push(rel);
      const source = fs.readFileSync(full, 'utf8');
      if (/(?:from\s*|import\s*\(|require\s*\(|import\s*)['"][^'"]*nativewind[-_]?ui/i.test(source)) ui.push(rel);
      const patterns = [
        ['legacy-api', /\b(?:cssInterop|remapProps|useUnstableNativeVariable|useColorScheme|nativeStyleToProp|vars)\b/g, 'Review callers and mappings; deprecated APIs are not automatically failures.'],
        ['legacy-directive', /@(?:cssInterop|react-native)\b/g, 'Resolve legacy directive intent; the RC rejects these directives.'],
        ['unsupported-prop-candidate', /\b(?:placeholderClassName|indicatorClassName|presentationClassName|cssInterop)\s*=/g, 'Inspect the component and replace unsupported native prop usage with a supported contract.'],
        ['statusbar-class-candidate', /<StatusBar\b[^>]*\bclassName\s*=/g, 'Inspect StatusBar styling; this native className mapping is unsupported.'],
        ['qualified-root-selector', /:root[.#][\w-]+/g, 'Check platform scope; qualified native root selectors are rejected.'],
        ['layered-tailwind-import', /@import\s+['"]tailwindcss['"]/g, 'Use the documented split Tailwind imports with unlayered utilities and verify React Native Web computed styles.'],
        ['v4-babel-or-interop', /nativewind\/babel|jsxImportSource["']?\s*:\s*['"]nativewind|react-native-css-interop/g, 'Review legacy setup and preserve unrelated Babel and workspace configuration.'],
      ];
      for (const [code, regex, action] of patterns) {
        const matches = [...source.matchAll(regex)].slice(0, 30).map(m => ({ file: rel, line: source.slice(0, m.index).split('\n').length, match: m[0] }));
        if (matches.length) { findings.push(...matches.map(m => ({ code, ...m }))); add(code, 'needs-review', action, matches); }
      }
      if (entry.name === 'postcss.config.cjs') add('postcss-cjs-discovery', 'needs-review', 'Expo 57 does not discover this filename; use the documented supported config and verify emitted CSS.', [rel]);
    }
  };
  scan(root);
  for (const name of Object.keys(declared)) if (/nativewind[-_]?ui/i.test(name)) ui.push(`package:${name}`);
  if (ui.length) add('nativewindui-boundary', route === 'v4-to-v5' ? 'incompatible' : 'needs-review', 'Confirm the NativewindUI component generation before proceeding. Nativewind 4 apps containing these templates must remain on Nativewind 4.2.6. In other routes, names alone cannot identify the template version; confirmed v4 templates block migration.', [...new Set(ui)]);
  if (truncated || skipped.length) add('scan-incomplete', 'needs-review', 'Inspect skipped paths separately. No symlink traversal or exhaustive source analysis was performed.', [{ truncated, skipped }]);
  const incompatible = risks.some(r => r.severity === 'incompatible');
  const report = { schemaVersion: 1, workflow, app: root, target, startingRoute: route, assessment: incompatible ? 'blocked-pending-repair-or-boundary-review' : 'inventory-complete-review-required', runtimeVerification: 'pending', verified: false, packageManager: manifest.packageManager || null, lockfiles, lockfileContentsValidated: false, workspaceRoots, packages, sourceInventory: { files, findings, nativewinduiEvidence: [...new Set(ui)], entries, bytes, truncated, skipped }, risks, limitations: ['Static heuristic inventory only; comments and custom wrappers can produce candidates, and aliases or generated code can hide usages.', 'No modules executed, packages installed, lockfile dependency graph validated, builds run, or rendering and interactions checked.', 'Installed identities use ancestor node_modules manifests; Yarn PnP and other virtual resolvers require package-manager inspection.', 'Target alignment differences require review, not an automatic conclusion of incompatibility. NativewindUI version needs source review.'] };
  process.stdout.write(JSON.stringify(report, null, 2) + '\n');
  process.exitCode = incompatible ? 2 : 0;
} catch (error) {
  process.stdout.write(JSON.stringify({ schemaVersion: 1, workflow, assessment: 'inventory-failed', runtimeVerification: 'pending', verified: false, error: error.message }, null, 2) + '\n');
  process.exitCode = 1;
}
