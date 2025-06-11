import type { SharedValue } from "react-native-reanimated";

import { PLACEHOLDER_SYMBOL } from "../../shared";
import type {
  ContainerRecord,
  ExtractedAnimations,
  ExtractedTransition,
  InteropComponentConfig,
  RuntimeValueDescriptor,
  StyleDeclaration,
} from "../../types";
import type { Effect, Observable } from "../observable";
import { ShorthandSymbol } from "./resolvers/shared";
import type { VariableContextValue } from "./styles";

export type Callback = () => void;
export type GetInteraction = (
  type: "active" | "focus" | "hover",
  effect: Callback,
) => boolean;

export type ReducerAction =
  | { type: "new-declarations"; className: string | undefined | null }
  | { type: "rerender-declarations" }
  | { type: "styles" };

export type ReducerState = {
  className?: string | undefined | null;
  config: InteropComponentConfig;
  normal: StyleDeclaration[];
  important: StyleDeclaration[];
  inline?: Record<string, unknown> | Record<string, unknown>[];
  props: Record<string, any>;
  variables?: Record<string, any>;
  containerNames?: false | string[];
  currentRenderAnimation: ExtractedAnimations;
  previousAnimation?: ExtractedAnimations;
  isWaitingLayout?: boolean;
  transition?: Required<ExtractedTransition>;
  sharedValues?: Map<string, SharedValue<any>>;
  animationNames?: Set<string>;
  styleTracking: ReducerTracking;
  declarationTracking: ReducerTracking;
};

export type ReducerTracking = {
  effect: Effect;
  guards: RenderingGuard[];
  previous?: any;
};

export type Refs = {
  sharedState: SharedState;
  variables: VariableContextValue;
  containers: ContainerRecord;
  props: Record<string, any> | null;
};

export type SharedState = {
  initialRender: boolean;
  originalProps: Record<string, any> | null;
  props: Record<string, any> | null;
  animated: number;
  variables: number;
  containers: number;
  pressable: number;
  canUpgradeWarn: boolean;
  layout?: Observable<[number, number]>;
  hover?: Observable<boolean>;
  active?: Observable<boolean>;
  focus?: Observable<boolean>;
};

export type RenderingGuard = (refs: Refs) => boolean;

export type ShorthandResolveFn = (
  resolve: (
    state: ReducerState,
    refs: Refs,
    tracking: ReducerTracking,
    descriptor: RuntimeValueDescriptor | RuntimeValueDescriptor[],
    style?: Record<string, any>,
  ) => any,
  state: ReducerState,
  refs: Refs,
  tracking: ReducerTracking,
  descriptor: RuntimeValueDescriptor | RuntimeValueDescriptor[],
  style?: Record<string, any>,
) => ShorthandResult | undefined;

export type ShorthandResultArray = Array<
  readonly [string | readonly string[], any]
>;

export type ShorthandResult = ShorthandResultArray & {
  [ShorthandSymbol]: boolean;
};

export type Placeholder = { [PLACEHOLDER_SYMBOL]: boolean };
