import type { ContainerType } from "lightningcss";

export interface Container {
  // Names. False = 'none'
  n?: string | false | null;
  t?: ContainerType;
}
