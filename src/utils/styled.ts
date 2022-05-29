export type StyledProps<P> = P & {
  className?: string;
  tw?: string;
};

export type StyledPropsWithKeys<P, K extends keyof P> = P & {
  className?: string;
  tw?: string;
} & { [key in K]: P[key] | string };

export type RWNCssStyle = {
  $$css: true;
  tailwindClassName: string;
};
