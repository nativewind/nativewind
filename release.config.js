const branch = process.env.GITHUB_REF_NAME;

const config = {
  branches: ["main", { name: "next", prerelease: true }],
  plugins: [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
  ],
};

if (
  config.branches.some(
    (it) => it === branch || (it.name === branch && !it.prerelease)
  )
) {
  config.plugins.push("@semantic-release/changelog", [
    "@semantic-release/git",
    {
      assets: ["CHANGELOG.md"],
      message:
        "chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}",
    },
    "@semantic-release/github",
  ]);
}

config.plugins.push("@semantic-release/npm");

module.exports = config;
