# Target and verification contract

Pinned revision: Expo 57 RC0. The package pair is Nativewind 5.0.0-rc.0 and react-native-css 3.1.0-rc.0. Nativewind requires this exact engine RC. The tested Expo target is 57.0.22, React Native 0.86.3, React 19.2.3, Reanimated 4.5.1 and Worklets 0.10.1. Consumer CSS tooling is Tailwind and @tailwindcss/postcss 4.1.12 with lightningcss 1.30.1. These are pinned contract values, not a claim about today's latest releases.

The [RC installation guide](installation.md) and [compatibility notes](compatibility.md) are public companion documents in the same repository. They contain the setup, accepted defects, input domains and recovery guidance. End users do not need access to the private audit repository.

Before applying this skill, verify exact package availability and the project's environment. Native packages should be selected through Expo's installer. Preserve the project's package manager. Record the exact resolved versions in the migration report.

The accepted Reanimated Android cancellation issue is [10507](https://github.com/software-mansion/react-native-reanimated/issues/10507). Direct animation style removal can retain the final rotation. No experimental dependency patch is part of this RC. Report application exposure explicitly.

The [mechanical evaluation scope](verification.md) records the executed fixture checks and limitations. When broadening support, independently evaluate minimal apps, Router/theme/plugins, workspaces and mappings/variables/inputs/images/animations on the new target. Include browser behavior and native runtime evidence for each support claim, preserve unrelated edits, inspect unsupported customizations and partial updates, verify rollback and repeat invocation. Record exact versions, input/output hashes and failed or unavailable checks. Repeat the matrix before stable promotion with the stable package pair.
