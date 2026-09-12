# Target and verification contract

Draft revision: Expo 57 RC0. The package pair is Nativewind 5.0.0-rc.0 and react-native-css 3.1.0-rc.0. Nativewind requires this exact engine RC. The tested Expo target is 57.0.22, React Native 0.86.3, React 19.2.3, Reanimated 4.5.1 and Worklets 0.10.1. Consumer CSS tooling is Tailwind and @tailwindcss/postcss 4.1.12 with lightningcss 1.30.1. These are pinned contract values, not a claim about today's latest releases.

The [RC installation guide](installation.md) and [compatibility notes](compatibility.md) are public companion documents in the same repository. They contain the setup, accepted defects, input domains and recovery guidance. End users do not need access to the private audit repository.

Before applying this skill, verify exact package availability and the project's environment. Native packages should be selected through Expo's installer. Preserve the project's package manager. Record the exact resolved versions in the migration report.

The accepted Reanimated Android cancellation issue is [10507](https://github.com/software-mansion/react-native-reanimated/issues/10507). Direct animation style removal can retain the final rotation. No experimental dependency patch is part of this RC. Report application exposure explicitly.

Before advertising this skill as verified, evaluate the complete downloadable folder in a fresh agent session against a minimal Expo v4 app, a Router app with custom theme and plugins, a workspace, and an app with mappings, variables, images, SVG, inputs and animations. Include a browser fixture for any claimed browser migration support. Record skill revision, model, input commit, output diff, exact registry package identities, native and browser assertions, preservation of unrelated edits, unsupported customization handling, interrupted migration handling, and a second invocation with no new edits. Structural skill validation is separate from those behavioral checks. Repeat the matrix before stable promotion with the stable package pair.
