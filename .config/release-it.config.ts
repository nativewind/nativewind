import type { Config } from "release-it";

export default {
  git: {
    commitArgs: ["--no-verify"],
  },
  github: {
    release: true,
  },
  plugins: {
    "@release-it/conventional-changelog": {
      preset: {
        name: "conventionalcommits",
        types: [
          { type: "feat", section: "Features" },
          { type: "fix", section: "Bug Fixes" },
          { type: "refactor", section: "Refactors" },
          { type: "perf", section: "Performance" },
        ],
      },
      infile: "CHANGELOG.md",
      header: "# Changelog",
    },
  },
} satisfies Config;
