import type { SharedValue } from "react-native-reanimated";
import type {
  InteropComponentConfig,
  StyleDeclaration,
  ExtractedAnimations,
  ExtractedTransition,
  ContainerRecord,
} from "../../types";
import type { Effect, Observable } from "../observable";
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
  normal: ProcessedStyleDeclaration[];
  inline?: ProcessedStyleDeclaration | ProcessedStyleDeclaration[];
  important: ProcessedStyleDeclaration[];
  props: Record<string, any>;
  variables?: Record<string, any>;
  containerNames?: false | string[];
  currentRenderAnimation: ExtractedAnimations;
  previousAnimation?: ExtractedAnimations;
  isWaitingLayout?: boolean;
  transition?: Required<ExtractedTransition>;
  sharedValues?: Map<string, SharedValue<any>>;
  animationNames?: Set<string>;
  styleLookup: Record<string, any>;
  styleTracking: ReducerTracking;
  declarationTracking: ReducerTracking;
};

export type ReducerTracking = {
  effect: Effect;
  guards: RenderingGuard[];
  previous?: any;
};

export type ProcessedStyleDeclaration = StyleDeclaration | Record<string, any>;

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
