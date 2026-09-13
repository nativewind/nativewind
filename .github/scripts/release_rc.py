"""Publish a reviewed archive without rebuilding or changing the stable tag."""

import base64
import hashlib
import json
import os
from pathlib import Path
import re
import subprocess
import tarfile
import time
import urllib.error
import urllib.request


REGISTRY = "https://registry.npmjs.org"


def check(condition, message):
    if not condition:
        raise RuntimeError(message)


def validate_version(version):
    check(re.fullmatch(r"\d+\.\d+\.\d+-rc\.\d+", version), "Invalid RC version")


def verify_archive(archive, descriptor):
    data = archive.read_bytes()
    check(hashlib.sha256(data).hexdigest() == descriptor["sha256"], "Archive SHA256 mismatch")
    integrity = "sha512-" + base64.b64encode(hashlib.sha512(data).digest()).decode()
    check(integrity == descriptor["integrity"], "Archive integrity mismatch")
    with tarfile.open(archive) as tar:
        package = json.load(tar.extractfile("package/package.json"))
    check(package["name"] == descriptor["name"], "Wrong package")
    check(package["version"] == descriptor["version"], "Wrong version")
    check(package.get("peerDependencies", {}).get("react-native-css") == descriptor["engine"]["version"],
          "Expected the exact reviewed engine peer")
    for field in ("dependencies", "devDependencies", "peerDependencies", "optionalDependencies"):
        check(not any(value.startswith(("file:", "link:", "workspace:"))
                      for value in package.get(field, {}).values()), "Local dependency in archive")


def verify_registry(metadata, descriptor):
    check(metadata["name"] == descriptor["name"], "Registry package mismatch")
    check(metadata["version"] == descriptor["version"], "Registry version mismatch")
    check(metadata["dist"]["integrity"] == descriptor["integrity"], "Published version has different bytes")


def verify_latest(before, after):
    check(before.get("latest") == after.get("latest"), "The stable latest tag changed")


def registry_json(route, missing_ok=False, attempts=1):
    for attempt in range(attempts):
        try:
            request = urllib.request.Request(REGISTRY + route, headers={"Cache-Control": "no-cache"})
            with urllib.request.urlopen(request, timeout=60) as response:
                return json.load(response)
        except urllib.error.HTTPError as error:
            if error.code != 404:
                raise
            if attempt + 1 < attempts:
                print("Waiting for npm registry visibility...", flush=True)
                time.sleep(10)
                continue
            if missing_ok:
                return None
            raise


def wait_for_rc_tag(before, version, attempts=31):
    for attempt in range(attempts):
        after = registry_json("/-/package/nativewind/dist-tags")
        verify_latest(before, after)
        if after.get("rc") == version and after.get("preview") == version:
            return after
        if attempt + 1 < attempts:
            time.sleep(10)
    raise RuntimeError("RC tag is not visible after waiting for the registry")


def run(*args, cwd=None, env=None):
    subprocess.run(args, cwd=cwd, env=env, check=True)


def verify_consumer(root, work, descriptor):
    from consumer_rc import verify
    verify(work, descriptor)


def main():
    version = os.environ["RC_VERSION"]
    validate_version(version)
    root = Path(__file__).resolve().parents[2]
    descriptor = json.loads((root / ".github/releases" / (version + ".json")).read_text())
    check(descriptor["name"] == "nativewind" and descriptor["version"] == version, "Invalid release descriptor")
    check(descriptor["archive"] == "nativewind-" + version + ".tgz", "Invalid archive name")
    run("git", "merge-base", "--is-ancestor", descriptor["sourceCommit"], "HEAD", cwd=root)
    release = json.loads(subprocess.check_output(
        ["gh", "release", "view", version, "--json", "isDraft,isPrerelease,targetCommitish"], text=True))
    check(release["targetCommitish"] == descriptor["sourceCommit"], "Release targets different source")
    check(release["isPrerelease"], "Expected a GitHub prerelease")
    work = Path(os.environ["RUNNER_TEMP"]) / "rc-publication"
    work.mkdir(exist_ok=True)
    run("gh", "release", "download", version, "--pattern", descriptor["archive"], "--dir", str(work))
    archive = work / descriptor["archive"]
    verify_archive(archive, descriptor)
    engine = descriptor["engine"]
    check(engine["name"] == "react-native-css", "Wrong engine package")
    verify_registry(registry_json("/react-native-css/" + engine["version"]), engine)
    tag_route = "/-/package/nativewind/dist-tags"
    version_route = "/nativewind/" + version
    before = registry_json(tag_route)
    engine_tags_before = registry_json("/-/package/react-native-css/dist-tags")
    existing = registry_json(version_route, missing_ok=True)
    if existing is not None:
        verify_registry(existing, descriptor)
    receipt = {"descriptor": descriptor, "tagsBefore": before, "engineTagsBefore": engine_tags_before, "stage": "preflight-passed"}
    receipt_file = work / "publication.json"

    def save(stage):
        receipt["stage"] = stage
        receipt_file.write_text(json.dumps(receipt, indent=2) + "\n")

    save("preflight-passed")
    if os.environ.get("RC_PUBLISH") != "true":
        print("RC preflight passed; publication was not requested.")
        return
    if existing is None:
        run("npm", "publish", str(archive), "--tag", "rc-staging", "--access", "public",
            "--ignore-scripts", "--registry=" + REGISTRY, "--loglevel=warn")
    metadata = registry_json(version_route, attempts=31)
    verify_registry(metadata, descriptor)
    receipt["registry"] = metadata
    save("registry-integrity-verified")
    downloaded = work / "registry"
    downloaded.mkdir()
    run("npm", "pack", "nativewind@" + version, "--ignore-scripts", "--pack-destination",
        str(downloaded), "--registry=" + REGISTRY, "--loglevel=warn")
    verify_archive(downloaded / descriptor["archive"], descriptor)
    verify_consumer(root, work, descriptor)
    save("registry-consumer-passed")
    verify_latest(before, registry_json(tag_route))
    for tag in ("preview", "rc"):
        run("npm", "dist-tag", "add", "nativewind@" + version, tag, "--registry=" + REGISTRY)
    after = wait_for_rc_tag(before, version)
    receipt["tagsAfter"] = after
    receipt["engineTagsAfter"] = registry_json("/-/package/react-native-css/dist-tags")
    verify_latest(engine_tags_before, receipt["engineTagsAfter"])
    save("rc-published")
    run("gh", "release", "edit", version, "--draft=false", "--prerelease", "--latest=false")
    save("complete")


if __name__ == "__main__":
    main()
