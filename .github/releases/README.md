# RC publication

The Release & Publish to NPM action accepts `rc`, an exact RC version and a publication checkbox. Leaving publication unchecked runs authentication and archive preflight. Existing stable and preview releases continue to use release-it.

Each RC descriptor records its merged source commit, immutable archive checksums, exact engine identity and Expo consumer versions. The archive is attached to a draft GitHub prerelease targeting that source commit. The RC job publishes those exact bytes under `rc-staging`; it does not rebuild the library. An existing npm version is accepted only when its integrity matches.

The job downloads the registry archive and checks both hashes, then installs both exact RC versions in a fresh Expo consumer. It verifies one engine runtime, the exact peer requirement, CommonJS and ESM tooling exports, Babel import rewriting, Tailwind compilation, Metro integration, generated TypeScript declarations, TypeScript Bundler and Node16 resolution, and Expo exports for web, iOS and Android. These export checks supplement the completed device audit; they do not claim a new native device execution.

After verification, the job advances Nativewind `preview` and `rc`, checks that both libraries retain their previous `latest` tags, and publishes the GitHub prerelease. The engine version and tags are never written by this workflow. Registry propagation retries are bounded. A retry accepts only matching existing package bytes and repeats the consumer checks before completing tag promotion.

The existing repository `NPM_TOKEN` secret supplies publication access. Consumer checks run without publication credentials. The action retains its descriptor, registry metadata, tag snapshots and consumer verification receipt. Publication guards also run in ordinary PR CI.
