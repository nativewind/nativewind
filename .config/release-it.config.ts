import type { Config } from "release-it";

export default {
  git: {
    commitArgs: ["--no-verify"],
  },
} satisfies Config;
