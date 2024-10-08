import rnPackageJSON from "react-native/package.json";
import semver from "semver";

export const featureFlags = {
  transformPercentagePolyfill: "<0.75",
  mixBlendModeEnabled: ">=0.76",
  disableGapPercentageValues: "<0.75",
};

export type FeatureFlagStatus = Partial<
  Record<keyof typeof featureFlags, boolean>
>;

export const defaultFeatureFlags = Object.fromEntries(
  Object.keys(featureFlags).map((flag) => {
    return [flag, isFeatureEnabled(flag as keyof typeof featureFlags)];
  }),
);

export function isFeatureEnabled(key: keyof typeof featureFlags) {
  return semver.satisfies(rnPackageJSON.version, featureFlags[key]);
}
