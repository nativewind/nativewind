import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

// Conditions match by key, so a target naming a missing file fails outright.

const PACKAGE_ROOT = join(__dirname, "..", "..");

interface DeclaredTarget {
  readonly subpath: string;
  readonly condition: string;
  readonly target: string;
}

type ConditionTarget = readonly [conditionPath: string, target: string];

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const manifest: unknown = JSON.parse(
  readFileSync(join(PACKAGE_ROOT, "package.json"), "utf8"),
);

if (!isRecord(manifest)) {
  throw new Error("package.json is not an object");
}

const collectConditionTargets = (
  value: unknown,
  conditions: readonly string[] = [],
): readonly ConditionTarget[] => {
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
  // An empty list, from a manifest no longer read, would pass every check below.
  test("the manifest declares checked-in targets to verify", () => {
    expect(checkedInTargets.length).toBeGreaterThan(0);
  });

  test("the manifest declares build-output targets to verify", () => {
    expect(builtTargets.length).toBeGreaterThan(0);
  });

  test("every checked-in target exists", () => {
    expect(describeMissing(checkedInTargets)).toStrictEqual([]);
  });

  // CI and `prepublishOnly` both build first, so skipping here skips no release.
  const buildHasRun = existsSync(join(PACKAGE_ROOT, buildOutputDirectory));
  const testBuiltTargets = buildHasRun ? test : test.skip;

  testBuiltTargets("every build-output target exists", () => {
    expect(describeMissing(builtTargets)).toStrictEqual([]);
  });
});
