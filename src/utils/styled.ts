export type StyledProps<P> = P & {
  className?: string;
  tw?: string;
  baseClassName?: string;
  baseTw?: string;
};

export type StyledPropsWithKeys<P, K extends keyof P> = StyledProps<P> & {
  [key in K]: P[key] | string;
};

export type RWNCssStyle = {
  $$css: true;
  tailwindClassName: string;
};
