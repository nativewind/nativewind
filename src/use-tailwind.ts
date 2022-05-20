import { AtRuleRecord } from "./types/common";
import type { ChildClassNameSymbol } from "./with-styled-props";

export { useTailwind } from "./use-tailwind.web";

export type RWNCssStyle = {
  $$css: true;
  tailwindClassName: string;
};

export interface UseTailwindCallbackOptions<
  Flatten extends boolean | undefined
> {
  flatten?: Flatten;
}

export type UseTailwindCallback<P> = <
  Flatten extends boolean | undefined = true
>(
  className?: string,
  options?: UseTailwindCallbackOptions<Flatten>
) => UseTailwindCallbackResult<P, Flatten>;

export type UseTailwindCallbackResult<
  P,
  Flatten extends boolean | undefined = true
> = Flatten extends true
  ? WithChildClassNameSymbol<P>
  : WithChildClassNameSymbol<P[]>;

export type WithChildClassNameSymbol<T> = T & {
  [ChildClassNameSymbol]?: AtRuleRecord[];
};

export interface UseTailwindOptions {
  flatten?: boolean;
  hover?: boolean;
  focus?: boolean;
  active?: boolean;
  [ChildClassNameSymbol]?: string;
}
