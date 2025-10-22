# Welcome to the Nativewind contributing guide

Thank you for your interest in contributing to Nativewind!

In this guide, you will get an overview of the contribution workflow from opening an issue to creating, reviewing, and merging a PR.

## New contributor guide

Use this documentation and [this diagram](https://link.excalidraw.com/l/398AFcdY0wd/4cHnU8Ilxw7) to gain an understanding of how Nativewind works and how to contribute to the project. Please note, This diagram is a work in progress.

## What can I contribute to?

Before delving deeper into the collaboration workflow, let's talk about what kind of contributions can be made. Make sure you've reviewed the above diagram to understand how various aspects of Nativewind function.

There are three main things you can usually contribute to:

- **Docs**: Anything that would improve the documentation for Nativewind (guides, installation instructions, API docs, core concepts, customizations, styling options, and/or even just typo corrections).

- **Onboarding**: Helping to make installation of Nativewind easier by turning static changes into predefined plugins.

- **Tests**: Nativewind has a pretty robust suite of tests. However, if you believe that we could benefit from an additional test or two that would meaningfully improve stability, please feel free to open a PR.

- **Bug fixes/reports**: If you think you've found a bug or some unexpected behavior in Nativewind or its dependencies, you're welcome to raise an issue and/or PR with a bug description and/or fix.

Ideas for improving architecture of Nativewind are always welcome, but we ask that you open a discussion with an overview of the proposed ideas first, in order to ensure a proper debate.

Be sure to follow the templates for new issues and pull requests, when applicable.

## Contribution workflow

This project uses npm, and should be run with Node.js on the latest available LTS version. Ensure you have them properly setup on your development environment before continuing.

### Opening an issue

When opening an issue, it's crucial to provide a reproduction of the problem to help us take action. We have created some templates to make this easier for you.

#### Reproduction Templates

- **StackBlitz template**: [Nativewind Test on StackBlitz](https://stackblitz.com/edit/nativewind-test?view=editor)
- **Create Expo Stack template**:
  - `npx rn-new@latest --nativewind` (Expo SDK 54 + Nativewind v4.1)
  - `npx rn-new@latest --nativewind --expo-router` (Expo SDK 54 + Expo Router v6 + Nativewind v4.1)
  - `npx rn-new@next --nativewind` (Expo SDK 54 + Nativewind v5)
  - `npx rn-new@next --nativewind --expo-router` (Expo SDK 54 + Expo Router v6 + Nativewind v5)

#### Steps to Follow

1. **Test with Inline Styles**: Before reporting an issue, ensure that your flex layout behaves as expected using inline styles (passing `StyleSheet` styles to the `style` prop). This helps to confirm that the issue is specific to Nativewind.

2. **Provide a Reproduction**: If you can get your styles working with inline styles but not with Nativewind, use one of the provided templates to create a reproduction of the issue:
   - **StackBlitz**: This is the preferred method as it allows us to respond more quickly.
   - **Create Expo Stack**: Use the provided commands to set up a reproducible example.

3. **Submit the Issue**: Include the link to your reproduction in the issue description. If no reproduction is provided for an issue that can be reproduced, we are likely not to look into the issue.

By following these steps, you help us understand and resolve issues more efficiently.

### Forking and cloning

For external contributors, the best way to make changes to the project is to fork the repository and clone it locally:

1. Fork the repository to your GitHub account: https://github.com/nativewind/nativewind/fork

2. Clone the forked repository locally:

```shell
$ git clone https://github.com/<YOUR_GITHUB_USERNAME>/nativewind

$ cd nativewind
```

3. Confirm that tests are passing
Prior to making changes of your own, you'll want to make sure that the project is properly configured and that all the tests are passing.

3a. Install the project dependencies

```shell
npm i
```

3b. Build the project locally

```shell
npm run build
```

3c. Run the test suite
We recommend installing the [Jest VSCode extension](https://marketplace.visualstudio.com/items?itemName=Orta.vscode-jest) to run the tests. Once installed, you should have Testing icon in your left-hand tool bar (it looks like a laboratory beaker).

Navigating to this tab will allow you to use a convenient GUI to run all the tests. Alternatively, you can run the tests using the following command:
```shell
npm run test
```

If this all works as expected, you can move on. Otherwise, open an issue on Github with your environment setup.

4. Checkout on a new branch, and start adding your changes:

```shell
git checkout -b <@YOUR_GITHUB_USERNAME>/<MEANINGFUL_DESCRIPTOR>
```

When you're ready to submit your changes, push your branch to your forked repository and open a pull request against the `next` branch of the source repository.

### Directory structure

The Nativewind source code can be found in the `packages/` directory. The `packages/nativewind` is a wrapper around [react-native-css](https://github.com/nativewind/react-native-css). The documentation and homepage are maintained in a separate repository at https://github.com/nativewind/website.

More information on how `react-native-css-interop` works is coming soon.

### Make your changes

Once you've made your changes and tested that it works locally, run the tests using `npm run test` in the root directory. You should also add a test to cover your own contribution, if relevant.

### Publishing a Release (Maintainers Only)

If you're a maintainer and need to publish a new version to npm, the project uses **release-it** for automated releases.

To publish a new version:

```shell
npm run release
```

This will:
1. Run the build and test suite (via the `prepublishOnly` hook)
2. Prompt you for the version bump type (`patch`, `minor`, `major`)
3. Update the version in `package.json`
4. Create a git commit and tag
5. Push changes and tags to GitHub
6. Publish the package to npm

Make sure you have:
- Proper npm authentication (`npm login`)
- Write access to the GitHub repository
- Publish permissions for the npm package

> [!NOTE]
> Contributors do not need to worry about releases - maintainers will handle version bumps and publishing to npm. Just focus on making your changes and opening a great pull request!

> **_TODO:_** Add template for pull requests and issues