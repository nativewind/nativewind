#!/usr/bin/env python3
"""LLM judge for the Issue Reproduction workflow.

Reads captured evidence from `evidence/<platform>/*` plus the original issue
body, asks Claude to decide whether the bug reproduces, and writes the result
to $GITHUB_OUTPUT.

Environment variables:
  ANTHROPIC_API_KEY   Required.
  ISSUE_TITLE         Issue title (plain text).
  ISSUE_BODY_B64      Base64-encoded issue body.
  IOS_STATUS          Result of the `reproduce-ios` job, or `skipped`.
  ANDROID_STATUS      Result of the `reproduce-android` job, or `skipped`.
  GITHUB_OUTPUT       Provided by Actions.
"""

import base64
import json
import os
import pathlib
import re
import sys
import urllib.request


def read_tail(path: str, limit: int = 8000) -> str:
    try:
        data = pathlib.Path(path).read_text(errors="replace")
        return data[-limit:]
    except Exception:
        return ""


def read_head_and_tail(path: str, head: int = 6000, tail: int = 4000) -> str:
    """Return head + tail of a file with a marker between them. RN red-boxes
    and Hermes stack traces typically land near the start of the device log
    (right after JS evaluation begins), while crashes that kill the app land
    at the very end. Pure-tail sampling misses the startup ones entirely on
    a 5–6 MB unified log."""
    try:
        data = pathlib.Path(path).read_text(errors="replace")
        if len(data) <= head + tail:
            return data
        return data[:head] + "\n\n[… truncated middle …]\n\n" + data[-tail:]
    except Exception:
        return ""


# Lines worth surfacing verbatim regardless of where they appear in the log.
_INTERESTING = re.compile(
    r"(\bTypeError\b|\bReferenceError\b|\bSyntaxError\b|\bRangeError\b|"
    r"RCTRedBox|RCTFatal|\[runtime not ready\]|Invariant Violation|"
    r"Unhandled (?:JS )?Exception|Fatal (?:JS )?Exception|"
    r"react\.log:javascript|com\.facebook\.react\.log|"
    r"Hermes(?:Runtime|Inspector)?|jsi::JSError|"
    r"SIGABRT|SIGSEGV|EXC_BAD_ACCESS|"
    r"FATAL EXCEPTION|AndroidRuntime)",
    re.IGNORECASE | re.MULTILINE,
)

# Lines that look like Info.plist NSException* / ATS exception entries dumped
# by the unified log on app startup. They contain the word "Exception" but
# are not actual exceptions — strip them so the grep output starts with the
# real RN/Hermes error.
_NOISE = re.compile(
    r"\b(NSException(?:Allows|Domains|Minimum|Requires)\w*|"
    r"NSAllowsArbitraryLoads|NSAllowsLocalNetworking)\b"
)


def extract_errors(path: str, max_lines: int = 80) -> str:
    try:
        data = pathlib.Path(path).read_text(errors="replace")
    except Exception:
        return ""
    hits = [
        line for line in data.splitlines()
        if _INTERESTING.search(line) and not _NOISE.search(line)
    ]
    if not hits:
        return ""
    if len(hits) > max_lines:
        hits = hits[: max_lines // 2] + ["…"] + hits[-max_lines // 2 :]
    return "\n".join(hits)


def summarize_evidence(packet: dict) -> dict:
    """Build an at-a-glance, hard-to-miss summary of what was captured. The
    full text channels are still included for the judge to quote from, but
    this summary makes it impossible for the model to claim 'all channels
    are empty' when they aren't."""
    sizes = {k: len(v) for k, v in packet.items() if isinstance(v, str)}
    snapshot = packet.get("snapshot", "") + packet.get("snapshot_interactive", "")
    combined = "\n".join(
        packet.get(k, "") for k in (
            "snapshot", "snapshot_interactive", "app_console_tail",
            "logs", "log_errors_grep",
        )
    )
    flags = {
        "has_snapshot": bool(packet.get("snapshot")),
        "has_app_console": bool(packet.get("app_console_tail")),
        "has_device_log": bool(packet.get("logs")),
        "rn_redbox_observed": bool(
            re.search(r"RCTRedBox|\[runtime not ready\]|unsanitizedScriptURLString", combined)
        ),
        "js_error_observed": bool(
            re.search(
                r"\b(TypeError|ReferenceError|SyntaxError|RangeError|Invariant Violation)\b",
                combined,
            )
        ),
        "hermes_stack_observed": bool(
            re.search(r"jsi::JSError|hermes::\w+|at \w+\s*\(.*\.js:\d+", combined)
        ),
        "native_crash_observed": bool(
            re.search(r"SIGABRT|SIGSEGV|EXC_BAD_ACCESS|FATAL EXCEPTION|AndroidRuntime", combined)
        ),
        "missing_bundle_overlay": bool(
            re.search(r"No script URL provided|unsanitizedScriptURLString", combined)
        ),
    }
    return {"sizes": sizes, "flags": flags}


def main() -> int:
    issue_title = os.environ.get("ISSUE_TITLE", "")
    issue_body = base64.b64decode(os.environ["ISSUE_BODY_B64"]).decode("utf-8", "replace")

    platforms = []
    for plat in ("ios", "android"):
        status = os.environ.get(f"{plat.upper()}_STATUS", "skipped")
        if status == "skipped":
            continue
        packet = {
            "platform": plat,
            "build_status": status,
            "repro_status": read_tail(f"evidence/{plat}/status.txt", limit=512),
            "build_log_tail": (
                read_tail(f"evidence/{plat}/xcodebuild.log", limit=12000)
                or read_tail(f"evidence/{plat}/gradle.log", limit=12000)
            ),
            "snapshot": read_tail(f"evidence/{plat}/snapshot.txt"),
            "snapshot_interactive": read_tail(f"evidence/{plat}/snapshot-interactive.txt"),
            "logs": read_head_and_tail(f"evidence/{plat}/device.log"),
            "log_errors_grep": extract_errors(f"evidence/{plat}/device.log"),
            # The app's own stdout/stderr (RN red-box, Hermes stack trace,
            # native crash). Strongest signal for launch-time crashes.
            "app_console_tail": read_tail(f"evidence/{plat}/app.console.log", limit=12000),
            "agent_device_errors": read_tail(f"evidence/{plat}/agent-device.log", limit=4000),
            "agent_device_version": read_tail(f"evidence/{plat}/agent-device-version.txt", limit=200),
            "agent_device_commands": read_tail(f"evidence/{plat}/commands.jsonl", limit=4000),
        }
        packet["evidence_summary"] = summarize_evidence(packet)
        platforms.append(packet)
        # Surface the summary in the action log so we can grep it from CI.
        print(
            f"[judge] {plat} flags="
            + json.dumps(packet["evidence_summary"]["flags"]),
            flush=True,
        )

    prompt = (
        "You are a CI judge for the NativeWind project. A user filed a bug "
        "report and our CI tried to reproduce it on the platforms below.\n\n"
        "Decide whether the reported bug *actually reproduces* in the "
        "captured evidence. Treat these as runtime signal, in roughly this "
        "order of strength:\n"
        "  1. `app_console_tail` — the app's own stdout/stderr (RN red-box "
        "message, Hermes/JS stack trace, native crash).\n"
        "  2. `snapshot` / `snapshot_interactive` — the UI tree at capture "
        "time. A visible RN red-box (`RCTRedBox`, \"unsanitizedScriptURLString\", "
        "a JS stack trace, or any developer error overlay text) IS runtime "
        "evidence — quote the overlay text in `evidence`.\n"
        "  3. `log_errors_grep` (filtered error lines from the unified log) "
        "and `logs` (head+tail of device.log).\n"
        "  4. `build_log_tail` / `repro_status` — a build failure that "
        "matches the reported symptom is itself a reproduction.\n\n"
        "The bug reproduces when the captured evidence contains the described "
        "error message, stack trace, or visibly broken UI. The bug does NOT "
        "reproduce when the app launches normally and the described symptom "
        "is not observed. Classify as `inconclusive` when: the build failed "
        "for reasons unrelated to the reported issue (toolchain/SDK mismatch); "
        "the RN red-box says \"No script URL provided\" or similar bundler "
        "plumbing failures (we never ran the user JS, so we cannot judge); "
        "or the captured channels are empty/missing.\n\n"
        "Before judging, look at `evidence_summary.flags` for each platform. "
        "You may not claim a channel is empty if its size in "
        "`evidence_summary.sizes` is > 0; quote from the corresponding text "
        "field instead. A `true` value for `js_error_observed`, "
        "`rn_redbox_observed`, `hermes_stack_observed` or "
        "`native_crash_observed` is strong evidence the bug reproduced — "
        "check whether the surfaced error matches the reported one.\n\n"
        "Return STRICT JSON with this exact shape and nothing else:\n"
        '{\n'
        '  "verdict": "reproduced" | "cannot-reproduce" | "inconclusive",\n'
        '  "per_platform": [{"platform": "...", "verdict": "...", "evidence": "short quote or summary"}],\n'
        '  "summary": "1-3 sentence explanation suitable for a GitHub comment"\n'
        '}\n\n'
        f"## Issue title\n{issue_title}\n\n"
        f"## Issue body\n{issue_body}\n\n"
        f"## Captured evidence\n{json.dumps(platforms, indent=2)}\n"
    )

    req = urllib.request.Request(
        "https://api.anthropic.com/v1/messages",
        data=json.dumps({
            "model": "claude-sonnet-4-5",
            "max_tokens": 1024,
            "messages": [{"role": "user", "content": prompt}],
        }).encode(),
        headers={
            "x-api-key": os.environ["ANTHROPIC_API_KEY"],
            "anthropic-version": "2023-06-01",
            "content-type": "application/json",
        },
    )
    with urllib.request.urlopen(req, timeout=120) as r:
        resp = json.loads(r.read())

    text = resp["content"][0]["text"].strip()
    # Strip ```json fences if the model adds them.
    if text.startswith("```"):
        text = text.split("\n", 1)[1].rsplit("```", 1)[0].strip()
    parsed = json.loads(text)

    with open(os.environ["GITHUB_OUTPUT"], "a", encoding="utf-8") as f:
        f.write(f"verdict={parsed['verdict']}\n")
        f.write("summary<<JUDGE_EOF\n")
        f.write(parsed["summary"] + "\n")
        f.write("JUDGE_EOF\n")
        f.write("per_platform<<JUDGE_EOF\n")
        f.write(json.dumps(parsed["per_platform"]) + "\n")
        f.write("JUDGE_EOF\n")

    return 0


if __name__ == "__main__":
    sys.exit(main())
