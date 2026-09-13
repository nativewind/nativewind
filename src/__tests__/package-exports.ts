import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * Every path the manifest declares names a file that exists.
 *
 * An export condition matches on KEY PRESENCE, not on whether its target resolves, so a target that
 * names a missing file is `ERR_MODULE_NOT_FOUND` rather than a fallthrough to the next condition.
 * That makes a typo in one condition invisible to every consumer who does not enable it — which is
 * how `"./metro"`'s `source` target came to name `./src/metro.ts` for a module authored `.tsx`.
 */

const PACKAGE_ROOT = join(__dirname, "..", "..");

interface DeclaredTarget {
  readonly subpath: string;
  readonly condition: string;
  readonly target: string;
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const manifest: unknown = JSON.parse(
  readFileSync(join(PACKAGE_ROOT, "package.json"), "utf8"),
);

if (!isRecord(manifest)) {
  throw new Error("package.json is not an object");
}

/** Every leaf string under a condition tree, tagged with the conditions that reach it. */
const collectConditionTargets = (
  value: unknown,
  conditions: readonly string[] = [],
): readonly (readonly [string, string])[] => {
  if (typeof value === "string") {
    return [
      [conditions.length === 0 ? "(direct)" : conditions.join("."), value],
    ];
  }

  if (!isRecord(value)) {
    return [];
  }

  return Object.entries(value).flatMap(([condition, nested]) =>
    collectConditionTargets(nested, [...conditions, condition]),
  );
};

const exportsMap: unknown = manifest.exports;

const declaredTargets: readonly DeclaredTarget[] = [
  ...(["main", "module", "types"] as const).flatMap(
    (field): readonly DeclaredTarget[] =>
      typeof manifest[field] === "string"
        ? [{ subpath: field, condition: "(direct)", target: manifest[field] }]
        : [],
  ),
  ...(isRecord(exportsMap)
    ? Object.entries(exportsMap).flatMap(([subpath, value]) =>
        collectConditionTargets(value).map(
          ([condition, target]): DeclaredTarget => ({
            subpath: `exports["${subpath}"]`,
            condition,
            target,
          }),
        ),
      )
    : []),
];

/**
 * The build output directory, read from bob's own config rather than spelled again here — the split
 * below is "is this target checked in or generated", and bob is what decides that.
 */
const builderBobConfig: unknown = manifest["react-native-builder-bob"];
const buildOutputDirectory: string =
  isRecord(builderBobConfig) && typeof builderBobConfig.output === "string"
    ? builderBobConfig.output
    : "dist";

const isBuildOutput = ({ target }: DeclaredTarget): boolean =>
  target.replace(/^\.\//, "").startsWith(`${buildOutputDirectory}/`);

const checkedInTargets = declaredTargets.filter(
  (entry) => !isBuildOutput(entry),
);
const builtTargets = declaredTargets.filter(isBuildOutput);

const describeMissing = (
  targets: readonly DeclaredTarget[],
): readonly string[] =>
  targets
    .filter(({ target }) => !existsSync(join(PACKAGE_ROOT, target)))
    .map(
      ({ subpath, condition, target }) =>
        `${subpath} [${condition}] -> ${target}`,
    );

describe("package.json declares only reachable targets", () => {
  // Both censuses are derived from the manifest, so an `exports` map that stopped being read would
  // leave every assertion below vacuously true. These are what make that a failure.
  test("the manifest declares checked-in targets to verify", () => {
    expect(checkedInTargets.length).toBeGreaterThan(0);
  });

  test("the manifest declares build-output targets to verify", () => {
    expect(builtTargets.length).toBeGreaterThan(0);
  });

  test("every checked-in target exists", () => {
    expect(describeMissing(checkedInTargets)).toStrictEqual([]);
  });

  // Only meaningful once `yarn build` has run; CI builds before it tests, and `prepublishOnly`
  // builds before it publishes, so the case that matters is covered either way.
  const buildHasRun = existsSync(join(PACKAGE_ROOT, buildOutputDirectory));
  const testBuiltTargets = buildHasRun ? test : test.skip;

  testBuiltTargets("every build-output target exists", () => {
    expect(describeMissing(builtTargets)).toStrictEqual([]);
  });
});
