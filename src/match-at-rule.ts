import { match } from "css-mediaquery";
import { ColorSchemeName } from "react-native";
import { ComponentContext } from "./context/component";
import { DeviceMediaContext } from "./context/device-media";

interface MatchAtRuleOptions {
  rule: string;
  params: string;
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
  if (rule === "pseudo-class" && params === "hover") {
    return hover;
  } else if (rule === "pseudo-class" && params === "focus") {
    return focus;
  } else if (rule === "pseudo-class" && params === "active") {
    return active;
  } else if (rule === "component" && params === "hover") {
    return componentInteraction.hover;
  } else if (rule === "component" && params === "focus") {
    return componentInteraction.focus;
  } else if (rule === "component" && params === "active") {
    return componentInteraction.active;
  } else if (rule === "media") {
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
  }
}

export interface MatchChildAtRuleOptions {
  nthChild: number;
  rule: string;
  params: string;
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
  } else if (rule === "component" && params === "hover") {
    return parentHover;
  } else if (rule === "component" && params === "focus") {
    return parentFocus;
  } else if (rule === "component" && params === "active") {
    return parentActive;
  }

  return false;
}
