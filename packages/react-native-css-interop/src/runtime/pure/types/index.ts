export type * from "./conditions";
export type * from "./container";
export type * from "./styles";

export type Maybe<T> = T | undefined;
export type Writeable<T> = { -readonly [P in keyof T]: T[P] };

// The options passed to cssInterop
export type Config = {
  target: string | false;
  source: string;
  nativeStyleToProp?: Record<string, string | string[]>;
};
// cssInterop will add a key to the config
export type ConfigWithIndex = Config & { index: number };

export type Props = Record<string, any> | undefined | null;

export type Callback = () => void;

// Side effects are things that cannot be performed during a render. They will be invoked during an useEffect
export type SideEffectTrigger = Callback;

export type RenderGuard =
  | { type: "prop"; name: string; value: unknown }
  | { type: "variable"; name: string; value: unknown; global?: boolean }
  | { type: "container"; name: string; value: unknown };
