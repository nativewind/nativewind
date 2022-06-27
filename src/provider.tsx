import React from "react";
import { PropsWithChildren } from "react";

export function TailwindProvider({ children }: PropsWithChildren<unknown>) {
  return <>{children}</>;
}
