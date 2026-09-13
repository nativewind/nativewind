"""Exercise the exact package pair in an isolated Expo registry consumer."""

import json
import os
from pathlib import Path
import subprocess


CHECKS = r'''
const assert = require('node:assert/strict');
const fs = require('node:fs');
const {test} = require('node:test');

test('CommonJS and ESM tooling exports load', async () => {
  for (const specifier of ['nativewind/metro', 'nativewind/babel', 'react-native-css/compiler']) {
    assert.ok(require(specifier));
    assert.ok(await import(specifier));
  }
});

test('Babel adapter rewrites React Native imports', () => {
  const adapter = require('nativewind/babel');
  const output = require('@babel/core').transformSync(
    'import {View} from "react-native"; export {View};',
    {filename: 'fixture.js', configFile: false, babelrc: false, presets: [adapter.default ?? adapter]}
  );
  assert.match(output.code, /react-native-css\/components/);
});

test('Tailwind and the Nativewind theme compile into native declarations', async () => {
  const css = '@import "tailwindcss/theme.css" layer(theme);\n' +
    '@import "tailwindcss/utilities.css" layer(utilities) source(none);\n' +
    '@import "nativewind/theme";\n@source inline("w-[37px] h-[19px]");';
  const output = await require('postcss')([require('@tailwindcss/postcss')({base: process.cwd()})])
    .process(css, {from: 'consumer.css'});
  const sheet = require('react-native-css/compiler').compile(output.css).stylesheet();
  for (const [name, property, value] of [['w-[37px]', 'width', 37], ['h-[19px]', 'height', 19]]) {
    const rules = sheet.s.find(([selector]) => selector === name)?.[1];
    assert.ok(rules?.some(rule => rule.d?.some(declaration => declaration[property] === value)), name);
  }
  fs.writeFileSync('compiled-consumer.css', output.css);
});

test('Metro integrates the engine and generates included TypeScript declarations', () => {
  const {getDefaultConfig} = require('expo/metro-config');
  const {withNativewind} = require('nativewind/metro');
  const config = withNativewind(getDefaultConfig(process.cwd()));
  assert.ok(config.resolver.sourceExts.includes('css'));
  assert.match(fs.readFileSync('nativewind-env.d.ts', 'utf8'), /react-native-css\/types/);
  const ts = require('typescript');
  const file = ts.readConfigFile('tsconfig.json', ts.sys.readFile);
  const parsed = ts.parseJsonConfigFileContent(file.config, ts.sys, process.cwd());
  assert.ok(parsed.fileNames.some(name => name.endsWith('/nativewind-env.d.ts')));
});
'''


def verify(work, descriptor, archive=None):
    # An archive override is for the local rehearsal only. CI always installs npm versions.
    consumer = Path(work) / "consumer"
    consumer.mkdir()
    dependencies = {**descriptor["consumerDependencies"], "nativewind": descriptor["version"]}
    if archive:
        dependencies["nativewind"] = "file:" + str(Path(archive).resolve())
    (consumer / "package.json").write_text(json.dumps({
        "name": "nativewind-rc-registry-check", "private": True, "version": "0.0.0",
        "main": "index.js", "dependencies": dependencies,
    }, indent=2) + "\n")
    env = {key: value for key, value in os.environ.items()
           if key not in ("GH_TOKEN", "GITHUB_TOKEN", "NPM_TOKEN", "NODE_AUTH_TOKEN")}
    env.update(NODE_AUTH_TOKEN="", CI="1", EXPO_NO_TELEMETRY="1")

    def run(*args):
        subprocess.run(args, cwd=consumer, env=env, check=True)

    run("npm", "install", "--no-audit", "--no-fund", "--registry=https://registry.npmjs.org")
    lock = json.loads((consumer / "package-lock.json").read_text())
    for expected in (descriptor, descriptor["engine"]):
        name = expected["name"]
        installed = {key: value for key, value in lock["packages"].items()
                     if key.endswith("node_modules/" + name)}
        if list(installed) != ["node_modules/" + name]:
            raise RuntimeError("Expected one installed runtime for " + name)
        package = installed["node_modules/" + name]
        if package["version"] != expected["version"] or package["integrity"] != expected["integrity"]:
            raise RuntimeError("Installed package identity mismatch: " + name)
        if not (archive and name == "nativewind") and not package["resolved"].startswith(
                "https://registry.npmjs.org/" + name + "/-/"):
            raise RuntimeError("Package did not come from npm: " + name)
    installed_manifest = json.loads((consumer / "node_modules/nativewind/package.json").read_text())
    if installed_manifest["peerDependencies"]["react-native-css"] != descriptor["engine"]["version"]:
        raise RuntimeError("Nativewind does not require the exact engine")
    files = {
        "app.json": json.dumps({"expo": {"name": "Nativewind RC", "slug": "nativewind-rc", "web": {"bundler": "metro"}}}),
        "index.js": 'import {registerRootComponent} from "expo"; import App from "./App"; registerRootComponent(App);\n',
        "App.tsx": '''import {View, Text} from 'react-native';
import {styled, VariableContextProvider, useCssElement, useUnstableNativeVariable} from 'nativewind';
import './global.css';
export default function App() {return <View className="w-[37px] h-[19px]"><Text className="text-red-500">RC</Text></View>;}
void [styled, VariableContextProvider, useCssElement, useUnstableNativeVariable];
''',
        "global.css": '@import "tailwindcss";\n@import "nativewind/theme";\n',
        "postcss.config.js": 'module.exports = {plugins: {"@tailwindcss/postcss": {}}};\n',
        "babel.config.js": 'module.exports = {presets: ["babel-preset-expo"]};\n',
        "metro.config.cjs": '''const {getDefaultConfig} = require('expo/metro-config');
const {withNativewind} = require('nativewind/metro');
module.exports = withNativewind(getDefaultConfig(__dirname));
''',
        "expo-env.d.ts": '/// <reference types="expo/types" />\n',
        "tsconfig.json": json.dumps({"extends": "expo/tsconfig.base", "compilerOptions": {"target": "ESNext", "module": "ESNext",
            "moduleResolution": "Bundler", "jsx": "react-jsx", "strict": True, "skipLibCheck": True,
            "noEmit": True}, "include": ["App.tsx", "expo-env.d.ts"]}, indent=2),
        "registry.test.cjs": CHECKS,
    }
    for name, content in files.items():
        (consumer / name).write_text(content)
    run("node", "--test", "registry.test.cjs")
    run("node", "node_modules/typescript/bin/tsc", "--project", "tsconfig.json")
    run("node", "node_modules/typescript/bin/tsc", "--project", "tsconfig.json", "--module", "Node16", "--moduleResolution", "Node16")
    for platform in ("web", "ios", "android"):
        run("node", "node_modules/expo/bin/cli", "export", "--platform", platform,
            "--output-dir", "export-" + platform)
    (Path(work) / "consumer-verification.json").write_text(json.dumps({
        "packages": {"nativewind": descriptor["version"], "react-native-css": descriptor["engine"]["version"]},
        "source": "local-archive-rehearsal" if archive else "npm-registry",
        "singleEngine": True, "integrityVerified": True, "toolingTests": 4,
        "typescript": ["Bundler", "Node16"], "expoExports": ["web", "ios", "android"],
    }, indent=2) + "\n")
