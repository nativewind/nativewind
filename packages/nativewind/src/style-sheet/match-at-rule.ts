import { match } from "css-mediaquery";
import { Platform } from "react-native";

interface MatchAtRuleOptions {
  rule: string;
  params?: string;
  width: number;
  height: number;
  orientation: OrientationLockType;
}

export function matchAtRule({
  rule,
  params,
  width,
  height,
  orientation,
}: MatchAtRuleOptions) {
  if (rule === "media" && params) {
    return match(params, {
      type: Platform.OS,
      "aspect-ratio": width / height,
      "device-aspect-ratio": width / height,
      width,
      height,
      "device-width": width,
      "device-height": width,
      orientation,
    });
  }

  return false;
}

export interface MatchChildAtRuleOptions {
  nthChild?: number;
  parentHover?: boolean;
  parentFocus?: boolean;
  parentActive?: boolean;
}

export function matchChildAtRule(
  rule: string,
  params = "",
  {
    nthChild = -1,
    parentHover = false,
    parentFocus = false,
    parentActive = false,
  }: MatchChildAtRuleOptions
) {
  if (
    rule === "selector" &&
    params === "(> *:not(:first-child))" &&
    nthChild > 1
  ) {
    return true;
  } else if (rule === "selector" && params === "(> *)") {
    return true;
  } else if (rule === "parent") {
    switch (params) {
      case "hover":
        return parentHover;
      case "focus":
        return parentFocus;
      case "active":
        return parentActive;
      default:
        return false;
    }
  }

  return false;
}
