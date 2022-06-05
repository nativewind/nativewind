import { match } from "css-mediaquery";
import { ColorSchemeName } from "react-native";
import { ComponentContext } from "./context/component";
import { DeviceMediaContext } from "./context/device-media";

interface MatchAtRuleOptions {
  rule: string;
  params?: string;
  hover: boolean;
  active: boolean;
  focus: boolean;
  platform: string;
  colorScheme: ColorSchemeName;
  componentInteraction: ComponentContext;
  deviceMediaContext: DeviceMediaContext;
}

export function matchAtRule({
  rule,
  params,
  hover,
  active,
  focus,
  componentInteraction,
  platform,
  colorScheme,
  deviceMediaContext: { width, height, orientation },
}: MatchAtRuleOptions) {
  // eslint-disable-next-line unicorn/prefer-switch
  if (rule === "pseudo-class") {
    switch (params) {
      case "hover":
        return hover;
      case "focus":
        return focus;
      case "active":
        return active;
      default:
        return false;
    }
  } else if (rule === "component") {
    switch (params) {
      case "hover":
        return componentInteraction.hover;
      case "focus":
        return componentInteraction.focus;
      case "active":
        return componentInteraction.active;
      default:
        return false;
    }
  } else if (rule === "media" && params) {
    return match(params, {
      "aspect-ratio": width / height,
      "device-aspect-ratio": width / height,
      type: platform,
      width,
      height,
      "device-width": width,
      "device-height": width,
      orientation,
      "prefers-color-scheme": colorScheme,
    });
  } else if (rule === "dynamic-style") {
    return true;
  }

  return false;
}

export interface MatchChildAtRuleOptions {
  nthChild: number;
  rule: string;
  params?: string;
  parentHover: boolean;
  parentFocus: boolean;
  parentActive: boolean;
}

export function matchChildAtRule({
  nthChild,
  rule,
  params,
  parentHover,
  parentFocus,
  parentActive,
}: MatchChildAtRuleOptions) {
  if (
    rule === "selector" &&
    params === "(> *:not(:first-child))" &&
    nthChild > 1
  ) {
    return true;
  } else if (rule === "selector" && params === "(> *)") {
    return true;
  } else if (rule === "component") {
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
