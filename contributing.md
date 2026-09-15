# Contributing to Nativewind

Read [DEVELOPMENT.md](DEVELOPMENT.md) for architecture, source layout and testing conventions. Nativewind v5 is developed on `main` and integrates Tailwind CSS v4 with `react-native-css`. Stable Nativewind v4.2.7 uses Tailwind CSS v3 and lives on the `v4` branch.

Documentation is maintained in [nativewind/website](https://github.com/nativewind/website). The [stable docs](https://www.nativewind.dev/docs) cover v4; the [RC docs](https://www.nativewind.dev/v5) cover v5. Public application migration skills live in this repository's `skills/` directory, and contributor skills live in `.claude/skills/`.

## Report an issue

Include a minimal reproduction, exact resolved package versions, configuration, platform, OS version, build mode, expected behavior and actual behavior. Compare against direct React Native styles or Reanimated controls where relevant. Follow the issue template.

You can start a v4 reproduction with `npx rn-new@latest --nativewind` or a v5 reproduction with `npx rn-new@next --nativewind`. Add `--expo-router` when the issue involves Router. Generator tags can change; inspect the generated manifest and lockfile rather than assuming a particular Expo SDK or package pair.

For the v5 RC, follow [the published setup](docs/expo57-rc.md): Nativewind 5.0.0-rc.0 and react-native-css 3.1.0-rc.0 on the tested Expo 57 toolchain. Consult [the compatibility notes](docs/rc-compatibility.md) before treating unsupported CSS values as regressions. Preserve the reporter's original baseline when comparing versions.

## Develop a change

Fork and clone the repository, then use Node 22 from `.nvmrc` and the Yarn 4 version declared in `package.json`. For v5, run these commands from the repository root:

```sh
yarn
yarn build
yarn test
yarn typecheck
yarn lint
```

The v5 package lives in `src/`; it is not the v4 `packages/` monorepo. Compiler, runtime and import rewriting work generally belongs in [react-native-css](https://github.com/nativewind/react-native-css). Follow that repository's instructions when a change crosses the boundary.

Create a branch named `<YOUR_GITHUB_USERNAME>/<DESCRIPTOR>`. Use conventional commit subjects such as `fix:`, `docs:` or `test:`. Add regression coverage when a behavior change warrants it and run the affected tests plus required repository checks. Unit tests run against local source with installed dependencies; they are not independent tests of the published Nativewind package or proof of device behavior.

Open v5 pull requests against `main` and v4 fixes against `v4`. Explain the problem, resulting behavior, validation and any remaining limitations. Update related docs and skills when changing public APIs or setup. For website export changes, run `pnpm test:llm` and `pnpm build` in the website repository. Documentation changes do not require a package release.

## Publish a release

Publishing is handled by maintainers through [the release workflow](.github/workflows/release.yml). Contributors should not publish packages or change npm tags as part of an ordinary pull request.

The RC path requires the reviewed `rc-version`; `rc-publish` defaults to false for preflight. The workflow verifies publication guards, npm authentication and the reviewed artifact through `.github/scripts/release_rc.py`, then retains a publication receipt. Review [the release records](.github/releases/README.md) and workflow inputs before running it. Other release types use the configured `release-it` flow. Do not bypass RC verification by running the ordinary release command.
