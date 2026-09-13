import base64
import hashlib
import io
import json
from pathlib import Path
import tarfile
import tempfile
import unittest
from unittest.mock import patch
from urllib.error import HTTPError

from release_rc import registry_json, validate_version, verify_archive, verify_latest, verify_registry, wait_for_rc_tag


class ReleaseGuards(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.archive = Path(self.temp.name) / "package.tgz"
        self.descriptor = {"name": "nativewind", "version": "5.0.0-rc.0", "engine": {"version": "3.1.0-rc.0"}}

    def pack(self, **metadata):
        package = {**self.descriptor, "peerDependencies": {"react-native-css": "3.1.0-rc.0"}, **metadata}
        data = json.dumps(package).encode()
        with tarfile.open(self.archive, "w:gz") as tar:
            entry = tarfile.TarInfo("package/package.json")
            entry.size = len(data)
            tar.addfile(entry, io.BytesIO(data))
        archive_bytes = self.archive.read_bytes()
        self.descriptor.update({
            "sha256": hashlib.sha256(archive_bytes).hexdigest(),
            "integrity": "sha512-" + base64.b64encode(hashlib.sha512(archive_bytes).digest()).decode(),
        })

    def test_engine_peer_must_be_exact(self):
        for peer in ("^3.1.0-rc.0", "3.0.7", "file:../engine.tgz"):
            with self.subTest(peer=peer):
                self.pack(peerDependencies={"react-native-css": peer})
                with self.assertRaisesRegex(RuntimeError, "exact reviewed engine"):
                    verify_archive(self.archive, self.descriptor)

    def test_both_candidate_tags_must_be_visible(self):
        before = {"latest": "4.2.6"}
        partial = {**before, "rc": "5.0.0-rc.0", "preview": "5.0.0-preview.4"}
        complete = {**partial, "preview": "5.0.0-rc.0"}
        with patch("release_rc.registry_json", side_effect=[partial, complete]):
            with patch("release_rc.time.sleep"):
                self.assertEqual(wait_for_rc_tag(before, "5.0.0-rc.0", attempts=2), complete)

    def test_only_exact_rc_versions_are_accepted(self):
        validate_version("5.0.0-rc.0")
        for version in ("5.0.0", "5.0.0-preview.0", "rc", "../../5.0.0-rc.0", "5.0.0-rc.0; npm publish"):
            with self.subTest(version=version), self.assertRaises(RuntimeError):
                validate_version(version)

    def test_reviewed_archive_passes(self):
        self.pack()
        verify_archive(self.archive, self.descriptor)

    def test_changed_archive_is_rejected_before_publication(self):
        self.pack()
        self.archive.write_bytes(self.archive.read_bytes() + b"unreviewed bytes")
        with self.assertRaisesRegex(RuntimeError, "SHA256"):
            verify_archive(self.archive, self.descriptor)

    def test_mismatched_integrity_is_rejected(self):
        self.pack()
        self.descriptor["integrity"] = "sha512-other"
        with self.assertRaisesRegex(RuntimeError, "integrity"):
            verify_archive(self.archive, self.descriptor)

    def test_different_package_or_version_is_rejected(self):
        for metadata in ({"name": "other-package"}, {"version": "5.0.0"}):
            with self.subTest(metadata=metadata):
                self.pack(**metadata)
                with self.assertRaises(RuntimeError):
                    verify_archive(self.archive, self.descriptor)

    def test_local_dependencies_are_rejected(self):
        for field in ("dependencies", "devDependencies", "peerDependencies", "optionalDependencies"):
            for dependency in ("file:../engine.tgz", "link:../engine", "workspace:*"):
                with self.subTest(field=field, dependency=dependency):
                    self.pack(**{field: {"react-native-css": "3.1.0-rc.0", "engine": dependency}})
                    with self.assertRaisesRegex(RuntimeError, "Local dependency"):
                        verify_archive(self.archive, self.descriptor)

    def test_retry_accepts_identical_registry_bytes(self):
        self.pack()
        metadata = {"name": self.descriptor["name"], "version": self.descriptor["version"],
                    "dist": {"integrity": self.descriptor["integrity"]}}
        verify_registry(metadata, self.descriptor)

    def test_registry_collision_is_rejected(self):
        self.pack()
        metadata = {"name": self.descriptor["name"], "version": self.descriptor["version"],
                    "dist": {"integrity": "sha512-other"}}
        with self.assertRaisesRegex(RuntimeError, "different bytes"):
            verify_registry(metadata, self.descriptor)

    def test_rc_tag_can_advance_without_changing_latest(self):
        verify_latest({"latest": "4.2.6"}, {"latest": "4.2.6", "rc": "5.0.0-rc.0", "preview": "5.0.0-rc.0"})

    def test_stable_tag_change_is_rejected(self):
        with self.assertRaisesRegex(RuntimeError, "latest"):
            verify_latest({"latest": "4.2.6"}, {"latest": "5.0.0-rc.0"})

    def test_new_registry_version_can_become_visible_after_404(self):
        missing = HTTPError("https://registry.npmjs.org/example", 404, "Not found", {}, None)
        with patch("release_rc.urllib.request.urlopen", side_effect=[missing, io.BytesIO(b'{"version":"5.0.0-rc.0"}')]) as fetch:
            with patch("release_rc.time.sleep") as sleep:
                self.assertEqual(registry_json("/example", attempts=3)["version"], "5.0.0-rc.0")
        self.assertEqual(fetch.call_count, 2)
        sleep.assert_called_once_with(10)

    def test_missing_version_retry_is_bounded(self):
        missing = HTTPError("https://registry.npmjs.org/example", 404, "Not found", {}, None)
        with patch("release_rc.urllib.request.urlopen", side_effect=missing) as fetch:
            with patch("release_rc.time.sleep") as sleep:
                with self.assertRaises(HTTPError):
                    registry_json("/example", attempts=3)
        self.assertEqual(fetch.call_count, 3)
        self.assertEqual(sleep.call_count, 2)

    def test_authentication_errors_are_not_retried_as_propagation(self):
        forbidden = HTTPError("https://registry.npmjs.org/example", 403, "Forbidden", {}, None)
        with patch("release_rc.urllib.request.urlopen", side_effect=forbidden):
            with patch("release_rc.time.sleep") as sleep:
                with self.assertRaises(HTTPError):
                    registry_json("/example", attempts=3)
        sleep.assert_not_called()

    def test_rc_tag_can_become_visible_after_stale_response(self):
        before = {"latest": "4.2.6"}
        after = {**before, "rc": "5.0.0-rc.0", "preview": "5.0.0-rc.0"}
        with patch("release_rc.registry_json", side_effect=[before, after]):
            with patch("release_rc.time.sleep") as sleep:
                self.assertEqual(wait_for_rc_tag(before, "5.0.0-rc.0", attempts=3), after)
        sleep.assert_called_once_with(10)

    def test_rc_polling_never_accepts_a_stable_tag_change(self):
        with patch("release_rc.registry_json", return_value={"latest": "5.0.0-rc.0", "rc": "5.0.0-rc.0", "preview": "5.0.0-rc.0"}):
            with patch("release_rc.time.sleep") as sleep:
                with self.assertRaisesRegex(RuntimeError, "latest"):
                    wait_for_rc_tag({"latest": "4.2.6"}, "5.0.0-rc.0")
        sleep.assert_not_called()


if __name__ == "__main__":
    unittest.main()
